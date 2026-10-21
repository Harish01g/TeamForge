import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  year: { type: String, default: 'First year' },
  major: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  availability: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  completedProjects: { type: [mongoose.Schema.Types.Mixed], default: [] },
  savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }],
}, { timestamps: true, versionKey: false })

userSchema.methods.toPublicProfile = function toPublicProfile() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    year: this.year,
    major: this.major,
    bio: this.bio,
    skills: this.skills,
    interests: this.interests,
    availability: this.availability,
    github: this.github,
    portfolio: this.portfolio,
    completedProjects: this.completedProjects,
  }
}

// Fields safe to show to another signed-in student. Account email is kept private.
userSchema.methods.toDirectoryProfile = function toDirectoryProfile() {
  return {
    id: this._id.toString(),
    name: this.name,
    year: this.year,
    major: this.major,
    bio: this.bio,
    skills: this.skills,
    interests: this.interests,
    availability: this.availability,
    github: this.github,
    portfolio: this.portfolio,
    completedProjects: this.completedProjects,
  }
}

export const User = mongoose.model('User', userSchema)
