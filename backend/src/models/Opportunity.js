import mongoose from 'mongoose'

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  category: { type: String, required: true, enum: ['Hackathon', 'Project', 'Club', 'Other'] },
  goals: { type: [String], default: [] },
  requiredSkills: { type: [String], default: [] },
  niceToHaveSkills: { type: [String], default: [] },
  teamSize: { type: Number, required: true, min: 2, max: 20 },
  openSpots: { type: Number, required: true, min: 1, max: 19 },
  deadline: { type: String, required: true },
  timeline: { type: String, default: '' },
  mode: { type: String, required: true, enum: ['Remote', 'In person', 'Hybrid'] },
  commitment: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  contactPreference: { type: String, default: '' },
  creator: {
    id: { type: String, default: 'demo-student' },
    name: { type: String, required: true },
    year: { type: String, default: '' },
    major: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  members: { type: [mongoose.Schema.Types.Mixed], default: [] },
  milestones: [{
    title: { type: String, required: true, trim: true, maxlength: 120 },
    due: { type: String, required: true },
    done: { type: Boolean, default: false },
  }],
  featured: { type: Boolean, default: false },
  interestedCount: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false })

export const Opportunity = mongoose.model('Opportunity', opportunitySchema)
