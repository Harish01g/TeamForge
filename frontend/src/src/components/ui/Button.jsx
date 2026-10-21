import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm hover:shadow-lift hover:-translate-y-px',
  secondary: 'border border-cream-300 bg-white text-ink hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-ink-soft hover:bg-cream-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  dangerSoft: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  glass: 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20',
  light: 'bg-white text-ink hover:bg-brand-50',
}
const sizes = { sm: 'h-9 px-3.5 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-6 text-base' }

export default function Button({ to, variant = 'primary', size = 'md', icon: Icon, className = '', children, ...props }) {
  const cls = `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition duration-150 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls} {...props}>{content}</Link>
  return <button type="button" className={cls} {...props}>{content}</button>
}
