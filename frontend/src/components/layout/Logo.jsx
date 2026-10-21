import { Link } from 'react-router-dom'

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="TeamForge home">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-800 shadow-lift">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <circle cx="11" cy="12" r="3.5" fill="#fff" />
          <circle cx="21" cy="12" r="3.5" fill="#fff" opacity=".7" />
          <path d="M6 24c0-3.6 2.8-6 6-6s6 2.4 6 6z" fill="#fff" />
          <path d="M16 24c0-3 2.2-5.2 5-5.2s5 2.2 5 5.2z" fill="#fff" opacity=".7" />
        </svg>
      </span>
      {!compact && <span className="font-display text-xl font-extrabold tracking-tight text-ink">TeamForge</span>}
    </Link>
  )
}
