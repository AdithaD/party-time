import { db } from '$lib/server/db/index.js';
import { comments, pollOptions, polls, pollVotes, users } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export const actions = {
    postComment: async ({ cookies, request }) => {
        const userId = cookies.get('user');
        if (!userId) error(401, "Unauthorised")

        const [user] = await db.select().from(users).where(eq(users.id, userId))
        if (!user) error(401, "Unauthorised")

        const data = await request.formData();
        const eventId = data.get('event');
        if (!eventId || typeof eventId != 'string') {
            error(400, "Invalid event id.")
        }

        const comment = data.get('comment');

        if (!comment || typeof comment !== 'string') {
            error(400, "Missing comment.")
        }

        await db.insert(comments).values({
            user: user.id,
            createdAt: new Date(),
            event: eventId,
            text: comment,
        })
    },
    postPoll: async ({ cookies, request }) => {
        const data = await request.formData();
        const eventId = data.get('event');
        if (!eventId || typeof eventId != 'string') {
            error(400, "Invalid event id.")
        }

        const userId = cookies.get('user');
        if (!userId) error(401, "Unauthorised")

        const [user] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.event, eventId)))
        if (!user) error(401, "Unauthorised")

        const title = validateString(data.get('title'), 'title');
        const options = data.getAll('option').map((o) => validateString(o, 'option'));

        const poll = (await db.insert(polls).values({ event: eventId, title, createdAt: new Date() }).returning()).at(0);

        if (!poll) error(500, "Failed to insert poll into database.")

        await db.insert(pollOptions).values(options.map((value) => { return { poll: poll.id, value } }))


    },
    updateVote: async ({ cookies, request }) => {
        const data = await request.formData();

        const pollOption = validateNumber(data.get('option'), "option");
        const poll = validateNumber(data.get('poll'), "poll");

        const user = cookies.get('user');
        if (!user) error(401, "Unauthorised")

        await db.insert(pollVotes).values({ poll, pollOption, user }).onConflictDoUpdate({
            target: [pollVotes.poll, pollVotes.user],
            set: { pollOption: pollOption }
        })
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