import { sampleOpportunities } from '../data/opportunities'
import { wait, copy } from './delay'

// DEMO STORAGE: lives in memory in your browser tab only. It is not saved on a server.
// FUTURE: replace each function body with a fetch() call, for example:
//   const res = await fetch(`${API_URL}/opportunities`); return res.json()
let store = copy(sampleOpportunities)

export async function getOpportunities() {
  await wait(600)
  return copy(store)
}

export async function createOpportunity(payload, creator) {
  await wait(400)
  const opportunity = {
    ...payload,
    id: `opp-${Date.now()}`,
    openSpots: payload.teamSize - 1,
    creator: { id: creator.id, name: creator.name, year: creator.year, major: creator.major, bio: creator.bio },
    members: [{ id: creator.id, name: creator.name, role: 'Team lead' }],
    featured: false,
    interestedCount: 0,
    createdAt: new Date().toISOString(),
  }
  store = [opportunity, ...store]
  return copy(opportunity)
}

export async function deleteOpportunity(id) {
  await wait(250)
  store = store.filter((o) => o.id !== id)
  return true
}
