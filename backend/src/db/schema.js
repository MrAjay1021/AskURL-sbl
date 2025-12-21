// src/db/schema.js
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  question: text('question').notNull(),
  status: text('status').default('PENDING'),
  aiResponse: text('ai_response'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
})
