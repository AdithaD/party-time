import { db } from "$lib/server/db/index.js";
import { events, users } from "$lib/server/db/schema.js";
import { hashPassword } from "$lib/server/password.js";
import { createSession, generateSessionToken } from "$lib/server/session.js";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as crypto from "node:crypto";
import z from "zod";

const userDataSchema = z.object({
    name: z.string().min(1).max(30),
    password: z.string().min(1).max(30).optional(),
});

export const actions = {
    default: async ({ request, cookies, params }) => {
        const eventId = params.uuid;
        const formData = await request.formData();

        const parseResult = userDataSchema.safeParse({ name: formData.get('name'), password: formData.get('password') });

        if (!parseResult.success) return fail(400, parseResult.error.message)

        const { name, password } = parseResult.data;

        const event = await db.query.events.findFirst({
            where: eq(events.id, eventId),
            with: {
                users: {
                    where: eq(users.name, name),
                    limit: 1,
                }
            }
        });

        if (!event) {
            return fail(404, { messasge: "Event does not exist." })
        }

        if (event.users.length == 0) {
            // Register the user.
            const id = crypto.randomBytes(10).toString('hex');

            let passwordHash: string | undefined = undefined;
            if (password && password.length > 0) {
                passwordHash = await hashPassword(password);
            }

            const newUser = (await db.insert(users).values({ id, name, passwordHash, event: eventId }).returning())[0]

            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, newUser.id, eventId);
            cookies.set('session', sessionToken, { path: `/`, httpOnly: true, sameSite: 'lax', expires: session.expiresAt })

            redirect(303, `/event/${eventId}`)
        } else {
            const user = event.users[0];

            if (user.passwordHash) {
                if (!password || password.length == 0) return fail(403, { message: "Incorrect password" })

                const passwordHash = await hashPassword(password);
                const userHash = new TextEncoder().encode(passwordHash);
                const dbHash = new TextEncoder().encode(user.passwordHash);

                if (!constantTimeEqual(userHash, dbHash)) {
                    return fail(403, "Incorrect password")
                }
            }
            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, user.id, eventId);
            cookies.set('session', sessionToken, { path: `/`, httpOnly: true, sameSite: 'lax', expires: session.expiresAt })
            redirect(303, `/event/${eventId}`)
        }
    },
};