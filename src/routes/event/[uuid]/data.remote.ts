import { command, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { availability } from "$lib/server/db/schema"
import { eq } from "drizzle-orm";
import { events } from "$lib/server/db/schema";

export const saveAvailability = command('unchecked', async (availabilities: number[]) => {
    const request = getRequestEvent();
    const user = request.locals.user!.id;

    console.log(availabilities)

    await db.delete(availability).where(eq(availability.user, user))
    await db.insert(availability).values(
        availabilities.map((a) => ({ user, timestamp: a }))
    );

    getTimestamps().refresh();
})

export const getTimestamps = query(async () => {
    const request = getRequestEvent();
    const eventId = request.locals.session!.event;

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