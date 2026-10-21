export default function OpportunitySkeleton() {
  return (
    <div className="card animate-pulse space-y-4 p-5" aria-hidden="true">
      <div className="flex gap-2"><div className="h-6 w-20 rounded-full bg-cream-200" /><div className="h-6 w-24 rounded-full bg-cream-200" /></div>
      <div className="h-6 w-3/4 rounded-lg bg-cream-200" />
      <div className="space-y-2"><div className="h-3 rounded bg-cream-200" /><div className="h-3 w-5/6 rounded bg-cream-200" /></div>
      <div className="flex gap-2"><div className="h-6 w-16 rounded-lg bg-cream-200" /><div className="h-6 w-20 rounded-lg bg-cream-200" /><div className="h-6 w-14 rounded-lg bg-cream-200" /></div>
      <div className="h-10 rounded-lg bg-cream-100" />
    </div>
  )
}
