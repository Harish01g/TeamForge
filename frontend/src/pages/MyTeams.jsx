import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock3, MessageCircle, UserRound, UsersRound, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import SkillTags from '../components/ui/SkillTags'
import { timeAgo } from '../utils/format'

const statusTone = { Pending: 'amber', Accepted: 'emerald', Declined: 'rose', Withdrawn: 'slate' }

function RequestStatus({ status }) {
  return <Badge tone={statusTone[status] || 'slate'}>{status}</Badge>
}

function OpportunityTeamCard({ opportunity, profile }) {
  const membership = opportunity.members?.find((member) => member.id === profile?.id)
  const role = opportunity.creator?.id === profile?.id ? 'Team lead' : membership?.role || 'Team member'
  return (
    <article className="card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="violet">{opportunity.category}</Badge>
        <Badge tone={role === 'Team lead' ? 'sky' : 'emerald'}>{role}</Badge>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-ink">{opportunity.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{opportunity.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-ink-muted">
        <span>Posted by {opportunity.creator?.name || 'TeamForge student'}</span>
        <span>{opportunity.members?.length || 0} member{opportunity.members?.length === 1 ? '' : 's'} · {opportunity.openSpots} spot{opportunity.openSpots === 1 ? '' : 's'} open</span>
      </div>
      <div className="mt-auto flex gap-2 pt-5"><Button to={`/teams/${opportunity.id}`} variant="secondary" size="sm" className="flex-1">Open workspace</Button><Button to={`/messages?opportunity=${opportunity.id}`} size="sm" icon={MessageCircle} aria-label={`Open chat for ${opportunity.title}`} /></div>
    </article>
  )
}

