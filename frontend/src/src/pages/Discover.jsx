import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDown, Plus, SearchX, Sparkles, Rocket } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import FilterBar from '../components/opportunities/FilterBar'
import OpportunityCard from '../components/opportunities/OpportunityCard'
import OpportunitySkeleton from '../components/opportunities/OpportunitySkeleton'
import FeaturedOpportunity from '../components/opportunities/FeaturedOpportunity'
import { filterOpportunities, sortOpportunities } from '../utils/opportunityFilters'
import { daysLeft, firstName } from '../utils/format'

const FILTER_LABELS = { category: 'Category', mode: 'Mode', commitment: 'Commitment' }
const NO_FILTERS = { category: 'All', mode: 'All', commitment: 'All' }

// A small illustration of what TeamForge does: a team with an open seat.
function FormingTeam() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-sm select-none">
      <div className="absolute -left-4 -top-5 rotate-[-6deg] rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-lift">React</div>
      <div className="absolute -right-3 top-10 rotate-[5deg] rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-card ring-1 ring-cream-300">Figma</div>
      <div className="absolute -bottom-4 left-10 rotate-[3deg] rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-card">Python</div>
      <div className="rounded-[2rem] bg-white p-6 shadow-lift ring-1 ring-cream-300">
        <p className="font-display text-lg font-bold text-ink">Smart Campus Hackathon</p>
        <p className="text-sm text-ink-muted">Team forming, 3 of 4 seats filled</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex -space-x-3">
            <Avatar name="Rohan Mehta" size="md" />
            <Avatar name="Priya Nair" size="md" />
            <Avatar name="Sneha Iyer" size="md" />
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-brand-400 bg-brand-50 text-sm font-bold text-brand-700">You</span>
          </div>
          <span className="text-sm font-semibold text-brand-700">1 seat open</span>
        </div>
      </div>
    </div>
  )
}

export default function Discover() {
  const { profile, opportunities, loading } = useAppData()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  // UI-only state: which filters are active and how to sort.
  const [filters, setFilters] = useState(NO_FILTERS)
  const [sort, setSort] = useState('newest')

  const setQuery = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true, preventScrollReset: true })
  }
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }))
  const clearAll = () => { setQuery(''); setFilters(NO_FILTERS) }

  const visible = useMemo(
    () => sortOpportunities(filterOpportunities(opportunities, { q, ...filters }), sort),
    [opportunities, q, filters, sort],
  )

  const chips = [
    q && { key: 'q', label: `Search: “${q}”`, clear: () => setQuery('') },
    ...Object.keys(FILTER_LABELS).filter((k) => filters[k] !== 'All').map((k) => ({ key: k, label: `${FILTER_LABELS[k]}: ${filters[k]}`, clear: () => setFilter(k, 'All') })),
  ].filter(Boolean)

  const featured = opportunities.find((o) => o.featured)
  const openCount = opportunities.filter((o) => daysLeft(o.deadline) >= 0).length
  const spots = opportunities.reduce((sum, o) => sum + o.openSpots, 0)

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Welcome back{profile ? `, ${firstName(profile.name)}` : ''}
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Find the people who make your idea real.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            TeamForge connects students who want to build together: hackathon squads, side projects, clubs, and everything in between. Browse what is open, or post your own.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/opportunities/new" size="lg" icon={Plus}>Post an opportunity</Button>
            <Button variant="secondary" size="lg" icon={ArrowDown} onClick={() => document.getElementById('board')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse the board
            </Button>
          </div>
          <dl className="mt-10 flex gap-8">
            {[[openCount, 'open opportunities'], [spots, 'seats to fill']].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-extrabold text-ink">{loading ? '–' : n}<span className="ml-2 text-sm font-medium text-ink-muted">{label}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        <FormingTeam />
      </section>

      {!loading && featured && <FeaturedOpportunity opportunity={featured} />}

      <section id="board" aria-labelledby="board-title" className="scroll-mt-28">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 id="board-title" className="font-display text-3xl font-extrabold tracking-tight text-ink">Opportunity board</h2>
            <p className="mt-1 text-ink-soft">Search by title, description, or skill, then narrow it down.</p>
          </div>
        </div>
        <FilterBar q={q} onQuery={setQuery} filters={filters} onFilter={setFilter} sort={sort} onSort={setSort} chips={chips} onClear={clearAll} />

        <p aria-live="polite" className="mb-4 mt-6 text-sm font-semibold text-ink-soft">
          {loading ? 'Loading opportunities…' : `Showing ${visible.length} of ${opportunities.length} opportunities`}
        </p>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => <OpportunitySkeleton key={i} />)}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState icon={Rocket} title="No opportunities yet" description="Be the first to post a project, hackathon team, or club role." action={<Button to="/opportunities/new" icon={Plus}>Post an opportunity</Button>} />
        ) : visible.length === 0 ? (
          <EmptyState icon={SearchX} title="No matches for those filters" description="Try a different skill, or clear your filters to see everything that is open." action={<Button onClick={clearAll}>Show all opportunities</Button>} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
          </div>
        )}
      </section>
    </div>
  )
}
