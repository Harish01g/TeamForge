import { Router } from 'express'
import mongoose from 'mongoose'
import { Message } from '../models/Message.js'
import { Opportunity } from '../models/Opportunity.js'
import { Notification } from '../models/Notification.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

async function createNotificationsSafely(notifications) {
  if (!notifications.length) return
  try {
    await Notification.insertMany(notifications)
  } catch (error) {
    // The message is already saved; keep its successful response independent
    // from whether notification records could be written.
    console.error('Could not save message notifications:', error.message)
  }
}

function isOnTeam(opportunity, userId) {
  const id = String(userId)
  return opportunity.creator?.id === id || opportunity.members?.some((member) => member?.id === id)
}

function presentMessage(message, userId) {
  const sender = message.sender
  const senderId = sender?._id?.toString() || message.sender?.toString()
  return {
    id: message._id.toString(),
    from: senderId === String(userId) ? 'me' : 'them',
    senderId,
    senderName: sender?.name || 'Team member',
    text: message.text,
    sentAt: message.createdAt,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      $or: [{ 'creator.id': req.user.id }, { 'members.id': req.user.id }],
    }).sort({ updatedAt: -1 }).lean()

    const conversations = await Promise.all(opportunities.map(async (opportunity) => {
      const [recent, unread] = await Promise.all([
        Message.find({ opportunity: opportunity._id }).sort({ createdAt: -1 }).limit(100).populate('sender', 'name'),
        Message.countDocuments({ opportunity: opportunity._id, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } }),
      ])
      const messages = recent.reverse().map((message) => presentMessage(message, req.user.id))
      return {
        id: opportunity._id.toString(),
        opportunityId: opportunity._id.toString(),
        name: opportunity.title,
        context: `Team chat · ${opportunity.members?.length || 1} member${(opportunity.members?.length || 1) === 1 ? '' : 's'}`,
        unread,
        lastMessageAt: messages.at(-1)?.sentAt || opportunity.updatedAt,
        messages,
      }
    }))

    conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
    res.json(conversations)
  } catch (error) { next(error) }
})

router.post('/:opportunityId', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    const text = String((req.body || {}).text ?? '').trim()
    if (!mongoose.isValidObjectId(opportunityId)) return res.status(404).json({ error: 'Team chat not found.' })
    if (!text) return res.status(400).json({ error: 'Write a message before sending.' })
    if (text.length > 2000) return res.status(400).json({ error: 'Keep messages under 2,000 characters.' })

    const opportunity = await Opportunity.findById(opportunityId).select('title creator members')
    if (!opportunity || !isOnTeam(opportunity, req.user.id)) return res.status(403).json({ error: 'Only current team members can use this chat.' })

    const message = await Message.create({ opportunity: opportunity._id, sender: req.user._id, text, readBy: [req.user._id] })
    const recipientIds = [...new Set([
      opportunity.creator?.id,
      ...(opportunity.members || []).map((member) => member?.id),
    ].filter((id) => id && id !== req.user.id && mongoose.isValidObjectId(id)))]
    await createNotificationsSafely(recipientIds.map((recipient) => ({
        recipient,
        opportunity: opportunity._id,
        type: 'message',
        title: `New message in ${opportunity.title}`,
        body: `${req.user.name}: ${text.slice(0, 160)}`,
        link: `/messages?opportunity=${opportunity._id}`,
      })))
    res.status(201).json({
      id: message._id.toString(), from: 'me', senderId: req.user.id, senderName: req.user.name,
      text: message.text, sentAt: message.createdAt,
    })
  } catch (error) { next(error) }
})

router.patch('/:opportunityId/read', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    if (!mongoose.isValidObjectId(opportunityId)) return res.status(404).json({ error: 'Team chat not found.' })
    const opportunity = await Opportunity.findById(opportunityId).select('creator members')
    if (!opportunity || !isOnTeam(opportunity, req.user.id)) return res.status(403).json({ error: 'Only current team members can use this chat.' })
    await Message.updateMany(
      { opportunity: opportunity._id, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } },
    )
    res.json({ unread: 0 })
  } catch (error) { next(error) }
})

export default router
