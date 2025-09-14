import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export const actions = {
    update: async ({ request, cookies }) => {
        const data = await request.formData();
        const eventId = data.get('event')
        if (!eventId || typeof eventId !== 'string') error(404, "Event id not specified.")

        const userId = cookies.get('user');
        if (!userId) error(401, "Unauthorised")

        const [user] = await db.select().from(users).where(and(eq(users.event, eventId), (eq(users.id, userId))))
        if (!user) error(401, "Unauthorised")

        const title = data.get('title');

        if (typeof title !== 'string') {
            error(400, 'Title is required.')
        }

        const description = data.get('description');
        if (description && typeof description !== 'string') {
            error(400, "Description must be a string or null")
        }

        const location = data.get('location');
        if (location && typeof location !== 'string') {
            error(400, "Location must be a string or null")
        }


    },
    registerInterest: async ({ cookies }) => {
        const userId = cookies.get('user');
        if (!userId) error(401, "Unauthorised")

        const [user] = await db.select().from(users).where(eq(users.id, userId))
        if (!user) error(401, "Unauthorised")

        const result = await db.update(users).set({ registered: !user.registered }).where(eq(users.id, userId))

        if (result.rowsAffected < 1) error(500, "Internal Server Error.")
    }
};