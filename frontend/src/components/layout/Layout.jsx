import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import { useAppData } from '../../context/AppDataContext'
import Button from '../ui/Button'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { error, reload } = useAppData()
  return (
    <div className="min-h-screen lg:pl-72">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to main content
      </a>
      <ScrollToTop />
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 focus:outline-none sm:px-6 lg:px-10 lg:pb-16">
          {error ? (
            <div role="alert" className="card flex flex-col items-start gap-4 p-6">
              <p className="font-semibold text-ink">{error}</p>
              <Button onClick={reload}>Try again</Button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
