import { Router } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const PAGE_SIZE = 18

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.q ?? '').trim().slice(0, 80)
    const year = String(req.query.year ?? '').trim().slice(0, 40)
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1))
    const filter = { _id: { $ne: req.user._id } }

    if (year) filter.year = year
    if (search) {
      const match = new RegExp(escapeRegex(search), 'i')
      filter.$or = [{ name: match }, { major: match }, { bio: match }, { skills: match }, { interests: match }]
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ name: 1, _id: 1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE),
      User.countDocuments(filter),
    ])
    res.json({ students: users.map((user) => user.toDirectoryProfile()), total, page, pages: Math.ceil(total / PAGE_SIZE) })
  } catch (error) { next(error) }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Student not found.' })
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Student not found.' })
    res.json(user.toDirectoryProfile())
  } catch (error) { next(error) }
})

export default router
