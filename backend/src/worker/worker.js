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

    // PROCESSING
    await db.update(tasks)
      .set({ status: 'PROCESSING' })
      .where(eq(tasks.id, id))

    // SCRAPE
    const result = await scrapeWebsite(url)
    if (!result.success) {
      await db.update(tasks)
        .set({ status: 'FAILED', errorMessage: result.error })
        .where(eq(tasks.id, id))
      throw new Error(result.error)
    }

    // AI
    const aiResult = await answerQuestion({
      content: result.content,
      question,
    })

    if (!aiResult.success) {
      await db.update(tasks)
        .set({ status: 'FAILED', errorMessage: aiResult.error })
        .where(eq(tasks.id, id))
      throw new Error(aiResult.error)
    }

    // COMPLETED
    await db.update(tasks)
      .set({
        status: 'COMPLETED',
        aiResponse: aiResult.answer,
      })
      .where(eq(tasks.id, id))
  },
  { connection: redisConnection, concurrency: 3 }
)
