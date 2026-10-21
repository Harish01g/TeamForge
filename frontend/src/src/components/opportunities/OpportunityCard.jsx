import { Link } from 'react-router-dom'
import { Clock, Gauge, MapPin, Users } from 'lucide-react'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import SkillTags from '../ui/SkillTags'
import SaveButton from './SaveButton'
import { categoryTone } from '../../utils/ui'
import { daysLeft, deadlineLabel, timeAgo } from '../../utils/format'

export default function OpportunityCard({ opportunity: o }) {
  const left = daysLeft(o.deadline)
  return (
    <article className="card group relative flex h-full flex-col p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand-500">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={categoryTone(o.category)}>{o.category}</Badge>
          <Badge tone={left < 0 ? 'slate' : left <= 3 ? 'rose' : 'slate'} icon={Clock}>{deadlineLabel(o.deadline)}</Badge>
        </div>
        <SaveButton opportunity={o} />
      </div>

      <h3 className="mt-4 font-display text-xl font-bold leading-snug text-ink">
        <Link to={`/opportunities/${o.id}`} className="outline-none after:absolute after:inset-0 after:rounded-3xl">
          {o.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>

      <div className="mt-4"><SkillTags skills={o.requiredSkills} max={4} label="Required skills" /></div>

      <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-ink-soft sm:grid-cols-2">
        <li className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-600" aria-hidden="true" />{o.openSpots} of {o.teamSize} spots open</li>
        <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" aria-hidden="true" />{o.mode}</li>
        <li className="flex items-center gap-2"><Gauge className="h-4 w-4 text-brand-600" aria-hidden="true" />{o.commitment} commitment</li>
      </ul>

      <div className="mt-auto flex items-center gap-3 border-t border-cream-200 pt-4">
        <Avatar name={o.creator.name} size="sm" />
        <p className="min-w-0 text-sm leading-tight">
          <span className="block truncate font-semibold text-ink">{o.creator.name}</span>
          <span className="text-xs text-ink-muted">Posted {timeAgo(o.createdAt)}</span>
        </p>
      </div>
    </article>
  )
}
