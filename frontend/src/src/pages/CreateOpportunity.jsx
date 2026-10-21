import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Lightbulb, Plus } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import { CATEGORIES, COMMITMENTS, CONTACT_PREFERENCES, MODES } from '../constants'
import PageHeader from '../components/ui/PageHeader'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { splitList, todayISO } from '../utils/format'

const emptyForm = {
  title: '', category: '', description: '', goals: '', requiredSkills: '', niceToHaveSkills: '',
  teamSize: '4', deadline: '', timeline: '', mode: '', commitment: '', contactPreference: '',
}

function validate(v) {
  const e = {}
  if (v.title.trim().length < 5) e.title = 'Give your opportunity a title of at least 5 characters.'
  if (!v.category) e.category = 'Choose a category.'
  if (v.description.trim().length < 30) e.description = 'Describe it in at least 30 characters so people know what they are joining.'
  if (splitList(v.goals, '\n').length === 0) e.goals = 'Add at least one goal, one per line.'
  if (splitList(v.requiredSkills).length === 0) e.requiredSkills = 'List at least one required skill, separated by commas.'
  const size = Number(v.teamSize)
  if (!Number.isInteger(size) || size < 2 || size > 20) e.teamSize = 'Team size must be a whole number from 2 to 20.'
  if (!v.deadline) e.deadline = 'Pick an application deadline.'
  else if (v.deadline < todayISO()) e.deadline = 'The deadline cannot be in the past.'
  if (!v.mode) e.mode = 'Choose how the team will work.'
  if (!v.commitment) e.commitment = 'Choose the expected commitment.'
  if (!v.contactPreference) e.contactPreference = 'Choose how people should contact you.'
  return e
}

export default function CreateOpportunity() {
  const { addOpportunity } = useAppData()
  const toast = useToast()
  const navigate = useNavigate()
  // UI-only form state
  const [values, setValues] = useState(emptyForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)
  const [confirmLeave, setConfirmLeave] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const dirty = JSON.stringify(values) !== JSON.stringify(emptyForm)
  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))
  const field = (name) => ({
    value: values[name], onChange: set(name),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    error: submitted || touched[name] ? errors[name] : undefined,
  })

  const submit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      toast({ type: 'error', title: 'Please fix the highlighted fields' })
      setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setSaving(true)
    try {
      const opp = await addOpportunity({
        title: values.title.trim(), category: values.category, description: values.description.trim(),
        goals: splitList(values.goals, '\n'), requiredSkills: splitList(values.requiredSkills), niceToHaveSkills: splitList(values.niceToHaveSkills),
        teamSize: Number(values.teamSize), deadline: values.deadline, timeline: values.timeline.trim() || 'The team lead will share the timeline.',
        mode: values.mode, commitment: values.commitment, contactPreference: values.contactPreference,
      })
      setCreated(opp)
      toast({ title: 'Opportunity posted', message: 'It now appears on Discover for this session.' })
    } catch {
      toast({ type: 'error', title: 'Could not post your opportunity', message: 'Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-9 w-9" aria-hidden="true" /></span>
        <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">Your opportunity is posted</h1>
        <p className="mt-2 text-ink-soft">“{created.title}” is now on the Discover board. This is demo data, so it lives in this browser session only.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to={`/opportunities/${created.id}`}>View opportunity</Button>
          <Button variant="secondary" onClick={() => { setValues(emptyForm); setTouched({}); setSubmitted(false); setCreated(null) }}>Post another</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Post an opportunity" description="Tell students what you are building and who you need. Fields marked with * are required." />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={submit} noValidate className="card space-y-6 p-6 sm:p-8">
          <FormField label="Title" required placeholder="e.g. Campus Navigator mobile app" {...field('title')} />
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField as="select" label="Category" required {...field('category')}>
              <option value="">Choose a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </FormField>
            <FormField label="Team size" required type="number" min="2" max="20" hint="Including you" {...field('teamSize')} />
          </div>
          <FormField as="textarea" label="Description" required rows={5} placeholder="What are you building, and why does it matter?" {...field('description')} />
          <FormField as="textarea" label="Goals" required rows={4} placeholder={'One goal per line\nBuild a working prototype\nPresent at the demo day'} hint="One goal per line" {...field('goals')} />
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Required skills" required placeholder="React, Figma, Python" hint="Separate with commas" {...field('requiredSkills')} />
            <FormField label="Nice-to-have skills" placeholder="MongoDB, Pitching" hint="Separate with commas" {...field('niceToHaveSkills')} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Application deadline" required type="date" min={todayISO()} {...field('deadline')} />
            <FormField label="Timeline" placeholder="e.g. Six weeks, demo in December" {...field('timeline')} />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <FormField as="select" label="Mode" required {...field('mode')}>
              <option value="">Choose mode</option>{MODES.map((m) => <option key={m}>{m}</option>)}
            </FormField>
            <FormField as="select" label="Commitment" required {...field('commitment')}>
              <option value="">Choose level</option>{COMMITMENTS.map((c) => <option key={c}>{c}</option>)}
            </FormField>
            <FormField as="select" label="Contact preference" required {...field('contactPreference')}>
              <option value="">Choose one</option>{CONTACT_PREFERENCES.map((c) => <option key={c}>{c}</option>)}
            </FormField>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-cream-200 pt-6 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => (dirty ? setConfirmLeave(true) : navigate('/'))}>Cancel</Button>
            <Button type="submit" icon={Plus} disabled={saving}>{saving ? 'Posting…' : 'Post opportunity'}</Button>
          </div>
        </form>

        <aside className="card h-fit bg-gradient-to-br from-brand-50 to-white p-6 lg:sticky lg:top-28">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink"><Lightbulb className="h-5 w-5 text-brand-600" aria-hidden="true" />Tips for a strong post</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>Name the outcome, not just the topic. “Ship an app by December” beats “mobile app project”.</li>
            <li>List only the skills you truly need. Put the rest under nice-to-have.</li>
            <li>Be honest about time. Students plan around exams.</li>
          </ul>
          <p className="mt-5 text-xs text-ink-muted">Demo: your post is stored in this browser session and is not shared with real users.</p>
        </aside>
      </div>
      {confirmLeave && (
        <ConfirmDialog title="Discard this draft?" message="Everything you have typed will be lost." confirmLabel="Discard draft" onConfirm={() => navigate('/')} onCancel={() => setConfirmLeave(false)} />
      )}
    </div>
  )
}
