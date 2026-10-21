import { useId } from 'react'
import { AlertCircle } from 'lucide-react'

// One labelled form control. Use as="textarea" or as="select" (pass <option> children).
export default function FormField({ label, as = 'input', error, hint, required, className = '', children, ...props }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && !error && hintId, error && errorId].filter(Boolean).join(' ') || undefined
  const common = {
    id,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
    className: `field ${error ? 'field-error' : ''}`,
    ...props,
  }
  let control
  if (as === 'textarea') control = <textarea rows={4} {...common} />
  else if (as === 'select') control = <select {...common}>{children}</select>
  else control = <input {...common} />

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-rose-600" aria-hidden="true"> *</span> : <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {control}
      {hint && !error && <p id={hintId} className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
