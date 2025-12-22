import { Worker } from 'bullmq'
import { eq } from 'drizzle-orm'
import { redisConnection } from '../queue/connection.js'
import { db } from '../db/connection.js'
import { tasks } from '../db/schema.js'
import { scrapeWebsite } from '../scraper/scrape.js'

const worker = new Worker(
  'scrape-queue',
  async (job) => {
    const { id, url, question } = job.data

    await db.update(tasks)
      .set({ status: 'PROCESSING' }) // status processing at start
      .where(eq(tasks.id, id))

    const result = await scrapeWebsite(url) // calling 

      // If !result.success update DB with status = 'FAILED' showing errorMessage = result.error and throw error
    if (!result.success) {
      await db.update(tasks)
        .set({ status: 'FAILED', errorMessage: result.error })
        .where(eq(tasks.id, id))
      throw new Error(result.error)
    }

    const scrapedContent = result.content // if success store here
    await db
      .update(tasks)
      .set({
        status: 'COMPLETED',
        aiResponse: 'Scraped OK (no AI yet)',
      })
      .where(eq(tasks.id, id))
      },
  { connection: redisConnection, concurrency: 3 }
)
