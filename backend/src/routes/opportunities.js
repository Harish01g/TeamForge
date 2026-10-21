import { Router } from 'express'
import mongoose from 'mongoose'
import { Opportunity } from '../models/Opportunity.js'
import { JoinRequest } from '../models/JoinRequest.js'
import { Message } from '../models/Message.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { q, category, mode, commitment, sort } = req.query
    const filter = {}
    if (category) filter.category = category
    if (mode) filter.mode = mode
    if (commitment) filter.commitment = commitment
    if (q) {
      const safeQuery = String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { title: { $regex: safeQuery, $options: 'i' } },
        { description: { $regex: safeQuery, $options: 'i' } },
        { requiredSkills: { $regex: safeQuery, $options: 'i' } },
      ]
    }
    const order = sort === 'popular' ? { interestedCount: -1, createdAt: -1 } : { createdAt: -1 }
    const opportunities = await Opportunity.find(filter).sort(order).lean()
    res.json(opportunities.map(({ _id, ...opportunity }) => ({ ...opportunity, id: _id.toString() })))
  } catch (error) { next(error) }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Opportunity not found' })
    const opportunity = await Opportunity.findById(req.params.id).lean()
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' })
    const { _id, ...rest } = opportunity
    res.json({ ...rest, id: _id.toString() })
  } catch (error) { next(error) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const payload = req.body
    const opportunity = await Opportunity.create({
      ...payload,
      openSpots: Number(payload.teamSize) - 1,
      creator: { id: req.user.id, name: req.user.name, year: req.user.year, major: req.user.major, bio: req.user.bio },
      members: [{ id: req.user.id, name: req.user.name, role: 'Team lead' }],
    })
    const result = opportunity.toObject()
    res.status(201).json({ ...result, id: result._id.toString(), _id: undefined })
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
    next(error)
  }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Opportunity not found.' })
    const opportunity = await Opportunity.findOne({ _id: req.params.id, 'creator.id': req.user.id })
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' })

    const payload = req.body || {}
    const editableFields = ['title', 'description', 'category', 'goals', 'requiredSkills', 'niceToHaveSkills', 'teamSize', 'deadline', 'timeline', 'mode', 'commitment', 'contactPreference']
    for (const field of editableFields) {
      if (Object.hasOwn(payload, field)) opportunity[field] = payload[field]
    }
    const memberCount = opportunity.members?.length || 1
    if (!Number.isInteger(Number(opportunity.teamSize)) || Number(opportunity.teamSize) < memberCount) {
      return res.status(409).json({ error: `Team size cannot be smaller than the ${memberCount} current team member${memberCount === 1 ? '' : 's'}.` })
    }
    opportunity.openSpots = Number(opportunity.teamSize) - memberCount
    await opportunity.save()
    const result = opportunity.toObject()
    res.json({ ...result, id: result._id.toString(), _id: undefined })
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
    next(error)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Opportunity not found' })
    const deleted = await Opportunity.findOneAndDelete({ _id: req.params.id, 'creator.id': req.user.id })
    if (!deleted) return res.status(404).json({ error: 'Opportunity not found' })
    await JoinRequest.deleteMany({ opportunity: deleted._id })
    await Message.deleteMany({ opportunity: deleted._id })
    await Notification.deleteMany({ opportunity: deleted._id })
    await User.updateMany({ savedOpportunities: deleted._id }, { $pull: { savedOpportunities: deleted._id } })
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
