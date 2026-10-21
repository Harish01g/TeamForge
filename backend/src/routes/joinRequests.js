import { Router } from 'express'
import mongoose from 'mongoose'
import { JoinRequest } from '../models/JoinRequest.js'
import { Opportunity } from '../models/Opportunity.js'
import { Notification } from '../models/Notification.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

async function createNotificationSafely(notification) {
  try {
    await Notification.create(notification)
  } catch (error) {
    // The request/decision is already saved. An alert failure should not make
    // the client think the main action failed or encourage a duplicate retry.
    console.error('Could not save notification:', error.message)
  }
}

function present(request, opportunity = request.opportunity, applicant = request.applicant) {
  return {
    id: request._id.toString(),
    opportunityId: opportunity?._id?.toString() || request.opportunity?.toString(),
    applicantId: applicant?._id?.toString() || request.applicant?.toString(),
    message: request.message,
    status: request.status,
    createdAt: request.createdAt,
    applicant: applicant?.toDirectoryProfile?.(),
    opportunity: opportunity ? {
      id: opportunity._id.toString(),
      title: opportunity.title,
      creator: { id: opportunity.creator.id, name: opportunity.creator.name },
    } : null,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const owned = await Opportunity.find({ 'creator.id': req.user.id }).select('_id').lean()
    const records = await JoinRequest.find({
      $or: [{ applicant: req.user._id }, { opportunity: { $in: owned.map((item) => item._id) } }],
    }).sort({ createdAt: -1 }).populate('applicant').populate('opportunity')
    res.json(records.filter((item) => item.opportunity && item.applicant).map((item) => present(item)))
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body || {}
    const { opportunityId } = payload
    const message = String(payload.message ?? '').trim()
    if (!mongoose.isValidObjectId(opportunityId)) return res.status(400).json({ error: 'Choose a valid opportunity.' })
    if (message.length > 300) return res.status(400).json({ error: 'Keep your message under 300 characters.' })

    const opportunity = await Opportunity.findById(opportunityId)
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' })
    if (opportunity.creator.id === req.user.id) return res.status(403).json({ error: 'You cannot request to join your own opportunity.' })
    if (opportunity.openSpots < 1) return res.status(409).json({ error: 'This team is already full.' })
    const deadline = new Date(`${opportunity.deadline}T23:59:59.999Z`)
    if (!Number.isNaN(deadline.valueOf()) && deadline < new Date()) return res.status(409).json({ error: 'Applications for this opportunity are closed.' })

    const existing = await JoinRequest.findOne({ opportunity: opportunity._id, applicant: req.user._id })
    if (existing && ['Pending', 'Accepted'].includes(existing.status)) {
      return res.status(409).json({ error: existing.status === 'Accepted' ? 'You have already joined this team.' : 'You already have a request for this opportunity.' })
    }
    let request
    if (existing) {
      existing.message = message
      existing.status = 'Pending'
      request = await existing.save()
    } else {
      request = await JoinRequest.create({ opportunity: opportunity._id, applicant: req.user._id, message })
    }
    if (mongoose.isValidObjectId(opportunity.creator.id)) {
      await createNotificationSafely({
        recipient: opportunity.creator.id,
        opportunity: opportunity._id,
        type: 'request',
        title: 'New request to join',
        body: `${req.user.name} requested to join “${opportunity.title}”.`,
        link: '/teams',
      })
    }
    res.status(201).json(present(request, opportunity, req.user))
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'You already have a request for this opportunity.' })
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Join request not found.' })
    const nextStatus = String((req.body || {}).status ?? '')
    if (!['Accepted', 'Declined', 'Withdrawn'].includes(nextStatus)) return res.status(400).json({ error: 'Choose a valid request action.' })

    const request = await JoinRequest.findById(req.params.id).populate('applicant').populate('opportunity')
    if (!request || !request.applicant || !request.opportunity) return res.status(404).json({ error: 'Join request not found.' })
    const isOwner = request.opportunity.creator.id === req.user.id
    const isApplicant = request.applicant._id.equals(req.user._id)
    if (nextStatus === 'Withdrawn' ? !isApplicant : !isOwner) return res.status(403).json({ error: 'You cannot update this join request.' })
    if (request.status !== 'Pending') return res.status(409).json({ error: 'This request is no longer pending.' })

    if (nextStatus === 'Accepted') {
      const claimed = await JoinRequest.findOneAndUpdate(
        { _id: request._id, status: 'Pending' },
        { $set: { status: 'Accepted' } },
        { new: true },
      )
      if (!claimed) return res.status(409).json({ error: 'This request has already been handled.' })
      const applicantId = request.applicant._id.toString()
      const updatedOpportunity = await Opportunity.findOneAndUpdate(
        { _id: request.opportunity._id, openSpots: { $gt: 0 }, 'members.id': { $ne: applicantId } },
        { $inc: { openSpots: -1 }, $push: { members: { id: applicantId, name: request.applicant.name, role: 'Team member' } } },
        { new: true },
      )
      if (!updatedOpportunity) {
        await JoinRequest.updateOne({ _id: claimed._id, status: 'Accepted' }, { $set: { status: 'Pending' } })
        return res.status(409).json({ error: 'There are no open spots left in this team.' })
      }
      if (updatedOpportunity.openSpots === 0) {
        await JoinRequest.updateMany(
          { opportunity: updatedOpportunity._id, status: 'Pending', applicant: { $ne: request.applicant._id } },
          { $set: { status: 'Declined' } },
        )
      }
      request.status = 'Accepted'
      await createNotificationSafely({
        recipient: request.applicant._id,
        opportunity: updatedOpportunity._id,
        type: 'team',
        title: 'Your request was accepted',
        body: `You joined “${updatedOpportunity.title}”. Your team chat is ready.`,
        link: `/opportunities/${updatedOpportunity._id}`,
      })
      return res.json({ request: present(request, updatedOpportunity, request.applicant), opportunity: { ...updatedOpportunity.toObject(), id: updatedOpportunity._id.toString() } })
    }

    request.status = nextStatus
    await request.save()
    if (nextStatus === 'Declined') {
      await createNotificationSafely({
        recipient: request.applicant._id,
        opportunity: request.opportunity._id,
        type: 'request',
        title: 'Request update',
        body: `Your request to join “${request.opportunity.title}” was declined.`,
        link: `/opportunities/${request.opportunity._id}`,
      })
    }
    res.json({ request: present(request), opportunity: { ...request.opportunity.toObject(), id: request.opportunity._id.toString() } })
  } catch (error) { next(error) }
})

export default router
