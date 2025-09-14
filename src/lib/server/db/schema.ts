import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	scheduledTime: integer('scheduled_time', { mode: 'timestamp' }),
	endTime: integer('end_time', { mode: 'timestamp' }),
	description: text('description'),
	location: text('location'),

});

export type Event = typeof events.$inferSelect;

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	event: text('event').references(() => events.id).notNull(),
	name: text('name').notNull(),
	passwordHash: text('hash'),
	registered: integer('registered', { mode: 'boolean' }).default(false).notNull(),
})

export type User = typeof users.$inferSelect;

export const polls = sqliteTable('polls', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description'),
})

export const pollsRelations = relations(polls, ({ many }) => ({
	pollOptions: many(pollOptions)
}));

export type Poll = typeof polls.$inferSelect;

export const pollOptions = sqliteTable('poll_options', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	poll: integer('id').references(() => polls.id).notNull(),
	value: text('value').notNull(),
})

export const pollOptionsRelations = relations(pollOptions, ({ one, many }) => ({
	poll: one(polls, { fields: [pollOptions.poll], references: [polls.id] }),
	votes: many(pollVotes),
}))

export type PollOption = typeof pollOptions.$inferSelect;

export const pollVotes = sqliteTable('poll_votes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pollOption: integer('poll_option').references(() => pollOptions.id).notNull(),
	name: text('value').notNull(),
})

export const pollVotesRelations = relations(pollVotes, ({ one }) => ({
	pollOption: one(pollOptions, { fields: [pollVotes.id], references: [pollOptions.id] })
}))

export type PollVotes = typeof pollVotes.$inferSelect;