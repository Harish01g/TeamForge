import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LogOut, Plus, Search } from 'lucide-react'
import Logo from './Logo'
import NotificationBell from './NotificationBell'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { profile } = useAppData()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') || '') // UI-only state

  useEffect(() => { setValue(params.get('q') || '') }, [params])

  const submit = (e) => {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}#board` : '/#board')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-cream-300/70 bg-cream-100/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-10">
        <div className="lg:hidden"><Logo compact /></div>
        <form role="search" onSubmit={submit} className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
          <label htmlFor="global-search" className="sr-only">Search opportunities by title, description, or skill</label>
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input id="global-search" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search by title, description, or skill" className="field h-11 rounded-xl pl-10" />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
          <Button to="/opportunities/new" icon={Plus} className="hidden sm:inline-flex">Post an opportunity</Button>
          <Link to="/opportunities/new" aria-label="Post an opportunity" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white sm:hidden">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Link>
          <NotificationBell />
          <button type="button" onClick={signOut} aria-label="Sign out" title="Sign out" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition hover:bg-cream-200 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-400">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
          {profile && (
            <Link to="/profile" aria-label={`${profile.name}, open your profile`} className="rounded-full">
              <Avatar name={profile.name} size="md" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
