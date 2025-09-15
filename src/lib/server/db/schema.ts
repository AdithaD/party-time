import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	scheduledTime: integer('scheduled_time', { mode: 'timestamp' }),
	endTime: integer('end_time', { mode: 'timestamp' }),
	description: text('description'),
	location: text('location'),

});

export const eventRelations = relations(events, ({ many }) => ({
	polls: many(polls),
	comments: many(comments),
	users: many(users)
}))

export type Event = typeof events.$inferSelect;

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	event: text('event').references(() => events.id).notNull(),
	name: text('name').notNull(),
	passwordHash: text('hash'),
	registered: integer('registered', { mode: 'boolean' }).default(false).notNull(),
})

export const userRelations = relations(users, ({ one, many }) => ({
	event: one(events, { fields: [users.event], references: [events.id] }),
	pollVotes: many(pollVotes)
}));

export type User = typeof users.$inferSelect;

export const polls = sqliteTable('polls', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	event: text('event').references(() => events.id).notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const pollsRelations = relations(polls, ({ one, many }) => ({
	pollOptions: many(pollOptions),
	event: one(events, { fields: [polls.event], references: [events.id] })
}));

export type Poll = typeof polls.$inferSelect;

export const pollOptions = sqliteTable('poll_options', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	poll: integer('poll').references(() => polls.id).notNull(),
	value: text('value').notNull(),
})

export const pollOptionsRelations = relations(pollOptions, ({ one, many }) => ({
	poll: one(polls, { fields: [pollOptions.poll], references: [polls.id] }),
	votes: many(pollVotes),
}))

export type PollOption = typeof pollOptions.$inferSelect;

export const pollVotes = sqliteTable('poll_votes', {
	user: text('user').references(() => users.id).notNull(),
	poll: integer('poll').references(() => polls.id).notNull(),
	pollOption: integer('poll_option').references(() => pollOptions.id).notNull(),
}, (table) => [primaryKey({ columns: [table.poll, table.user] })])

export const pollVotesRelations = relations(pollVotes, ({ one }) => ({
	pollOption: one(pollOptions, { fields: [pollVotes.pollOption], references: [pollOptions.id] }),
	user: one(users, { fields: [pollVotes.user], references: [users.id] })
}))

export type PollVotes = typeof pollVotes.$inferSelect;

export const comments = sqliteTable('comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	event: text('event').references(() => events.id).notNull(),
	user: text('user').references(() => users.id).notNull(),
	text: text('text').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	event: one(events, {
		fields: [comments.event], references: [events.id]
	}),
	user: one(users, {
		fields: [comments.user], references: [users.id]
	})
}))

export type Comment = typeof comments.$inferSelect;