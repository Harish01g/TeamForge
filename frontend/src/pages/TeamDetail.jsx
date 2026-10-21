import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, LogOut, Plus, SearchX } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ProgressBar from '../components/ui/ProgressBar'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { milestoneProgress } from '../utils/teams'
import { daysLeft, formatDate, todayISO } from '../utils/format'

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { teams, loading, addMilestone, toggleMilestone, leaveTeam } = useAppData()
  const [confirm, setConfirm] = useState(false) // UI-only
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDue, setMilestoneDue] = useState(todayISO())
  const [savingMilestone, setSavingMilestone] = useState(false)
  const team = teams.find((t) => t.id === id)

  if (loading) return <div className="card h-96 animate-pulse" aria-busy="true" />
  if (!team) return <EmptyState icon={SearchX} title="Team not found" description="You may have left this team." action={<Button to="/teams">Back to My Teams</Button>} />

  const progress = milestoneProgress(team)
  const toggle = async (m) => {
    try { await toggleMilestone(team.id, m.id, !m.done) } catch { toast({ type: 'error', title: 'Could not update milestone' }) }
  }
  const submitMilestone = async (event) => {
    event.preventDefault()
    if (milestoneTitle.trim().length < 2) {
      toast({ type: 'error', title: 'Add a milestone title', message: 'Use at least 2 characters.' })
      return
    }
    setSavingMilestone(true)
    try {
      await addMilestone(team.id, { title: milestoneTitle.trim(), due: milestoneDue })
      setMilestoneTitle('')
      toast({ title: 'Milestone added' })
    } catch (error) {
      toast({ type: 'error', title: 'Could not add milestone', message: error.message || 'Please try again.' })
    } finally { setSavingMilestone(false) }
  }
  const confirmLeave = async () => {
    try {
      await leaveTeam(team.id)
      toast({ title: 'You left the team', message: team.name })
      navigate('/teams')
    } catch (error) {
      toast({ type: 'error', title: 'Could not leave team', message: error.message || 'Please try again.' })
    } finally { setConfirm(false) }
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
        {team.myRole !== 'Team lead' && <Button variant="glass" icon={LogOut} onClick={() => setConfirm(true)}>Leave team</Button>}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6 sm:p-8" aria-labelledby="milestones-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="milestones-title" className="font-display text-xl font-bold text-ink">Milestones</h2>
            <span className="text-sm font-semibold text-brand-700">{progress}% done</span>
          </div>
          <ProgressBar value={progress} label="Milestones completed" className="mt-3" />
          {team.milestones.length === 0 && <p className="mt-5 rounded-xl bg-cream-100 p-4 text-sm text-ink-soft">No milestones yet. Add the first one below to start tracking your team’s progress.</p>}
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
          <form onSubmit={submitMilestone} className="mt-5 grid gap-3 rounded-2xl bg-cream-100 p-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
            <label className="block text-sm font-semibold text-ink">Milestone title
              <input value={milestoneTitle} onChange={(event) => setMilestoneTitle(event.target.value)} maxLength={120} minLength={2} required placeholder="e.g. Finish the project prototype" className="mt-1.5 h-11 w-full rounded-xl border border-cream-300 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </label>
            <label className="block text-sm font-semibold text-ink">Due date
              <input type="date" value={milestoneDue} onChange={(event) => setMilestoneDue(event.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-cream-300 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </label>
            <Button type="submit" icon={Plus} disabled={savingMilestone}>{savingMilestone ? 'Adding…' : 'Add milestone'}</Button>
          </form>
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
        </div>
      </div>

      {confirm && (
        <ConfirmDialog title={`Leave ${team.name}?`} message="You will lose access to this team's milestones and chat." confirmLabel="Leave team"
          onConfirm={confirmLeave} onCancel={() => setConfirm(false)} />
      )}
    </div>
  )
}
