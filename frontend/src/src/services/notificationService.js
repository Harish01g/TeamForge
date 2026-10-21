import { sampleNotifications } from '../data/notifications'
import { wait, copy } from './delay'

// DEMO STORAGE: in memory. FUTURE: GET /api/notifications, PATCH /api/notifications/:id/read
let store = copy(sampleNotifications)

export async function getNotifications() {
  await wait(250)
  return copy(store)
}

export async function addNotification(data) {
  const notification = { id: `n-${Date.now()}`, read: false, createdAt: new Date().toISOString(), ...data }
  store = [notification, ...store]
  return copy(notification)
}

export async function markNotificationRead(id) {
  store = store.map((n) => (n.id === id ? { ...n, read: true } : n))
  return true
}

export async function markAllNotificationsRead() {
  store = store.map((n) => ({ ...n, read: true }))
  return true
}
