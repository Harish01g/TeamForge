const TOKEN_KEY = 'teamforge-token'

async function request(path, options = {}, token = getToken()) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`/api/auth${path}`, { ...options, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not contact the TeamForge server.')
  return body
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function saveSession(result) {
  localStorage.setItem(TOKEN_KEY, result.token)
  return result.user
}

export async function register(values) {
  return saveSession(await request('/register', { method: 'POST', body: JSON.stringify(values) }, null))
}

export async function login(values) {
  return saveSession(await request('/login', { method: 'POST', body: JSON.stringify(values) }, null))
}

export function getMe() {
  return request('/me')
}

export async function updateMe(values) {
  return request('/me', { method: 'PATCH', body: JSON.stringify(values) })
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
}
