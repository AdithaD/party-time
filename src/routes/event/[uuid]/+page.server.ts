import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    const uuid = params.uuid;
    console.log(uuid)
    if (!uuid) error(400, 'malformed uuid');

    const event = await db.select().from(events).where(eq(events.id, uuid));

    if (event.length == 0) error(404, "No event found for this UUID")

    return { event: event[0] }
};