import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock, CheckCircle2, Gauge, Mail, MapPin, Send, Trash2, Undo2, Users, FlaskConical, Target, Flag, SearchX } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import SkillTags from '../components/ui/SkillTags'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import SaveButton from '../components/opportunities/SaveButton'
import JoinRequestModal from '../components/opportunities/JoinRequestModal'
import { categoryTone } from '../utils/ui'
import { daysLeft, deadlineLabel, formatDate } from '../utils/format'

function Section({ icon: Icon, title, children }) {
  return (
    <section className="card p-6 sm:p-8">
      <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
        {Icon && <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />}{title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { opportunities, loading, profile, joinRequests, requestToJoin, withdrawRequest, removeOpportunity } = useAppData()
  const [joinOpen, setJoinOpen] = useState(false) // UI-only
  const [confirm, setConfirm] = useState(null) // UI-only

  const o = opportunities.find((x) => x.id === id)
  if (loading) return <div className="card h-96 animate-pulse" aria-busy="true" />
  if (!o) {
    return <EmptyState icon={SearchX} title="We could not find that opportunity" description="It may have been removed by the person who posted it." action={<Button to="/">Back to Discover</Button>} />
  }

  const mine = o.creator.id === profile.id
  const creator = mine ? profile : o.creator
  const request = joinRequests.find((r) => r.opportunityId === o.id)
  const closed = daysLeft(o.deadline) < 0
  const full = o.openSpots === 0

  const sendRequest = async (message) => {
    try {
      await requestToJoin(o.id, message)
      setJoinOpen(false)
      toast({ title: 'Request saved (demo)', message: 'Nothing was sent to real people.' })
    } catch {
      toast({ type: 'error', title: 'Could not send request', message: 'Please try again.' })
    }
  }

  const askWithdraw = () => setConfirm({
    title: 'Withdraw your request?', message: 'You can send a new request later if there are still open spots.', confirmLabel: 'Withdraw request',
    onConfirm: async () => { await withdrawRequest(request.id); toast({ title: 'Request withdrawn' }) },
  })
  const askDelete = () => setConfirm({
    title: 'Delete this opportunity?', message: 'It will disappear from Discover and Saved. This cannot be undone.', confirmLabel: 'Delete opportunity',
    onConfirm: async () => { await removeOpportunity(o.id); toast({ title: 'Opportunity deleted' }); navigate('/') },
  })

  return (
    <div>
      <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-ink-soft hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Discover
      </Link>

      <header className="mb-8 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-cream-50 p-6 ring-1 ring-brand-100 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone={categoryTone(o.category)}>{o.category}</Badge>
          <Badge tone={closed ? 'slate' : daysLeft(o.deadline) <= 3 ? 'rose' : 'slate'} icon={CalendarClock}>{deadlineLabel(o.deadline)}</Badge>
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">{o.title}</h1>
        <div className="mt-6 flex items-center gap-3">
          <Avatar name={creator.name} size="md" />
          <p className="text-sm leading-tight"><span className="block font-semibold text-ink">{creator.name}</span><span className="text-ink-muted">{creator.year}, {creator.major}</span></p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Section title="About this opportunity"><p className="leading-relaxed text-ink-soft">{o.description}</p></Section>

          <Section icon={Target} title="Goals">
            <ul className="space-y-3">
              {o.goals.map((g) => (
                <li key={g} className="flex gap-3 text-ink-soft"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />{g}</li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <p className="mb-2 text-sm font-semibold text-ink">Required</p>
            <SkillTags skills={o.requiredSkills} label="Required skills" />
            {o.niceToHaveSkills.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-sm font-semibold text-ink">Nice to have</p>
                <SkillTags skills={o.niceToHaveSkills} variant="optional" label="Nice-to-have skills" />
              </>
            )}
          </Section>

          <Section icon={Flag} title="Timeline"><p className="text-ink-soft">{o.timeline}</p></Section>

          <Section title="Current team">
            <ul className="grid gap-3 sm:grid-cols-2">
              {o.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-cream-100 p-3">
                  <Avatar name={m.name} size="md" />
                  <span className="text-sm leading-tight"><span className="block font-semibold text-ink">{m.name}</span><span className="text-ink-muted">{m.role}</span></span>
                </li>
              ))}
              {Array.from({ length: o.openSpots }, (_, i) => (
                <li key={`open-${i}`} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-brand-200 p-3 text-sm font-semibold text-brand-700">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50"><Users className="h-5 w-5" aria-hidden="true" /></span>
                  Open seat
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card space-y-5 p-6">
            <dl className="space-y-3 text-sm">
              {[
                [Users, 'Team', `${o.openSpots} of ${o.teamSize} spots open`],
                [CalendarClock, 'Deadline', formatDate(o.deadline)],
                [MapPin, 'Mode', o.mode],
                [Gauge, 'Commitment', `${o.commitment} commitment`],
                [Mail, 'Contact', o.contactPreference],
              ].map(([Icon, label, value]) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                  <dt className="w-24 text-ink-muted">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {mine ? (
              <div className="space-y-3">
                <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900">You posted this opportunity.</p>
                <Button variant="dangerSoft" icon={Trash2} className="w-full" onClick={askDelete}>Delete opportunity</Button>
              </div>
            ) : request ? (
              <div role="status" className="space-y-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <p className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Request sent</p>
                {request.message && <p className="text-sm text-emerald-900">“{request.message}”</p>}
                <p className="flex gap-2 text-xs text-emerald-900"><FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Demo behavior: this request stays in your browser session. No one has been notified.</p>
                <Button variant="secondary" size="sm" icon={Undo2} onClick={askWithdraw}>Withdraw request</Button>
              </div>
            ) : (
              <Button icon={Send} size="lg" className="w-full" disabled={closed || full} onClick={() => setJoinOpen(true)}>
                {closed ? 'Applications closed' : full ? 'Team is full' : 'Request to join'}
              </Button>
            )}
            <SaveButton opportunity={o} withLabel className="w-full" />
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">About the creator</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={creator.name} size="lg" />
              <p className="text-sm leading-tight"><span className="block text-base font-bold text-ink">{creator.name}</span><span className="text-ink-muted">{creator.year}, {creator.major}</span></p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{creator.bio}</p>
            {mine && <Button to="/profile" variant="secondary" size="sm" className="mt-4">Edit your profile</Button>}
          </div>
        </aside>
      </div>

      {joinOpen && <JoinRequestModal opportunity={o} onClose={() => setJoinOpen(false)} onSubmit={sendRequest} />}
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
