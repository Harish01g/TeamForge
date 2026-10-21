import { Router } from 'express'
import mongoose from 'mongoose'
import { Opportunity } from '../models/Opportunity.js'
import { JoinRequest } from '../models/JoinRequest.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

function memberOf(opportunity, userId) {
  const id = String(userId)
  return opportunity.creator?.id === id || opportunity.members?.some((member) => member?.id === id)
}

function presentTeam(opportunity, userId) {
  const members = opportunity.members || []
  const membership = members.find((member) => member?.id === String(userId))
  return {
    id: opportunity._id.toString(),
    name: opportunity.title,
    description: opportunity.description,
    status: members.length > 1 ? 'Active' : 'Planning',
    myRole: opportunity.creator?.id === String(userId) ? 'Team lead' : membership?.role || 'Team member',
    members: members.map((member) => ({ ...member, id: String(member.id) })),
    milestones: (opportunity.milestones || []).map((milestone) => ({
      id: milestone._id.toString(), title: milestone.title, due: milestone.due, done: milestone.done,
    })),
    resources: [],
  }
}

router.get('/', async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      $or: [{ 'creator.id': req.user.id }, { 'members.id': req.user.id }],
    }).sort({ updatedAt: -1 })
    res.json(opportunities.map((opportunity) => presentTeam(opportunity, req.user.id)))
  } catch (error) { next(error) }
})

router.post('/:teamId/milestones', async (req, res, next) => {
  try {
    const { teamId } = req.params
    if (!mongoose.isValidObjectId(teamId)) return res.status(404).json({ error: 'Team not found.' })
    const title = String((req.body || {}).title ?? '').trim()
    const due = String((req.body || {}).due ?? '')
    if (title.length < 2 || title.length > 120) return res.status(400).json({ error: 'Enter a milestone title between 2 and 120 characters.' })
    const parsedDue = new Date(`${due}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due) || Number.isNaN(parsedDue.valueOf()) || parsedDue.toISOString().slice(0, 10) !== due) return res.status(400).json({ error: 'Choose a valid due date.' })
    const opportunity = await Opportunity.findById(teamId)
    if (!opportunity || !memberOf(opportunity, req.user.id)) return res.status(404).json({ error: 'Team not found.' })
    if (opportunity.milestones.length >= 50) return res.status(409).json({ error: 'This team already has the maximum of 50 milestones.' })
    opportunity.milestones.push({ title, due, done: false })
    const milestone = opportunity.milestones[opportunity.milestones.length - 1]
    await opportunity.save()
    res.status(201).json({ id: milestone._id.toString(), title: milestone.title, due: milestone.due, done: milestone.done })
  } catch (error) { next(error) }
})

router.patch('/:teamId/milestones/:milestoneId', async (req, res, next) => {
  try {
    const { teamId, milestoneId } = req.params
    if (!mongoose.isValidObjectId(teamId) || !mongoose.isValidObjectId(milestoneId)) return res.status(404).json({ error: 'Milestone not found.' })
    if (typeof (req.body || {}).done !== 'boolean') return res.status(400).json({ error: 'Choose whether the milestone is complete.' })
    const opportunity = await Opportunity.findById(teamId)
    if (!opportunity || !memberOf(opportunity, req.user.id)) return res.status(404).json({ error: 'Milestone not found.' })
    const milestone = opportunity.milestones.id(milestoneId)
    if (!milestone) return res.status(404).json({ error: 'Milestone not found.' })
    milestone.done = req.body.done
    await opportunity.save()
    res.json({ id: milestone._id.toString(), title: milestone.title, due: milestone.due, done: milestone.done })
  } catch (error) { next(error) }
})

router.delete('/:teamId/membership', async (req, res, next) => {
  try {
    const { teamId } = req.params
    if (!mongoose.isValidObjectId(teamId)) return res.status(404).json({ error: 'Team not found.' })
    const opportunity = await Opportunity.findById(teamId)
    if (!opportunity || opportunity.creator?.id === req.user.id) return res.status(403).json({ error: 'The team lead cannot leave their own opportunity.' })
    const member = opportunity.members?.some((item) => item?.id === req.user.id)
    if (!member) return res.status(404).json({ error: 'Team not found.' })
    opportunity.members = opportunity.members.filter((item) => item?.id !== req.user.id)
    opportunity.openSpots += 1
    await opportunity.save()
    await JoinRequest.updateOne({ opportunity: opportunity._id, applicant: req.user._id, status: 'Accepted' }, { $set: { status: 'Withdrawn' } })
    res.json({ left: true })
  } catch (error) { next(error) }
})

export default router
