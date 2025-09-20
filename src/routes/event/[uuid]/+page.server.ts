import { db } from '$lib/server/db/index.js';
import { comments, events, pollOptions, polls, pollVotes, users } from '$lib/server/db/schema.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

export const load = async ({ params, locals }) => {
    const uuid = params.uuid;
    if (!uuid) error(400, 'malformed uuid');

    if (locals.session === null || locals.user === null) redirect(303, `/event/${uuid}/login`);
    const event = await db.query.events.findFirst({
        where: eq(events.id, uuid),
        with: {
            users: {
                columns: {
                    id: true,
                    name: true,
                    registered: true,
                }
            }
        }
    });

    if (!event) error(404, "Event could not be found");

    return { event, eventId: uuid, user: locals.user }
};


const postPollSchema = z.object({
    title: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
});

const updateVoteSchema = z.object({
    pollOption: z.number(),
    poll: z.number(),
});

export const actions = {
    postComment: async ({ request, locals, params }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);

        const formData = await request.formData();
        const comment = z.string().max(1000).safeParse(formData.get('comment'));
        if (!comment.success) return fail(400, "Invalid comment.")

        await db.insert(comments).values({
            user: locals.user.id,
            createdAt: new Date(),
            event: params.uuid,
            text: comment.data,
        })
    },
    postPoll: async ({ request, locals, params }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);

        const data = await request.formData();
        const object = {
            title: data.get('title'),
            options: data.getAll('option')
        };
        console.log(object)

        const pollData = postPollSchema.safeParse(object);

        console.log(pollData)

        if (pollData.success) {
            const poll = (await db.insert(polls).values({ event: locals.session.event, title: pollData.data.title, createdAt: new Date() }).returning()).at(0);
            if (!poll) error(500, "Failed to insert poll into database.")
            await db.insert(pollOptions).values(pollData.data.options.map((value) => { return { poll: poll.id, value } }))
        } else {
            fail(400, "Invalid poll input")
        }
    },
    updateVote: async ({ request, locals, params }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);


        const formData = await request.formData();
        const validationResult = updateVoteSchema.safeParse({ pollOption: formData.get('pollOption'), poll: formData.get('poll') });

        if (!validationResult.success) return fail(400, validationResult.error.message);
        const { poll, pollOption } = validationResult.data;

        // check if the poll option is actually part of that poll, and the poll is part of the event.
        const validOptionQuery = await db.select().from(pollOptions).innerJoin(polls, eq(pollOptions.poll, polls.id)).where(
            and(
                eq(pollOptions.id, pollOption),
                eq(pollOptions.poll, poll), // option is part of poll
                eq(polls.event, locals.session.event), // poll is part of event
            )
        );

        if (validOptionQuery.length != 1) return fail(400, "Relationship constraints were not satisified.");

        await db.insert(pollVotes).values({ poll, pollOption, user: locals.user.id }).onConflictDoUpdate({
            target: [pollVotes.poll, pollVotes.user],
            set: { pollOption: pollOption }
        })
    },
    registerInterest: async ({ locals, params }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);

        const user = await db.update(users).set({ registered: !locals.user.registered }).where(eq(users.id, locals.user.id)).returning();

        locals.user = user[0];
    },
    deleteComment: async ({ locals, params, request }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);

        const data = await request.formData();
        const parseResult = z.coerce.number().positive().safeParse(data.get('id'));
        if (!parseResult.success) return fail(400, "Invalid id");
        const id = parseResult.data;

        const result = await db.delete(comments).where(and(eq(comments.id, id), eq(comments.event, locals.session.event)));
        if (result.rowsAffected < 1) {
            return fail(400, "Couldn't find specified resource.")
        }
    },
    deletePoll: async ({ locals, params, request }) => {
        if (!locals.user || !locals.session) redirect(303, `/event/${params.uuid}/login`);
        if (locals.session.event != params.uuid) redirect(303, `/event/${params.uuid}/login`);

        const data = await request.formData();
        const parseResult = z.coerce.number().positive().safeParse(data.get('id'));
        console.log(parseResult)
        if (!parseResult.success) return fail(400, "Invalid id");

        const id = parseResult.data;

        const result = await db.delete(polls).where(and(eq(polls.id, id), eq(polls.event, locals.session.event)));
        if (result.rowsAffected < 1) {
            return fail(400, "Couldn't find specified resource.")
        }
    },
};