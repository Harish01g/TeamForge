import { sampleTeams } from '../data/teams'
import { wait, copy } from './delay'

// DEMO STORAGE: in memory. FUTURE: GET /api/teams, PATCH /api/teams/:id/milestones/:milestoneId
let store = copy(sampleTeams)

export async function getTeams() {
  await wait(300)
  return copy(store)
}

export async function toggleMilestone(teamId, milestoneId) {
  await wait(120)
  store = store.map((t) =>
    t.id !== teamId ? t : { ...t, milestones: t.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)) },
  )
  return copy(store.find((t) => t.id === teamId))
}

export async function leaveTeam(teamId) {
  await wait(300)
  store = store.filter((t) => t.id !== teamId)
  return true
}
