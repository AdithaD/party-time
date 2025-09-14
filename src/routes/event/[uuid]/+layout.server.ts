import { db } from "$lib/server/db";
import { events, users, type User, type Event } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

export const load = async ({ params, cookies }) => {
    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    const userId = cookies.get('user');
    if (!userId) redirect(303, `/event/${uuid}/login`);

    const [user] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.event, uuid)))
    if (!user) redirect(303, `/event/${uuid}/login`);

    const rows = await db.select().from(events).where(and(eq(events.id, uuid))).leftJoin(users, and(eq(events.id, users.event), eq(users.registered, true)));

    if (rows.length == 0) error(404, "No event found for this UUID")
    const result = rows.reduce<{ events: Event; users: User[] }>(
        (acc, row) => {
            const user = row.users;
            if (user) {
                acc.users.push(user);
            }
            return acc;
        },
        { events: rows[0].events, users: [] }
    );

    return { event: result.events, users: result.users, user }
};