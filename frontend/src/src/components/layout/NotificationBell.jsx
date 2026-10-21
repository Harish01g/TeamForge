import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Sparkles, UserCheck, Clock, CheckCheck } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { timeAgo } from '../../utils/format'

const icons = { match: Sparkles, request: UserCheck, deadline: Clock }

export default function NotificationBell() {
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } = useAppData()
  const [open, setOpen] = useState(false) // UI-only state
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onClick = (e) => !wrapRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus() } }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  const openItem = async (n) => {
    if (!n.read) await markNotificationRead(n.id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="notification-panel"
        aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream-300 bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadNotifications > 0 && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white ring-2 ring-cream-100">
            {unreadNotifications}
          </span>
        )}
      </button>

      {open && (
        <div id="notification-panel" role="region" aria-label="Notifications" className="fixed inset-x-4 top-[4.5rem] z-50 overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[24rem]">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
            <h2 className="font-display text-lg font-bold">Notifications</h2>
            <button type="button" onClick={markAllNotificationsRead} disabled={!unreadNotifications} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:text-ink-muted disabled:hover:bg-transparent">
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-soft">You are all caught up. New matches and updates will show up here.</p>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-cream-200 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = icons[n.type] || Bell
                return (
                  <li key={n.id}>
                    <button type="button" onClick={() => openItem(n)} className={`flex w-full gap-3 px-5 py-4 text-left transition hover:bg-cream-100 ${n.read ? '' : 'bg-brand-50/50'}`}>
                      <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.type === 'deadline' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className={`text-sm ${n.read ? 'font-medium text-ink-soft' : 'font-bold text-ink'}`}>{n.title}</span>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"><span className="sr-only">Unread</span></span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink-soft">{n.body}</span>
                        <span className="mt-1 block text-xs text-ink-muted">{timeAgo(n.createdAt)}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
