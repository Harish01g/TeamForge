import mongoose from 'mongoose'

const joinRequestSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, trim: true, maxlength: 300, default: '' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Withdrawn'], default: 'Pending' },
}, { timestamps: true, versionKey: false })

joinRequestSchema.index({ opportunity: 1, applicant: 1 }, { unique: true })

export const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema)
