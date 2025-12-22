// src/queue/connection.js
import Redis from 'ioredis'

export const redisConnection = new Redis(process.env.REDIS_URL)
