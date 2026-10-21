import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, FlaskConical, MessageCircle, Send } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { formatTime, timeAgo } from '../utils/format'

export default function Messages() {
  const { conversations, loading, sendMessage, markConversationRead } = useAppData()
  const toast = useToast()
  // UI-only state
  const [activeId, setActiveId] = useState(null)
  const [mobileChat, setMobileChat] = useState(false)
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.messages.at(-1).sentAt) - new Date(a.messages.at(-1).sentAt)),
    [conversations],
  )
  const active = sorted.find((c) => c.id === activeId) || sorted[0]

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [active?.messages.length, active?.id])

  const open = async (c) => {
    setActiveId(c.id)
    setMobileChat(true)
    if (c.unread) await markConversationRead(c.id)
  }

  const send = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !active) return
    setDraft('')
    try { await sendMessage(active.id, text) } catch { setDraft(text); toast({ type: 'error', title: 'Could not add your message' }) }
  }

  return (
    <div>
      <PageHeader title="Messages" description="A preview of how team chat will feel." />
      <p className="mb-5 flex items-start gap-2.5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900 ring-1 ring-brand-100">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span><strong>Demo messaging.</strong> Messages you type stay in this browser tab. They are not sent to real people, and no one will reply.</span>
      </p>

      {loading ? (
        <div className="card h-[32rem] animate-pulse" aria-busy="true" />
      ) : sorted.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No conversations yet" description="When you join a team or contact a creator, chats will appear here." action={<Button to="/">Go to Discover</Button>} />
      ) : (
        <div className="card flex h-[34rem] overflow-hidden md:h-[36rem]">
          <nav aria-label="Conversations" className={`${mobileChat ? 'hidden' : 'flex'} w-full flex-col border-cream-200 md:flex md:w-80 md:shrink-0 md:border-r`}>
            <ul className="flex-1 overflow-y-auto">
              {sorted.map((c) => {
                const last = c.messages.at(-1)
                const current = c.id === active?.id
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => open(c)} aria-current={current ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 border-b border-cream-200 px-4 py-4 text-left transition hover:bg-cream-100 ${current ? 'md:bg-brand-50' : ''}`}>
                      <Avatar name={c.name} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${c.unread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>{c.name}</span>
                          <span className="shrink-0 text-xs text-ink-muted">{timeAgo(last.sentAt)}</span>
                        </span>
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${c.unread ? 'font-medium text-ink' : 'text-ink-muted'}`}>{last.from === 'me' ? 'You: ' : ''}{last.text}</span>
                          {c.unread > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white"><span className="sr-only">Unread messages: </span>{c.unread}</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section aria-label={`Chat with ${active.name}`} className={`${mobileChat ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`}>
            <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3 sm:px-5">
              <button type="button" onClick={() => setMobileChat(false)} aria-label="Back to conversations" className="rounded-lg p-2 text-ink-soft hover:bg-cream-200 md:hidden">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <Avatar name={active.name} size="sm" />
              <p className="min-w-0 text-sm leading-tight"><span className="block truncate font-bold text-ink">{active.name}</span><span className="block truncate text-ink-muted">{active.context}</span></p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-cream-50 px-4 py-5 sm:px-5" role="log" aria-live="polite" aria-label="Messages">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'me' ? 'rounded-br-md bg-gradient-to-br from-brand-500 to-brand-700 text-white' : 'rounded-bl-md bg-white text-ink ring-1 ring-cream-300'}`}>
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={`mt-1 text-[11px] ${m.from === 'me' ? 'text-white/70' : 'text-ink-muted'}`}>{formatTime(m.sentAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex items-center gap-3 border-t border-cream-200 p-3 sm:p-4">
              <label htmlFor="chat-input" className="sr-only">Type a demo message to {active.name}</label>
              <input id="chat-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a demo message" autoComplete="off" className="field h-11" />
              <Button type="submit" icon={Send} disabled={!draft.trim()} aria-label="Send message"><span className="hidden sm:inline">Send</span></Button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
