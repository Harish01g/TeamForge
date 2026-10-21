import { Bookmark } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../ui/Toast'

export default function SaveButton({ opportunity, withLabel = false, className = '' }) {
  const { savedIds, toggleSave } = useAppData()
  const toast = useToast()
  const saved = savedIds.includes(opportunity.id)

  const onClick = async () => {
    try {
      await toggleSave(opportunity.id)
      toast({ title: saved ? 'Removed from Saved' : 'Saved for later', message: opportunity.title })
    } catch {
      toast({ type: 'error', title: 'Could not update Saved', message: 'Please try again.' })
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `${saved ? 'Remove from saved' : 'Save'}: ${opportunity.title}`}
      className={`relative z-10 inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
        saved ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-cream-300 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700'
      } ${withLabel ? 'h-11 px-5' : 'h-9 w-9'} ${className}`}
    >
      <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      {withLabel && (saved ? 'Saved' : 'Save for later')}
    </button>
  )
}
