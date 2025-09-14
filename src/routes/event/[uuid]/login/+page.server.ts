import { db } from "$lib/server/db/index.js";
import { users } from "$lib/server/db/schema.js";
import { hashPassword } from "$lib/server/password.js";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import { fail, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import * as crypto from "node:crypto";

export const actions = {
    default: async ({ request, cookies, params }) => {
        const uuid = params.uuid;
        const formData = await request.formData();

        const name = formData.get('name');
        const password = formData.get('password') as string;

        if (typeof name !== "string" || typeof password !== "string") {
            console.log(name)
            console.log(typeof password)
            return fail(400, {
                message: "Invalid or missing fields",
                email: ""
            });
        }

        if (name === "") {
            return fail(400, {
                message: "Please enter your username and password.",
                username: name
            });
        }


        const query = await db.select().from(users).where(and(eq(users.name, name), eq(users.event, uuid)))
        if (query.length == 0) {
            // Register the user.
            const id = crypto.randomBytes(10).toString('hex');
            const passwordHash = password.length > 0 ? await hashPassword(password) : null;
            const newUser = (await db.insert(users).values({ id, name, passwordHash, event: uuid }).returning())[0]
            cookies.set('user', newUser.id, { path: "/" })

            redirect(303, `/event/${uuid}`)
        } else {
            const user = query[0];

            if (user.passwordHash) {
                const passwordHash = await hashPassword(password);
                const userHash = new TextEncoder().encode(passwordHash);
                const dbHash = new TextEncoder().encode(user.passwordHash);

                if (!constantTimeEqual(userHash, dbHash)) {
                    return fail(403, "Incorrect password")
                }
            }
            cookies.set('user', user.id, { path: "/" })
            redirect(303, `/event/${uuid}`)
        }
    },
};