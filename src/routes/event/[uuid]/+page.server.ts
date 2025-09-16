import { db } from '$lib/server/db/index.js';
import { comments, events, pollOptions, polls, pollVotes, users } from '$lib/server/db/schema.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    if (locals.session === null || locals.user === null) redirect(303, `/event/${uuid}/login`);
    const event = db.query.events.findFirst({
        where: eq(events.id, uuid),
        with: {
            users: {
                columns: {
                    id: true,
                    name: true,
                    registered: true,
                },
                with: {
                    availabilities: {
                        columns: {
                            timestamp: true,
                        }
                    }
                }
            },
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
    }).execute();

    return { event, eventId: uuid, user: locals.user }
};

export const actions = {
    postComment: async ({ request, locals, params }) => {
        const eventId = params.uuid;
        if (!eventId || typeof eventId != 'string') {
            error(400, "Invalid event id.")
        }

        if (locals.user === null || locals.session === null) {
            redirect(303, `/event/${eventId}/login`)
        }

        const data = await request.formData();

        const comment = data.get('comment');

        if (!comment || typeof comment !== 'string') {
            error(400, "Missing comment.")
        }

        await db.insert(comments).values({
            user: locals.user.id,
            createdAt: new Date(),
            event: eventId,
            text: comment,
        })
    },
    postPoll: async ({ request, locals, params }) => {
        if (!locals.user) redirect(303, `/event/${params.uuid}/login`);

        const data = await request.formData();
        const eventId = data.get('event');
        if (!eventId || typeof eventId != 'string') {
            error(400, "Invalid event id.")
        }

        const title = validateString(data.get('title'), 'title');
        const options = data.getAll('option').map((o) => validateString(o, 'option'));

        const poll = (await db.insert(polls).values({ event: eventId, title, createdAt: new Date() }).returning()).at(0);

        if (!poll) error(500, "Failed to insert poll into database.")

        await db.insert(pollOptions).values(options.map((value) => { return { poll: poll.id, value } }))


    },
    updateVote: async ({ request, locals, params }) => {
        if (!locals.user) redirect(303, `/event/${params.uuid}/login`);

        const data = await request.formData();
        const pollOption = validateNumber(data.get('option'), "option");
        const poll = validateNumber(data.get('poll'), "poll");

        await db.insert(pollVotes).values({ poll, pollOption, user: locals.user.id }).onConflictDoUpdate({
            target: [pollVotes.poll, pollVotes.user],
            set: { pollOption: pollOption }
        })
    },
    registerInterest: async ({ locals, params }) => {
        if (!locals.user) redirect(303, `/event/${params.uuid}/login`);
        const user = await db.update(users).set({ registered: !locals.user.registered }).where(eq(users.id, locals.user.id)).returning();

        locals.user = user[0];
    }
};

function validateString(str: FormDataEntryValue | null, fieldName: string): string {
    if (!str || typeof str !== 'string') {
        error(400, `Invalid ${fieldName}`)
    }

    return str;
}

function validateNumber(str: FormDataEntryValue | null, fieldName: string): number {

    if (!str || typeof str !== 'string') {
        error(400, `Invalid ${fieldName}`)
    }
    let number: number;
    try {
        number = parseInt(str);
    } catch {
        error(400, "Invalid option id.")
    }
    return number;
}