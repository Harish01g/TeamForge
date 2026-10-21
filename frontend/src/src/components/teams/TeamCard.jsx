import { ArrowRight, Flag } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import { AvatarStack } from '../ui/Avatar'
import { statusTone } from '../../utils/ui'
import { milestoneProgress, nextMilestone } from '../../utils/teams'
import { formatDate } from '../../utils/format'

export default function TeamCard({ team }) {
  const next = nextMilestone(team)
  const progress = milestoneProgress(team)
  return (
    <article className="card flex h-full flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold leading-snug text-ink">{team.name}</h3>
        <Badge tone={statusTone(team.status)}>{team.status}</Badge>
      </div>
      <p className="mt-1 text-sm font-semibold text-brand-700">Your role: {team.myRole}</p>
      <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{team.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <AvatarStack names={team.members.map((m) => m.name)} />
        <span className="text-sm text-ink-muted">{team.members.length} members</span>
      </div>
      <div className="mt-5 rounded-2xl bg-cream-100 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Flag className="h-4 w-4 text-brand-600" aria-hidden="true" />{next ? 'Next milestone' : 'All milestones done'}</p>
        {next && <p className="mt-1 text-sm text-ink-soft">{next.title} <span className="text-ink-muted">by {formatDate(next.due)}</span></p>}
        <ProgressBar value={progress} label={`${team.name} progress`} className="mt-3" />
        <p className="mt-1.5 text-xs text-ink-muted">{progress}% complete</p>
      </div>
      <Button to={`/teams/${team.id}`} variant="secondary" icon={ArrowRight} className="mt-5 w-full" aria-label={`View team ${team.name}`}>View team</Button>
    </article>
  )
}
