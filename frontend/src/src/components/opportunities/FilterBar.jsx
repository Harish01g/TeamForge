import { Search, X } from 'lucide-react'
import { CATEGORIES, COMMITMENTS, MODES } from '../../constants'

function Select({ label, value, onChange, options }) {
  return (
    <label className="block min-w-0 flex-1 text-xs font-semibold text-ink-soft sm:flex-none">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1 h-11 sm:w-40">
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </label>
  )
}

export default function FilterBar({ q, onQuery, filters, onFilter, sort, onSort, chips, onClear }) {
  return (
    <div className="card space-y-5 p-5">
      <div>
        <label htmlFor="board-search" className="sr-only">Search the board by title, description, or skill</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input id="board-search" type="search" value={q} onChange={(e) => onQuery(e.target.value)} placeholder="Try “React”, “design”, or “hackathon”" className="field h-12 pl-10" />
        </div>
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((c) => {
          const active = filters.category === c
          return (
            <button key={c} type="button" aria-pressed={active} onClick={() => onFilter('category', c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-ink text-white' : 'bg-cream-100 text-ink-soft hover:bg-brand-50 hover:text-brand-700'}`}>
              {c}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select label="Mode" value={filters.mode} onChange={(v) => onFilter('mode', v)} options={['All', ...MODES]} />
        <Select label="Commitment" value={filters.commitment} onChange={(v) => onFilter('commitment', v)} options={['All', ...COMMITMENTS]} />
        <Select label="Sort by" value={sort} onChange={onSort} options={[{ value: 'newest', label: 'Newest' }, { value: 'popular', label: 'Most popular' }]} />
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-cream-200 pt-4">
          <span className="text-sm font-semibold text-ink-soft">Active filters:</span>
          {chips.map((chip) => (
            <button key={chip.key} type="button" onClick={chip.clear} aria-label={`Remove filter ${chip.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800 ring-1 ring-inset ring-brand-200 transition hover:bg-brand-100">
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={onClear} className="rounded-lg px-2 py-1 text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  )
}
