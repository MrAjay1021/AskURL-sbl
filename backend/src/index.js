import 'dotenv/config' 

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


import tasksRouter from './routes/tasks.js';
app.use('/api/tasks', tasksRouter)

// error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})


// server health check
app.get('/health', (req, res) => {
  res.json({ok: true})
})

app.listen(process.env.PORT || 5000)
//



// job execution imports
// import { db } from './db/connection.js'
// import { tasks } from './db/schema.js'
// import { addScrapeJob } from './queue/addScrapeJob.js'
//

// checking job execution
/*
app.post('/debug-job', async (req, res) => {
  const [task] = await db
    .insert(tasks)
    .values({
      url: 'https://example.com',
      question: 'Test question',
      status: 'PENDING',
    })
    .returning()

  await addScrapeJob(task)

  res.json(task)
})

*/
