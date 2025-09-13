import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	startTime: integer('scheduled_time'),
	endTime: integer('end_time'),
	description: text('description'),

});

export type Event = typeof events.$inferSelect;