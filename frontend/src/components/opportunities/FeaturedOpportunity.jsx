import { ArrowUpRight, CalendarClock, MapPin, Star, Users } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import SkillTags from '../ui/SkillTags'
import SaveButton from './SaveButton'
import { deadlineLabel } from '../../utils/format'

export default function FeaturedOpportunity({ opportunity: o }) {
  return (
    <section aria-labelledby="featured-title" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#1c2b5c] to-brand-800 p-6 text-white shadow-lift sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="glass" icon={Star}>Featured {o.category.toLowerCase()}</Badge>
            <Badge tone="glass" icon={CalendarClock}>{deadlineLabel(o.deadline)}</Badge>
          </div>
          <h2 id="featured-title" className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{o.title}</h2>
          <p className="mt-3 max-w-xl text-white/80">{o.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to={`/opportunities/${o.id}`} variant="light" icon={ArrowUpRight}>View opportunity</Button>
            <SaveButton opportunity={o} withLabel className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20" />
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
          <p className="text-sm font-semibold text-white/70">Skills they need</p>
          <div className="mt-2"><SkillTags skills={o.requiredSkills} variant="glass" label="Required skills" /></div>
          <ul className="mt-5 space-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" />{o.openSpots} of {o.teamSize} spots open</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{o.mode}, {o.commitment.toLowerCase()} commitment</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
