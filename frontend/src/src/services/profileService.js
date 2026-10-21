import { currentStudent } from '../data/profiles'
import { wait, copy } from './delay'

// DEMO STORAGE: in memory. FUTURE: GET /api/profiles/me and PATCH /api/profiles/me
let profile = copy(currentStudent)

export async function getProfile() {
  await wait(250)
  return copy(profile)
}

export async function updateProfile(values) {
  await wait(450)
  profile = { ...profile, ...values }
  return copy(profile)
}
