import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, LogOut, SearchX } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ProgressBar from '../components/ui/ProgressBar'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { statusTone } from '../utils/ui'
import { milestoneProgress } from '../utils/teams'
import { daysLeft, formatDate } from '../utils/format'

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { teams, loading, toggleMilestone, leaveTeam } = useAppData()
  const [confirm, setConfirm] = useState(false) // UI-only
  const team = teams.find((t) => t.id === id)

  if (loading) return <div className="card h-96 animate-pulse" aria-busy="true" />
  if (!team) return <EmptyState icon={SearchX} title="Team not found" description="You may have left this team." action={<Button to="/teams">Back to My Teams</Button>} />

  const progress = milestoneProgress(team)
  const toggle = async (m) => {
    try { await toggleMilestone(team.id, m.id) } catch { toast({ type: 'error', title: 'Could not update milestone' }) }
  }

  return (
    <div>
      <Link to="/teams" className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-ink-soft hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to My Teams
      </Link>

      <header className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-gradient-to-br from-ink to-brand-800 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <Badge tone="glass">{team.status}</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{team.name}</h1>
          <p className="mt-2 max-w-xl text-white/80">{team.description}</p>
          <p className="mt-3 text-sm font-semibold text-brand-200">Your role: {team.myRole}</p>
        </div>
        <Button variant="glass" icon={LogOut} onClick={() => setConfirm(true)}>Leave team</Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6 sm:p-8" aria-labelledby="milestones-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="milestones-title" className="font-display text-xl font-bold text-ink">Milestones</h2>
            <span className="text-sm font-semibold text-brand-700">{progress}% done</span>
          </div>
          <ProgressBar value={progress} label="Milestones completed" className="mt-3" />
          <ul className="mt-5 space-y-2">
            {team.milestones.map((m) => {
              const overdue = !m.done && daysLeft(m.due) < 0
              return (
                <li key={m.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition hover:bg-cream-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500">
                    <input type="checkbox" checked={m.done} onChange={() => toggle(m)} className="mt-1 h-5 w-5 rounded border-cream-300 accent-brand-600" />
                    <span className="flex-1">
                      <span className={`block font-semibold ${m.done ? 'text-ink-muted line-through' : 'text-ink'}`}>{m.title}</span>
                      <span className={`text-sm ${overdue ? 'font-semibold text-rose-600' : 'text-ink-muted'}`}>{overdue ? 'Overdue, was due ' : 'Due '}{formatDate(m.due)}</span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="members-title">
            <h2 id="members-title" className="font-display text-lg font-bold text-ink">Members</h2>
            <ul className="mt-4 space-y-3">
              {team.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} size="md" />
                  <span className="text-sm leading-tight"><span className="block font-semibold text-ink">{m.name}</span><span className="text-ink-muted">{m.role}</span></span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6" aria-labelledby="resources-title">
            <h2 id="resources-title" className="font-display text-lg font-bold text-ink">Resources</h2>
            <p className="mt-1 text-xs text-ink-muted">Sample links that open the tools' home pages.</p>
            <ul className="mt-4 space-y-2">
              {team.resources.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl bg-cream-100 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-50 hover:text-brand-800">
                    <span>{r.label} <span className="font-normal text-ink-muted">on {r.type}</span></span>
                    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog title={`Leave ${team.name}?`} message="You will lose access to this team's milestones and resources." confirmLabel="Leave team"
          onConfirm={async () => { await leaveTeam(team.id); toast({ title: 'You left the team', message: team.name }); navigate('/teams') }} onCancel={() => setConfirm(false)} />
      )}
    </div>
  )
}
