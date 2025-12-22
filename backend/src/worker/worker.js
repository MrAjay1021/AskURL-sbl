import { Worker } from 'bullmq'
import { eq } from 'drizzle-orm'
import { redisConnection } from '../queue/connection.js'
import { db } from '../db/connection.js'
import { tasks } from '../db/schema.js'

const worker = new Worker(
  'scrape-queue',
  async (job) => {
    const { id, url, question } = job.data

    // mark PROCESSING
    await db
      .update(tasks)
      .set({ status: 'PROCESSING' })
      .where(eq(tasks.id, id))

    console.log('Processing job', id, url, question)

    // fake AI work
    const fakeResponse = 'Test'

    // mark COMPLETED
    await db
      .update(tasks)
      .set({
        status: 'COMPLETED',
        aiResponse: fakeResponse,
      })
      .where(eq(tasks.id, id))
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
)
