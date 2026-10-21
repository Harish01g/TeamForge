import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'
import { useNavBadges } from './Sidebar'

export default function MobileNav() {
  const badges = useNavBadges()
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-2xl grid-cols-6">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-semibold transition ${isActive ? 'text-brand-700' : 'text-ink-muted hover:text-ink'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`relative inline-flex h-8 w-14 items-center justify-center rounded-full transition ${isActive ? 'bg-brand-100' : ''}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {badges[to] > 0 && (
                      <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                        <span className="sr-only">{badges[to]} new or saved: </span>{badges[to]}
                      </span>
                    )}
                  </span>
                  {label.replace('My ', '')}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
