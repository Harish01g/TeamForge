export default function SkillTags({ skills, variant = 'required', max, label = 'Skills' }) {
  const shown = max ? skills.slice(0, max) : skills
  const extra = skills.length - shown.length
  const style = variant === 'required'
    ? 'bg-brand-50 text-brand-800'
    : variant === 'optional'
      ? 'border border-dashed border-cream-300 bg-white text-ink-soft'
      : variant === 'glass' ? 'bg-white/15 text-white' : 'bg-cream-200 text-ink-soft'
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {shown.map((s) => <li key={s} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${style}`}>{s}</li>)}
      {extra > 0 && <li className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-muted">+{extra} more</li>}
    </ul>
  )
}
