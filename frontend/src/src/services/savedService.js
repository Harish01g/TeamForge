import { sampleSavedIds } from '../data/saved'
import { wait } from './delay'

// DEMO STORAGE: in memory. FUTURE: GET/POST/DELETE /api/saved
let ids = [...sampleSavedIds]

export async function getSavedIds() {
  await wait(200)
  return [...ids]
}

export async function toggleSaved(opportunityId) {
  await wait(120)
  ids = ids.includes(opportunityId) ? ids.filter((id) => id !== opportunityId) : [opportunityId, ...ids]
  return [...ids]
}

export async function clearSaved() {
  await wait(150)
  ids = []
  return []
}
