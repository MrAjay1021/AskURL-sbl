import express from 'express'
import { z } from 'zod'
import { db } from '../db/connection.js'
import { tasks } from '../db/schema.js'
import { addScrapeJob } from '../queue/addScrapeJob.js' 
import { eq } from 'drizzle-orm'


const router = express.Router()

const createTaskSchema = z.object({
  url: z
    .string()
    .url()
    .refine(
      (val) => val.startsWith('http://') || val.startsWith('https://'),
      { message: 'URL must start with http or https' }
    ),
  question: z.string().min(5).max(500),
})

router.post('/', async (req, res) => {
  try {
    const data = createTaskSchema.parse(req.body) // validating req.body

    const [task] = await db
      .insert(tasks)
      .values({
        url: data.url,
        question: data.question,
        status: 'PENDING', // inserting task in db with status pending
      })
      .returning({ // return task JSON
        id: tasks.id,
        url: tasks.url,
        question: tasks.question,
        status: tasks.status,
      })

    await addScrapeJob(task) // call

    res.status(201).json(task)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors }) 
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})



router.get('/:id', async (req, res) => {
  const id = Number(req.params.id) // Parse `id` as number
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))

    if (!task) {
      return res.status(404).json({ error: 'Not found' })
    }

    res.json(task)
  })



export default router