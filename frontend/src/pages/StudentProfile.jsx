import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Code, Globe, GraduationCap } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import SkillTags from '../components/ui/SkillTags'
import { getStudent } from '../services/studentService'
import { externalUrl } from '../utils/ui'

export default function StudentProfile() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getStudent(id).then((data) => { if (active) setStudent(data) }).catch((err) => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="card h-80 animate-pulse" aria-busy="true" />
  if (error || !student) return <div className="space-y-5"><Button to="/students" variant="secondary" icon={ArrowLeft}>Back to students</Button><div role="alert" className="card p-6 text-sm text-rose-700">{error || 'Student not found.'}</div></div>

  return (
    <div className="space-y-6">
      <Button to="/students" variant="ghost" size="sm" icon={ArrowLeft}>Back to student directory</Button>
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#1c2b5c] to-brand-700 p-6 text-white sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={student.name} size="xl" className="ring-4 ring-white/20" />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{student.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-white/80"><GraduationCap className="h-4 w-4" aria-hidden="true" />{student.year}{student.major ? ` · ${student.major}` : ''}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
              {student.github && <a href={externalUrl(student.github)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"><Code className="h-4 w-4" aria-hidden="true" />GitHub</a>}
              {student.portfolio && <a href={externalUrl(student.portfolio)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"><Globe className="h-4 w-4" aria-hidden="true" />Portfolio</a>}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section className="card p-6 sm:p-8"><h2 className="font-display text-xl font-bold text-ink">About</h2><p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-soft">{student.bio || 'This student has not added a bio yet.'}</p></section>
          <section className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div><h2 className="mb-3 font-display text-xl font-bold text-ink">Skills</h2>{student.skills.length ? <SkillTags skills={student.skills} label={`${student.name}'s skills`} /> : <p className="text-sm text-ink-muted">No skills listed yet.</p>}</div>
            <div><h2 className="mb-3 font-display text-xl font-bold text-ink">Interests</h2>{student.interests.length ? <SkillTags skills={student.interests} variant="optional" label={`${student.name}'s interests`} /> : <p className="text-sm text-ink-muted">No interests listed yet.</p>}</div>
          </section>
          <section className="card p-6 sm:p-8"><h2 className="font-display text-xl font-bold text-ink">Completed projects</h2>{student.completedProjects.length ? <ul className="mt-4 grid gap-4 sm:grid-cols-2">{student.completedProjects.map((project, index) => <li key={project.id || `${project.title}-${index}`} className="rounded-2xl bg-cream-100 p-4"><p className="font-bold text-ink">{project.title}</p>{(project.role || project.year) && <p className="text-sm font-semibold text-brand-700">{[project.role, project.year].filter(Boolean).join(', ')}</p>}{project.summary && <p className="mt-2 text-sm text-ink-soft">{project.summary}</p>}</li>)}</ul> : <p className="mt-3 text-sm text-ink-soft">No completed projects listed yet.</p>}</section>
        </div>
        <aside className="card h-fit p-6 lg:sticky lg:top-28"><h2 className="font-display text-lg font-bold text-ink">Working together</h2><p className="mt-2 text-sm leading-relaxed text-ink-soft">{student.availability || 'Availability has not been shared yet.'}</p><p className="mt-5 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">Student contact details stay private. Use TeamForge opportunities to connect with classmates.</p><Link to="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900">Explore opportunities <span aria-hidden="true">→</span></Link></aside>
      </div>
    </div>
  )
}
