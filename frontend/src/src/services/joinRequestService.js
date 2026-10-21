import { sampleJoinRequests } from '../data/joinRequests'
import { wait, copy } from './delay'

// DEMO STORAGE: in memory. Nobody receives these requests. FUTURE: POST /api/join-requests
let store = copy(sampleJoinRequests)

export async function getJoinRequests() {
  await wait(250)
  return copy(store)
}

export async function createJoinRequest({ opportunityId, applicantId, message }) {
  await wait(500)
  const request = { id: `jr-${Date.now()}`, opportunityId, applicantId, message: message.trim(), status: 'Pending', createdAt: new Date().toISOString() }
  store = [request, ...store]
  return copy(request)
}

export async function withdrawJoinRequest(id) {
  await wait(250)
  store = store.filter((r) => r.id !== id)
  return true
}
