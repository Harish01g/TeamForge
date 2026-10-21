import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import opportunityRoutes from './routes/opportunities.js'
import authRoutes from './routes/auth.js'
import studentRoutes from './routes/students.js'
import joinRequestRoutes from './routes/joinRequests.js'
import messageRoutes from './routes/messages.js'
import notificationRoutes from './routes/notifications.js'
import savedRoutes from './routes/saved.js'
import teamRoutes from './routes/teams.js'

const app = express()
const port = process.env.PORT || 4000
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.resolve(currentDir, '../../frontend/dist')

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/join-requests', joinRequestRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/saved', savedRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/opportunities', opportunityRoutes)

app.use(express.static(frontendDist))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to backend/.env before starting the server.')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teamforge')
  app.listen(port, () => console.log(`TeamForge API listening on port ${port}`))
} catch (error) {
  console.error('Could not connect to MongoDB. Check MONGODB_URI and make sure MongoDB is running.', error.message)
  process.exit(1)
}
