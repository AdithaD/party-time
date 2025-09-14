import { db } from "$lib/server/db";
import { events, users, } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { datetimeLocalToDate } from "$lib/utils.js";

export const actions = {
    default: async ({ request, cookies }) => {
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

        const dateTimeFrom = data.get('datetime-from');
        const dateTimeTo = data.get('datetime-to');

        if (!dateTimeFrom || typeof dateTimeFrom !== 'string' || !dateTimeTo || typeof dateTimeTo !== 'string') error(400, "Missing scheduling datetimes")

        let scheduledTime: Date | null = null
        try {
            scheduledTime = datetimeLocalToDate(dateTimeFrom);
        } catch {
            error(400, "Couldn't parse start time.")
        }
        let endTime: Date | null = null
        try {
            endTime = datetimeLocalToDate(dateTimeTo);
        } catch {
            error(400, "Couldn't parse end time.")
        }

        try {
            await db.update(events).set({ title, description, location, scheduledTime, endTime })
        } catch {
            error(500, "failed to update databse")
        }

        redirect(303, `/event/${eventId}`)

    },
}

