import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { availability } from "$lib/server/db/schema"
import { eq } from "drizzle-orm";
import { events } from "$lib/server/db/schema";
import z from "zod";
const saveAvailabilitySchema = z.object({
    user: z.string(),
    event: z.string(),
    availabilities: z.array(z.number())
});

export const saveAvailability = command(saveAvailabilitySchema, async ({ user, event, availabilities }: { user: string, event: string, availabilities: number[] }) => {

    await db.delete(availability).where(eq(availability.user, user))
    await db.insert(availability).values(
        availabilities.map((a) => ({ user: user, timestamp: a }))
    );

    getTimestamps(event).refresh();
})

export const getTimestamps = query("unchecked", async (eventId: string) => {
    const event = await db.query.events.findFirst(
        {
            where: eq(events.id, eventId),
            with: {
                users: {
                    with: {
                        availabilities: {
                            columns: {
                                timestamp: true,
                            }
                        }
                    }
                }
            }

        }
    );

    const usersPerTimestamp = event!.users.reduce((acc, val) => {
        val.availabilities.forEach((av) => {
            if (!acc.has(av.timestamp)) acc.set(av.timestamp, new Array<string>())
            acc.get(av.timestamp)!.push(val.id)
        })

        return acc
    }, new Map<number, string[]>())

    return usersPerTimestamp;
});