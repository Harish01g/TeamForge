import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', default: null },
  type: { type: String, enum: ['request', 'team', 'message', 'match', 'deadline'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  body: { type: String, required: true, trim: true, maxlength: 500 },
  link: { type: String, trim: true, maxlength: 300, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

notificationSchema.index({ recipient: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
