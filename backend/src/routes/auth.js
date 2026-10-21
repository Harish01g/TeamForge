import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createToken(user) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: user._id.toString(), expiresIn: '7d' })
}

function sendAuthResult(res, user, status = 200) {
  res.status(status).json({ token: createToken(user), user: user.toPublicProfile() })
}

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name ?? '').trim()
    const email = String(req.body.email ?? '').trim().toLowerCase()
    const password = String(req.body.password ?? '')
    if (name.length < 2) return res.status(400).json({ error: 'Enter your name (at least 2 characters).' })
    if (!emailPattern.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
    if (password.length < 8) return res.status(400).json({ error: 'Your password must be at least 8 characters.' })
    const existing = await User.exists({ email })
    if (existing) return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash })
    sendAuthResult(res, user, 201)
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' })
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email ?? '').trim().toLowerCase()
    const password = String(req.body.password ?? '')
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    sendAuthResult(res, user)
  } catch (error) { next(error) }
})

router.get('/me', requireAuth, (req, res) => res.json(req.user.toPublicProfile()))

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const allowed = ['name', 'year', 'major', 'bio', 'skills', 'interests', 'availability', 'github', 'portfolio']
    for (const key of allowed) {
      if (Object.hasOwn(req.body, key)) req.user[key] = req.body[key]
    }
    await req.user.save()
    res.json(req.user.toPublicProfile())
  } catch (error) { next(error) }
})

export default router
