export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-cream-300 bg-white/60 px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      )}
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      {description && <p className="mt-1.5 max-w-md text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  )
}
