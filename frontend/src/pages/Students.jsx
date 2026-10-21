import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search, Sparkles, UsersRound } from 'lucide-react'
import { YEARS } from '../constants'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import SkillTags from '../components/ui/SkillTags'
import { getStudents } from '../services/studentService'

function StudentCard({ student }) {
  return (
    <article className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar name={student.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-lg font-bold text-ink">{student.name}</h2>
          <p className="mt-0.5 text-sm text-ink-soft">{student.year || 'Student'}{student.major ? ` · ${student.major}` : ''}</p>
        </div>
      </div>
      <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {student.bio || 'This student has not added a bio yet.'}
      </p>
      <div className="mt-4 min-h-7">
        {student.skills.length ? <SkillTags skills={student.skills} max={4} label={`${student.name}'s skills`} /> : <span className="text-xs text-ink-muted">No skills added yet</span>}
      </div>
      {student.availability && <p className="mt-4 line-clamp-1 text-xs text-ink-muted"><span className="font-semibold text-ink-soft">Availability:</span> {student.availability}</p>}
      <div className="mt-auto pt-5">
        <Button to={`/students/${student.id}`} variant="secondary" size="sm" className="w-full" icon={ArrowRight}>View profile</Button>
      </div>
    </article>
  )
}

export default function Students() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [year, setYear] = useState(params.get('year') || '')
  const [page, setPage] = useState(Number(params.get('page')) || 1)
  const [result, setResult] = useState({ students: [], total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setQuery(params.get('q') || '')
    setYear(params.get('year') || '')
    setPage(Number(params.get('page')) || 1)
  }, [params])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getStudents({ q: params.get('q') || '', year: params.get('year') || '', page: Number(params.get('page')) || 1 })
      .then((data) => { if (active) setResult(data) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [params])

  const submit = (event) => {
    event.preventDefault()
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (year) next.set('year', year)
    setParams(next)
  }

  return (
    <div className="space-y-7">
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#1c2b5c] to-brand-700 p-6 text-white sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-100"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Find your people</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Student directory</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">Discover classmates by skill, course, or interest and find the right people for your next idea.</p>
        </div>
      </header>

      <form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-[1fr_13rem_auto] sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search students by name, major, skill, or interest</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, major, skill, or interest" className="field h-11 pl-10" />
        </label>
        <label>
          <span className="sr-only">Filter by year</span>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="field h-11">
            <option value="">All years</option>
            {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
            <option value="First year">First year</option>
          </select>
        </label>
        <Button type="submit" icon={Search}>Search students</Button>
      </form>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Classmates to build with</h2>
          <p className="mt-1 text-sm text-ink-muted">{loading ? 'Finding students…' : `${result.total} ${result.total === 1 ? 'student' : 'students'} found`}</p>
        </div>
        <Link to="/profile" className="text-sm font-semibold text-brand-700 hover:text-brand-900">Update your profile <span aria-hidden="true">→</span></Link>
      </div>

      {error ? (
        <div role="alert" className="card p-6 text-sm text-rose-700">{error}</div>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading student profiles" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="card h-64 animate-pulse" />)}
        </div>
      ) : result.students.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{result.students.map((student) => <StudentCard key={student.id} student={student} />)}</div>
          {result.pages > 1 && <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(page - 1)); setParams(next) }}>Previous</Button>
            <span className="text-sm text-ink-muted">Page {page} of {result.pages}</span>
            <Button variant="secondary" size="sm" disabled={page >= result.pages} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(page + 1)); setParams(next) }}>Next</Button>
          </div>}
        </>
      ) : (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><UsersRound className="h-7 w-7" aria-hidden="true" /></span>
          <h3 className="mt-4 font-display text-xl font-bold text-ink">No classmates found</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">Try another name, skill, or year. As more students complete their profiles, they will show up here.</p>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => { setQuery(''); setYear(''); setParams(new URLSearchParams()) }}>Clear filters</Button>
        </div>
      )}
    </div>
  )
}
