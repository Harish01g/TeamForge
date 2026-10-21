const api = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('teamforge-token')
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/teams${path}`, { ...options, headers: { ...headers, ...options.headers } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not update the team workspace.')
  return body
}

export function getTeams() {
  return api('/')
}

export function addMilestone(teamId, values) {
  return api(`/${encodeURIComponent(teamId)}/milestones`, { method: 'POST', body: JSON.stringify(values) })
}

export function updateMilestone(teamId, milestoneId, done) {
  return api(`/${encodeURIComponent(teamId)}/milestones/${encodeURIComponent(milestoneId)}`, {
    method: 'PATCH', body: JSON.stringify({ done }),
  })
}

export function leaveTeam(teamId) {
  return api(`/${encodeURIComponent(teamId)}/membership`, { method: 'DELETE' })
}
