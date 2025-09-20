import { db } from "$lib/server/db";
import { events } from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { datetimeLocalToDate, daysOfWeek, daysOfWeekToBitfield } from "$lib/utils.js";
import z from "zod";
import { eq } from "drizzle-orm";
import { addDays } from "date-fns";

const daysOfWeekSchema = z.array(z.literal(daysOfWeek)).transform((val) => daysOfWeekToBitfield(new Set(val)));


const eventEditSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
    dateTimeFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).transform((string) => datetimeLocalToDate(string)).optional(),
    dateTimeTo: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).transform((string) => datetimeLocalToDate(string)).optional(),
    availability: z.union([
        z.object({
            availabilityType: z.literal('days'),
            availabilityDays: z.coerce.number().min(1),
            daysOfWeek: daysOfWeekSchema,
        }),
        z.object({
            availabilityType: z.literal('range'),
            availabilityFrom: z.coerce.date(),
            availabilityTo: z.coerce.date(),
            daysOfWeek: daysOfWeekSchema,
        })
    ]).transform((val) => {
        if (val.availabilityType == 'days') {
            return {
                start: new Date(),
                end: addDays(new Date(), val.availabilityDays),
                daysOfWeek: val.daysOfWeek,
            };
        } else {
            return {
                start: val.availabilityFrom,
                end: val.availabilityTo,
                daysOfWeek: val.daysOfWeek,
            };
        }
    })
});

export const actions = {
    edit: async ({ request, locals, params }) => {
        const data = await request.formData();

        if (locals.user === null || locals.session === null) redirect(303, `/event/${params.uuid}/login`)

        const object = Object.fromEntries(data.entries());
        const availability = {
            availabilityType: object.availabilityType,
            availabilityDays: object.availabilityDays,
            availabilityFrom: object.availabilityFrom,
            availabilityTo: object.availabilityTo,
            daysOfWeek: data.getAll('daysOfWeek')
        };

        const result = eventEditSchema.safeParse({ ...object, availability });

        if (result.success) {
            try {
                await db.update(events)
                    .set({ scheduledTime: result.data.dateTimeFrom, endTime: result.data.dateTimeTo, ...result.data, })
                    .where(eq(events.id, locals.session.event))
            } catch {
                return fail(500, { error: "Failed to update database" })
            }
            redirect(303, `/event/${locals.session.event}`)
        } else {
            console.log(result.error);
            return fail(400,
                { zodError: z.flattenError(result.error) }
            )
        }
    },
    deleteEvent: async ({ locals, params }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);

        await db.delete(events).where(eq(events.id, locals.session.event));

        redirect(303, '/')
    }
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
