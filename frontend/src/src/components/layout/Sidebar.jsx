import { NavLink } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import Logo from './Logo'
import { navItems } from './navItems'
import { useAppData } from '../../context/AppDataContext'

export function useNavBadges() {
  const { savedIds, unreadMessages } = useAppData()
  return { '/saved': savedIds.length, '/messages': unreadMessages }
}

export default function Sidebar() {
  const badges = useNavBadges()
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-cream-300/70 bg-cream-50/90 p-6 backdrop-blur lg:flex">
      <Logo />
      <nav aria-label="Main" className="mt-10 flex flex-1 flex-col gap-1.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-ink text-white shadow-lift' : 'text-ink-soft hover:bg-cream-200 hover:text-ink'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {badges[to] > 0 && (
              <span className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-bold ${to === '/messages' ? 'bg-brand-500 text-white' : 'bg-cream-200 text-ink-soft group-aria-[current=page]:bg-white/15 group-aria-[current=page]:text-white'}`}>
                {badges[to]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-white p-4 ring-1 ring-brand-100">
        <p className="flex items-center gap-2 text-sm font-bold text-brand-800">
          <FlaskConical className="h-4 w-4" aria-hidden="true" /> Demo mode
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Everything here is sample data kept in your browser tab. Nothing is sent to a server or to real students.
        </p>
      </div>
    </aside>
  )
}
