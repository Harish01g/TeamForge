import { getToken } from './authService'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/messages${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not contact the TeamForge server.')
  return body
}

export function getConversations() {
  return request('/')
}

export function sendMessage(opportunityId, text) {
  return request(`/${encodeURIComponent(opportunityId)}`, { method: 'POST', body: JSON.stringify({ text }) })
}

export function markConversationRead(opportunityId) {
  return request(`/${encodeURIComponent(opportunityId)}/read`, { method: 'PATCH' })
}
