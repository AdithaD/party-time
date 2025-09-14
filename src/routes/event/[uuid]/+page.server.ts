import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, cookies }) => {

    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    const userId = cookies.get('user');
    if (!userId) redirect(303, `/event/${uuid}/login`);

    const event = await db.select().from(events).where(eq(events.id, uuid));

    if (event.length == 0) error(404, "No event found for this UUID")

    return { event: event[0] }
};
