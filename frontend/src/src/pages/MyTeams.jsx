import { Link } from 'react-router-dom'
import { Undo2, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import TeamCard from '../components/teams/TeamCard'
import { timeAgo } from '../utils/format'

export default function MyTeams() {
  const { teams, loading, joinRequests, opportunities, withdrawRequest } = useAppData()
  const toast = useToast()
  const [confirm, setConfirm] = useState(null) // UI-only

  const pending = joinRequests.map((r) => ({ ...r, opportunity: opportunities.find((o) => o.id === r.opportunityId) })).filter((r) => r.opportunity)

  const askWithdraw = (r) => setConfirm({
    title: 'Withdraw this request?', message: `Your request to join “${r.opportunity.title}” will be removed.`, confirmLabel: 'Withdraw request',
    onConfirm: async () => { await withdrawRequest(r.id); toast({ title: 'Request withdrawn' }) },
  })

  return (
    <div className="space-y-12">
      <div>
        <PageHeader title="My teams" description="The projects and squads you are part of, with what is coming up next." actions={<Button to="/" variant="secondary">Find more teams</Button>} />
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="card h-72 animate-pulse" />)}</div>
        ) : teams.length === 0 ? (
          <EmptyState icon={UsersRound} title="You are not on a team yet" description="Browse open opportunities and send a request to join." action={<Button to="/">Go to Discover</Button>} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{teams.map((t) => <TeamCard key={t.id} team={t} />)}</div>
        )}
      </div>

      {pending.length > 0 && (
        <section aria-labelledby="pending-title">
          <h2 id="pending-title" className="font-display text-2xl font-extrabold text-ink">Pending join requests</h2>
          <p className="mt-1 text-sm text-ink-soft">Demo requests stored in this session only.</p>
          <ul className="mt-5 space-y-3">
            {pending.map((r) => (
              <li key={r.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/opportunities/${r.opportunity.id}`} className="font-semibold text-ink underline-offset-4 hover:text-brand-700 hover:underline">{r.opportunity.title}</Link>
                  <p className="mt-0.5 text-sm text-ink-muted">Sent {timeAgo(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="amber">{r.status}</Badge>
                  <Button variant="secondary" size="sm" icon={Undo2} onClick={() => askWithdraw(r)}>Withdraw</Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
