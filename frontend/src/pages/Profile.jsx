import { useState } from 'react'
import { Check, Circle, Clock, ExternalLink, Code, Globe, Pencil, Save } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import { YEARS } from '../constants'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import ProgressBar from '../components/ui/ProgressBar'
import SkillTags from '../components/ui/SkillTags'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { profileCompleteness } from '../utils/profile'
import { splitList } from '../utils/format'
import { externalUrl } from '../utils/ui'

function toForm(p) {
  return { name: p.name, year: p.year, major: p.major, bio: p.bio, skills: p.skills.join(', '), interests: p.interests.join(', '), availability: p.availability, github: p.github, portfolio: p.portfolio }
}

function ProfileForm({ profile, onSave, onCancel }) {
  const [values, setValues] = useState(toForm(profile)) // UI-only draft
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Your name is required.'
    if (!values.major.trim()) next.major = 'Your major is required.'
    if (values.bio.length > 300) next.bio = 'Keep your bio under 300 characters.'
    setErrors(next)
    if (Object.keys(next).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0); return }
    setSaving(true)
    await onSave({
      name: values.name.trim(), year: values.year, major: values.major.trim(), bio: values.bio.trim(),
      skills: splitList(values.skills), interests: splitList(values.interests), availability: values.availability.trim(),
      github: values.github.trim(), portfolio: values.portfolio.trim(),
    })
    setSaving(false)
  }

  return (
    <form onSubmit={submit} noValidate className="card space-y-6 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold text-ink">Edit your profile</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full name" required value={values.name} onChange={set('name')} error={errors.name} />
        <FormField as="select" label="Year" required value={values.year} onChange={set('year')}>{YEARS.map((y) => <option key={y}>{y}</option>)}</FormField>
      </div>
      <FormField label="Major" required value={values.major} onChange={set('major')} error={errors.major} />
      <FormField as="textarea" label="Bio" value={values.bio} onChange={set('bio')} error={errors.bio} hint={`${values.bio.length}/300 characters`} />
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Skills" value={values.skills} onChange={set('skills')} hint="Separate with commas" />
        <FormField label="Interests" value={values.interests} onChange={set('interests')} hint="Separate with commas" />
      </div>
      <FormField label="Availability" value={values.availability} onChange={set('availability')} placeholder="e.g. Evenings and weekends, 8 hours a week" />
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="GitHub" value={values.github} onChange={set('github')} placeholder="github.com/your-name" />
        <FormField label="Portfolio" value={values.portfolio} onChange={set('portfolio')} placeholder="your-site.com" />
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-cream-200 pt-6 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" icon={Save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </div>
    </form>
  )
}

export default function Profile() {
  const { profile, loading, saveProfile } = useAppData()
  const toast = useToast()
  const [editing, setEditing] = useState(false) // UI-only
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (loading || !profile) return <div className="card h-96 animate-pulse" aria-busy="true" />
  const { percent, checks } = profileCompleteness(profile)

  const save = async (values) => {
    try {
      await saveProfile(values)
      setEditing(false)
      toast({ title: 'Profile updated', message: 'Your changes are saved to your account.' })
    } catch {
      toast({ type: 'error', title: 'Could not save your profile', message: 'Please try again.' })
    }
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#1c2b5c] to-brand-700 p-6 text-white sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar name={profile.name} size="xl" className="ring-4 ring-white/20" />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{profile.name}</h1>
            <p className="mt-1 text-white/80">{profile.year}, {profile.major}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
              {profile.github && <a href={externalUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"><Code className="h-4 w-4" aria-hidden="true" />{profile.github}<span className="sr-only">(opens in a new tab)</span></a>}
              {profile.portfolio && <a href={externalUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"><Globe className="h-4 w-4" aria-hidden="true" />{profile.portfolio}<span className="sr-only">(opens in a new tab)</span></a>}
            </div>
          </div>
          {!editing && <Button variant="light" icon={Pencil} onClick={() => setEditing(true)}>Edit profile</Button>}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          {editing ? (
            <ProfileForm profile={profile} onSave={save} onCancel={() => setConfirmCancel(true)} />
          ) : (
            <>
              <section className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-ink">About</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{profile.bio || 'Add a short bio so teammates know what you are into.'}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft"><Clock className="h-4 w-4 text-brand-600" aria-hidden="true" /><span><strong className="text-ink">Availability:</strong> {profile.availability || 'Not shared yet'}</span></p>
              </section>
              <section className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                <div><h2 className="mb-3 font-display text-xl font-bold text-ink">Skills</h2><SkillTags skills={profile.skills} label="Your skills" /></div>
                <div><h2 className="mb-3 font-display text-xl font-bold text-ink">Interests</h2><SkillTags skills={profile.interests} variant="optional" label="Your interests" /></div>
              </section>
              <section className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-ink">Completed projects</h2>
                {profile.completedProjects.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-soft">No projects yet. Finished work shows teammates what you can do.</p>
                ) : (
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {profile.completedProjects.map((p) => (
                      <li key={p.id} className="rounded-2xl bg-cream-100 p-4">
                        <p className="font-bold text-ink">{p.title}</p>
                        <p className="text-sm font-semibold text-brand-700">{p.role}, {p.year}</p>
                        <p className="mt-2 text-sm text-ink-soft">{p.summary}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-28" aria-labelledby="complete-title">
          <h2 id="complete-title" className="font-display text-lg font-bold text-ink">Profile completeness</h2>
          <p className="mt-2 font-display text-4xl font-extrabold text-brand-700">{percent}%</p>
          <ProgressBar value={percent} label="Profile completeness" className="mt-3" />
          <ul className="mt-5 space-y-2.5 text-sm">
            {checks.map((c) => (
              <li key={c.label} className={`flex items-start gap-2.5 ${c.done ? 'text-ink-muted' : 'font-semibold text-ink'}`}>
                {c.done ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />}
                <span><span className="sr-only">{c.done ? 'Done: ' : 'To do: '}</span>{c.label}</span>
              </li>
            ))}
          </ul>
          {!editing && percent < 100 && <Button variant="secondary" size="sm" className="mt-5 w-full" onClick={() => setEditing(true)}>Complete your profile</Button>}
        </aside>
      </div>

      {confirmCancel && (
        <ConfirmDialog title="Discard your changes?" message="Edits you made to your profile will be lost." confirmLabel="Discard changes"
          onConfirm={() => setEditing(false)} onCancel={() => setConfirmCancel(false)} />
      )}
    </div>
  )
}
