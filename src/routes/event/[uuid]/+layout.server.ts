import { db } from "$lib/server/db";
import { events, users } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

export const load = async ({ params, cookies }) => {
    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    const userId = cookies.get('user');
    if (!userId) redirect(303, `/event/${uuid}/login`);

    const [user] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.event, uuid)))
    if (!user) redirect(303, `/event/${uuid}/login`);

    const event = await db.query.events.findFirst({
        where: eq(events.id, uuid),
        with: {
            users: true,
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
    })

    if (!event) error(404, "Specified event not found.")

    return { event, user }
};