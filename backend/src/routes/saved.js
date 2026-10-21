import { Router } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { Opportunity } from '../models/Opportunity.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('savedOpportunities').lean()
    res.json((user?.savedOpportunities || []).map((id) => id.toString()))
  } catch (error) { next(error) }
})

router.post('/:opportunityId', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    if (!mongoose.isValidObjectId(opportunityId)) return res.status(404).json({ error: 'Opportunity not found.' })
    const exists = await Opportunity.exists({ _id: opportunityId })
    if (!exists) return res.status(404).json({ error: 'Opportunity not found.' })
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedOpportunities: opportunityId } },
      { new: true },
    ).select('savedOpportunities')
    res.json(user.savedOpportunities.map((id) => id.toString()))
  } catch (error) { next(error) }
})

router.delete('/:opportunityId', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    if (!mongoose.isValidObjectId(opportunityId)) return res.status(404).json({ error: 'Opportunity not found.' })
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedOpportunities: opportunityId } },
      { new: true },
    ).select('savedOpportunities')
    if (!user) return res.status(401).json({ error: 'Please sign in to continue.' })
    res.json(user.savedOpportunities.map((id) => id.toString()))
  } catch (error) { next(error) }
})

router.delete('/', async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { savedOpportunities: [] } })
    res.json([])
  } catch (error) { next(error) }
})

export default router
