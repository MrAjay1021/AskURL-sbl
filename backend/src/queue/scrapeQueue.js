import {Queue} from 'bullmq'
import { redisConnection } from './connection'

export const scrapeQueue = new Queue('scrape-queue', {
  connection: redisConnection,
})