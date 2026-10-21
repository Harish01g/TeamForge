async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('teamforge-token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/opportunities${path}`, {
    headers,
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'Could not contact the TeamForge server.')
  }
  return response.status === 204 ? null : response.json()
}

// UI components call these functions; the service handles communication with the API.
export function getOpportunities() {
  return apiRequest('')
}

export function getOpportunity(id) {
  return apiRequest(`/${encodeURIComponent(id)}`)
}

export function createOpportunity(payload, creator) {
  return apiRequest('', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      creator: { id: creator.id, name: creator.name, year: creator.year, major: creator.major, bio: creator.bio },
      members: [{ id: creator.id, name: creator.name, role: 'Team lead' }],
    }),
  })
}

export function updateOpportunity(id, payload) {
  return apiRequest(`/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteOpportunity(id) {
  await apiRequest(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return true
}
