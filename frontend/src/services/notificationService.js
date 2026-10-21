import { getToken } from './authService'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/notifications${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not update notifications.')
  return body
}

export function getNotifications() {
  return request('/')
}

export function markNotificationRead(id) {
  return request(`/${encodeURIComponent(id)}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead() {
  return request('/read-all', { method: 'PATCH' })
}
