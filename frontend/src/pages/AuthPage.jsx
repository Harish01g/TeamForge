import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, UsersRound } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const change = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isSignup) await signUp(values)
      else await signIn({ email: values.email, password: values.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Logo />
        <div className="mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-card md:grid-cols-2">
          <section className="bg-gradient-to-br from-ink via-[#1c2b5c] to-brand-700 p-8 text-white sm:p-10">
            <div className="flex h-full flex-col justify-between gap-12">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><UsersRound aria-hidden="true" /></span>
                <h1 className="mt-8 font-display text-3xl font-extrabold leading-tight">Find your people. Build something real.</h1>
                <p className="mt-4 leading-relaxed text-white/75">Meet students with the skills and energy to bring your next project to life.</p>
              </div>
              <p className="text-sm text-white/60">TeamForge · Built for campus collaboration</p>
            </div>
          </section>
          <section className="p-8 sm:p-10">
            <div className="mb-7">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Student account</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
              <p className="mt-2 text-sm text-ink-soft">{isSignup ? 'Join TeamForge and find your next team.' : 'Sign in to pick up where your team left off.'}</p>
            </div>
            <form onSubmit={submit} className="space-y-5">
              {isSignup && (
                <label className="block text-sm font-semibold text-ink">Full name
                  <input className="field mt-2" autoComplete="name" value={values.name} onChange={change('name')} required minLength={2} maxLength={80} />
                </label>
              )}
              <label className="block text-sm font-semibold text-ink">Email
                <input className="field mt-2" type="email" autoComplete="email" value={values.email} onChange={change('email')} required />
              </label>
              <label className="block text-sm font-semibold text-ink">Password
                <input className="field mt-2" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={change('password')} required minLength={8} />
                {isSignup && <span className="mt-1 block text-xs font-normal text-ink-muted">Use at least 8 characters.</span>}
              </label>
              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <Button type="submit" className="w-full justify-center" icon={ArrowRight} disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              {isSignup ? 'Already have an account? ' : 'New to TeamForge? '}
              <Link className="font-bold text-brand-700 hover:underline" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
