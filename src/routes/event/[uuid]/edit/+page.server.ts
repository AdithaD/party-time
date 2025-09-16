import { db } from "$lib/server/db";
import { events } from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { datetimeLocalToDate } from "$lib/utils.js";
import z from "zod";
import { eq } from "drizzle-orm";

const eventEditSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
    dateTimeFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).transform((string) => datetimeLocalToDate(string)).optional(),
    dateTimeTo: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).transform((string) => datetimeLocalToDate(string)).optional(),
})

export const actions = {
    default: async ({ request, locals, params }) => {
        const data = await request.formData();

        if (locals.user === null || locals.session === null) redirect(303, `/event/${params.uuid}/login`)

        const result = eventEditSchema.safeParse(Object.fromEntries(data.entries()));

        if (result.success) {
            try {
                console.log('redirecting.')
                await db.update(events).set({ scheduledTime: result.data.dateTimeFrom, endTime: result.data.dateTimeTo, ...result.data })
            } catch {
                return fail(500, { error: "Failed to update database" })
            }
            redirect(303, `/event/${locals.session.event}`)
        } else {
            return fail(400,
                { zodError: z.flattenError(result.error) }
            )
        }
    },
}

export const load = async ({ params, locals }) => {
    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    if (locals.session === null || locals.user === null) redirect(303, `/event/${uuid}/login`);
    const event = await db.query.events.findFirst({
        where: eq(events.id, uuid),
    });

    if (!event) error(404, "Requested event does not exist");

    return { event, eventId: uuid, user: locals.user }
};
