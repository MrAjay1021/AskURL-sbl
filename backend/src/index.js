import 'dotenv/config' 

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


app.get('/health', (req, res) => {
  res.json({ok: true})
})

app.listen(process.env.PORT || 5000)