import {Queue} from 'bullmq'
import { redisConnection } from './connection.js'

export const scrapeQueue = new Queue('scrape-queue', {
  connection: redisConnection,
})