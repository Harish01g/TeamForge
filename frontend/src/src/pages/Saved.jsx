import { useState } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import OpportunityCard from '../components/opportunities/OpportunityCard'
import OpportunitySkeleton from '../components/opportunities/OpportunitySkeleton'

export default function Saved() {
  const { opportunities, savedIds, loading, clearSaved } = useAppData()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false) // UI-only
  const saved = savedIds.map((id) => opportunities.find((o) => o.id === id)).filter(Boolean)

  return (
    <div>
      <PageHeader title="Saved" description="Opportunities you want to come back to."
        actions={saved.length > 0 && <Button variant="dangerSoft" icon={Trash2} onClick={() => setConfirm(true)}>Remove all</Button>} />
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((i) => <OpportunitySkeleton key={i} />)}</div>
      ) : saved.length === 0 ? (
        <EmptyState icon={Bookmark} title="Nothing saved yet" description="Tap the bookmark on any opportunity to keep it here for later." action={<Button to="/">Back to Discover</Button>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{saved.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}</div>
      )}
      {confirm && (
        <ConfirmDialog title="Remove all saved opportunities?" message={`${saved.length} saved ${saved.length === 1 ? 'item' : 'items'} will be removed from this list.`} confirmLabel="Remove all"
          onConfirm={async () => { await clearSaved(); toast({ title: 'Saved list cleared' }) }} onCancel={() => setConfirm(false)} />
      )}
    </div>
  )
}