export default function MyTeams() {
  const { opportunities, loading, joinRequests, profile, withdrawRequest, reviewJoinRequest, reload } = useAppData()
  const toast = useToast()
  const [busyId, setBusyId] = useState('')

  const joinedOpportunities = opportunities.filter((opportunity) => opportunity.members?.some((member) => member.id === profile?.id))
  const sent = joinRequests.filter((request) => request.applicantId === profile?.id && request.opportunity)
  const pendingSent = sent.filter((request) => request.status === 'Pending')
  const pastSent = sent.filter((request) => ['Declined', 'Withdrawn'].includes(request.status))
  const received = joinRequests.filter((request) => request.opportunity?.creator?.id === profile?.id && request.applicant)

  const handleReview = async (request, status) => {
    setBusyId(request.id)
    try {
      await reviewJoinRequest(request.id, status)
      toast({ title: status === 'Accepted' ? 'Student accepted' : 'Request declined', message: status === 'Accepted' ? 'They have been added to the opportunity team.' : 'The applicant can see your decision.' })
    } catch (error) {
      toast({ type: 'error', title: 'Could not update request', message: error.message || 'Refresh the page and try again.' })
    } finally { setBusyId('') }
  }

  const handleWithdraw = async (request) => {
    setBusyId(request.id)
    try {
      await withdrawRequest(request.id)
      toast({ title: 'Request withdrawn' })
    } catch (error) {
      toast({ type: 'error', title: 'Could not withdraw request', message: error.message || 'Please try again.' })
    } finally { setBusyId('') }
  }

  return (
    <div className="space-y-12">
      <section>
        <PageHeader title="My teams" description="See the opportunities you’re part of, your pending requests, and students asking to join your opportunities." actions={<Button to="/" variant="secondary">Find more teams</Button>} />
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="card h-72 animate-pulse" />)}</div>
        ) : joinedOpportunities.length === 0 ? (
          <EmptyState icon={UsersRound} title="You’re not part of a team yet" description="Post an opportunity or send a request to join one. When a poster accepts your request, that opportunity will appear here." action={<Button to="/">Find an opportunity</Button>} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{joinedOpportunities.map((opportunity) => <OpportunityTeamCard key={opportunity.id} opportunity={opportunity} profile={profile} />)}</div>
        )}
      </section>

      <section aria-labelledby="received-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="received-title" className="font-display text-2xl font-extrabold text-ink">Requests to join your opportunities</h2><p className="mt-1 text-sm text-ink-soft">Review each student’s profile before you decide.</p></div>
          <Button variant="secondary" size="sm" icon={Clock3} onClick={reload}>Refresh requests</Button>
        </div>
        {received.length === 0 ? (
          <div className="card mt-5 p-6 text-sm text-ink-soft">No students have requested to join your opportunities yet.</div>
        ) : (
          <ul className="mt-5 space-y-4">
            {received.map((request) => (
              <li key={request.id} className="card p-5 sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <Avatar name={request.applicant.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-lg font-bold text-ink">{request.applicant.name}</h3><RequestStatus status={request.status} /></div>
                      <p className="mt-0.5 text-sm text-ink-soft">{[request.applicant.year, request.applicant.major].filter(Boolean).join(' · ') || 'Student'}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{request.applicant.bio || 'This student has not added a bio yet.'}</p>
                      {request.applicant.skills?.length > 0 && <div className="mt-3"><SkillTags skills={request.applicant.skills} max={6} label={`${request.applicant.name}'s skills`} /></div>}
                      {request.message && <blockquote className="mt-4 rounded-xl bg-cream-100 p-3 text-sm text-ink-soft">“{request.message}”</blockquote>}
                      <p className="mt-3 text-xs text-ink-muted">For: <Link to={`/opportunities/${request.opportunityId}`} className="font-semibold text-brand-700 hover:underline">{request.opportunity.title}</Link> · Sent {timeAgo(request.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:w-48 xl:flex-col">
                    <Button to={`/students/${request.applicant.id}`} variant="secondary" size="sm" icon={UserRound}>View full profile</Button>
                    {request.status === 'Pending' && <>
                      <Button size="sm" icon={Check} disabled={busyId === request.id} onClick={() => handleReview(request, 'Accepted')}>{busyId === request.id ? 'Saving…' : 'Accept request'}</Button>
                      <Button variant="dangerSoft" size="sm" icon={X} disabled={busyId === request.id} onClick={() => handleReview(request, 'Declined')}>Decline</Button>
                    </>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="sent-title">
        <h2 id="sent-title" className="font-display text-2xl font-extrabold text-ink">Pending requests</h2>
        <p className="mt-1 text-sm text-ink-soft">These requests are waiting for an opportunity poster to review your profile.</p>
        {pendingSent.length === 0 ? <div className="card mt-5 p-6 text-sm text-ink-soft">You don’t have any pending requests right now.</div> : (
          <ul className="mt-5 space-y-3">
            {pendingSent.map((request) => (
              <li key={request.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><Link to={`/opportunities/${request.opportunityId}`} className="font-semibold text-ink underline-offset-4 hover:text-brand-700 hover:underline">{request.opportunity.title}</Link><p className="mt-1 text-sm text-ink-muted">Sent {timeAgo(request.createdAt)}</p></div>
                <div className="flex flex-wrap items-center gap-3"><RequestStatus status={request.status} /><Button variant="secondary" size="sm" disabled={busyId === request.id} onClick={() => handleWithdraw(request)}>Withdraw</Button></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pastSent.length > 0 && <section aria-labelledby="past-title">
        <h2 id="past-title" className="font-display text-xl font-bold text-ink">Previous requests</h2>
        <ul className="mt-4 space-y-3">{pastSent.map((request) => <li key={request.id} className="card flex flex-wrap items-center justify-between gap-3 p-4"><Link to={`/opportunities/${request.opportunityId}`} className="font-semibold text-ink hover:text-brand-700">{request.opportunity.title}</Link><RequestStatus status={request.status} /></li>)}</ul>
      </section>}
    </div>
  )
}
