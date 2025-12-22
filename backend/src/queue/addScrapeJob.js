// src/queue/addScrapeJob.js
import { scrapeQueue } from './scrapeQueue.js'

export async function addScrapeJob(task) {
  await scrapeQueue.add(
    'scrape',
    {
      id: task.id,
      url: task.url,
      question: task.question,
    },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    }
  )
}
