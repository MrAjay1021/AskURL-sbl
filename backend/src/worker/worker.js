import { Worker } from 'bullmq'
import { eq } from 'drizzle-orm'
import { redisConnection } from '../queue/connection.js'
import { db } from '../db/connection.js'
import { tasks } from '../db/schema.js'
import { scrapeWebsite } from '../scraper/scrape.js'
import { answerQuestion } from '../ai/answer.js'

new Worker(
  'scrape-queue',
  async (job) => {
    const { id, url, question } = job.data

    await db.update(tasks)
      .set({ status: 'PROCESSING', updatedAt: new Date() })
      .where(eq(tasks.id, id))

    const result = await scrapeWebsite(url)
    if (!result.success) {
      await db.update(tasks)
        .set({ status: 'FAILED', errorMessage: result.error, updatedAt: new Date() })
        .where(eq(tasks.id, id))
      throw new Error(result.error)
    }

    const ai = await answerQuestion({ content: result.content, question })
    if (!ai.success) {
      await db.update(tasks)
        .set({ status: 'FAILED', errorMessage: ai.error, updatedAt: new Date() })
        .where(eq(tasks.id, id))
      throw new Error(ai.error)
    }

    await db.update(tasks)
      .set({
        status: 'COMPLETED',
        aiResponse: ai.answer,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
  },
  { connection: redisConnection, concurrency: 3 }
)
