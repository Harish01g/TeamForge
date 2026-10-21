import { Router } from 'express'
import mongoose from 'mongoose'
import { Notification } from '../models/Notification.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

function present(notification) {
  return {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    body: notification.body,
    link: notification.link,
    read: notification.read,
    createdAt: notification.createdAt,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(50).lean()
    res.json(notifications.map(present))
  } catch (error) { next(error) }
})

router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { $set: { read: true } })
    res.json({ updated: true })
  } catch (error) { next(error) }
})

router.patch('/:id/read', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Notification not found.' })
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } },
      { new: true },
    )
    if (!notification) return res.status(404).json({ error: 'Notification not found.' })
    res.json(present(notification))
  } catch (error) { next(error) }
})

export default router
