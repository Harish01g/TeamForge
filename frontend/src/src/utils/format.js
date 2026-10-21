// Small helpers for dates. Sample data uses daysFromNow() so deadlines never go stale.
export const daysFromNow = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
export const hoursAgo = (n) => new Date(Date.now() - n * 3600 * 1000).toISOString()
export const todayISO = () => daysFromNow(0)

export const formatDate = (iso) =>
  new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export function daysLeft(deadline) {
  const end = new Date(deadline + 'T23:59:59')
  return Math.ceil((end - new Date()) / 86400000)
}

export function deadlineLabel(deadline) {
  const d = daysLeft(deadline)
  if (d < 0) return 'Closed'
  if (d === 0) return 'Due today'
  if (d === 1) return '1 day left'
  return `${d} days left`
}

export function timeAgo(iso) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return days === 1 ? 'Yesterday' : `${days}d ago`
}

export const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export const splitList = (text, separator = ',') =>
  text.split(separator).map((s) => s.trim()).filter(Boolean)

export const firstName = (name = '') => name.split(' ')[0]
