const gradients = [
  'from-brand-400 to-brand-700', 'from-sky-400 to-indigo-600', 'from-fuchsia-400 to-brand-600',
  'from-emerald-400 to-teal-600', 'from-amber-400 to-rose-500', 'from-indigo-400 to-ink',
]
const sizes = { xs: 'h-7 w-7 text-[10px]', sm: 'h-9 w-9 text-xs', md: 'h-11 w-11 text-sm', lg: 'h-16 w-16 text-xl', xl: 'h-24 w-24 text-3xl' }

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const index = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % gradients.length
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ring-2 ring-white ${gradients[index]} ${sizes[size]} ${className}`}>
      {initials}
    </span>
  )
}

export function AvatarStack({ names, max = 4, size = 'sm' }) {
  const shown = names.slice(0, max)
  const extra = names.length - shown.length
  return (
    <div className="flex items-center -space-x-2" role="img" aria-label={`Members: ${names.join(', ')}`}>
      {shown.map((n) => <Avatar key={n} name={n} size={size} />)}
      {extra > 0 && <span className="z-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-200 text-xs font-bold text-ink-soft ring-2 ring-white">+{extra}</span>}
    </div>
  )
}
