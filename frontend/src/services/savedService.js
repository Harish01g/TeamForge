import { getToken } from './authService'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/saved${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not update saved opportunities.')
  return body
}

export function getSavedIds() {
  return request('/')
}

export function setSaved(opportunityId, shouldSave) {
  return request(`/${encodeURIComponent(opportunityId)}`, { method: shouldSave ? 'POST' : 'DELETE' })
}

export function clearSaved() {
  return request('/', { method: 'DELETE' })
}
