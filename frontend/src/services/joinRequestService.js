import { getToken } from './authService'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/join-requests${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not update the join request.')
  return body
}

export function getJoinRequests() {
  return request('/')
}

export function createJoinRequest({ opportunityId, message }) {
  return request('/', { method: 'POST', body: JSON.stringify({ opportunityId, message }) })
}

export async function updateJoinRequest(id, status) {
  const result = await request(`/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return result
}
