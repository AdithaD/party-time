import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { availability } from "$lib/server/db/schema"
import { eq } from "drizzle-orm";
import { events } from "$lib/server/db/schema";
import z from "zod";
import { error } from "@sveltejs/kit";
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

export const getFeed = query(z.string(), async (eventId: string) => {
    const rawFeed = await db.query.events.findFirst({
        where: eq(events.id, eventId),
        with: {
            comments: {
                with: {
                    user: {
                        columns: {
                            name: true,
                        }
                    }
                }
            },
            polls: {
                with: {
                    pollOptions: {
                        with: {
                            votes: {
                                with: {
                                    user: {
                                        columns: {
                                            id: true,
                                            name: true,
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },
        }
    });

    if (!rawFeed) error(500, "Couldn't get event feed")

    const feed = [
        ...rawFeed.comments.map((c) => ({ comment: c, createdAt: c.createdAt, })),
        ...rawFeed.polls.map((p) => ({ poll: p, createdAt: p.createdAt }))]
        .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return feed;
});

export const getTimestamps = query(z.string(), async (eventId: string) => {
    const event = await db.query.events.findFirst(
        {
            where: eq(events.id, eventId),
            with: {
                users: {
                    columns: {
                        id: true,
                        name: true,
                    },
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
            if (!acc.has(av.timestamp)) acc.set(av.timestamp, new Array<{ id: string; name: string }>())
            acc.get(av.timestamp)!.push({ id: val.id, name: val.name })
        })

        return acc
    }, new Map<number, { id: string; name: string; }[]>())

    return usersPerTimestamp;
});