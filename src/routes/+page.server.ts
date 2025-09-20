import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';

export const actions = {
    default: async ({ request }) => {
        const uuid = crypto.randomUUID();

        const formData = await request.formData();

        const parsedFormData = z.string().min(1).max(50).safeParse(formData.get('title'));
        if (!parsedFormData.success) return fail(400, parsedFormData.error.message)

        await db.insert(events).values({
            id: uuid,
            title: parsedFormData.data,
        });

        redirect(303, `/event/${uuid}`); // Redirect to the new event page
    }
};