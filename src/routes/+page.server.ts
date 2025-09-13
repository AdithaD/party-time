import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const uuid = crypto.randomUUID();

        const formData = await request.formData();

        const title = formData.get('title');
        if (typeof title !== 'string' || title.length === 0) {
            return { error: 'Title is required' };
        }

        await db.insert(events).values({
            id: uuid,
            title,
        });

        redirect(303, `/event/${uuid}`); // Redirect to the new event page
    }
};