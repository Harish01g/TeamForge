import { getToken } from './authService'

async function request(path) {
  const response = await fetch(`/api/students${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Could not load student profiles.')
  return body
}

export function getStudents({ q = '', year = '', page = 1 } = {}) {
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (year) params.set('year', year)
  params.set('page', String(page))
  return request(`/?${params.toString()}`)
}

export function getStudent(id) {
  return request(`/${encodeURIComponent(id)}`)
}
