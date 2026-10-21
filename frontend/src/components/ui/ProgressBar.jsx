export default function ProgressBar({ value, label, className = '' }) {
  return (
    <div className={className}>
      <div className="h-2 overflow-hidden rounded-full bg-cream-200" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-700 transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
