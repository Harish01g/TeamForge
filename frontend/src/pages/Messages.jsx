import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, RefreshCw, Send } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../components/ui/Toast'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { formatTime, timeAgo } from '../utils/format'

export default function Messages() {
  const { conversations, loading, sendMessage, markConversationRead, refreshConversations } = useAppData()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeId, setActiveId] = useState(null)
  const [mobileChat, setMobileChat] = useState(false)
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)
  const handledQuery = useRef('')
  const requestedOpportunity = searchParams.get('opportunity')

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.lastMessageAt || b.messages.at(-1)?.sentAt || 0) - new Date(a.lastMessageAt || a.messages.at(-1)?.sentAt || 0)),
    [conversations],
  )
  const active = sorted.find((c) => c.id === activeId) || sorted[0]

  useEffect(() => {
    if (!requestedOpportunity) { handledQuery.current = ''; return }
    if (handledQuery.current === requestedOpportunity) return
    const match = conversations.find((conversation) => conversation.opportunityId === requestedOpportunity)
    if (match) {
      setActiveId(match.id)
      setMobileChat(true)
      handledQuery.current = requestedOpportunity
    }
  }, [requestedOpportunity, conversations])

  useEffect(() => {
    const timer = window.setInterval(() => { refreshConversations().catch(() => {}) }, 5000)
    return () => window.clearInterval(timer)
  }, [refreshConversations])

  useEffect(() => {
    if (mobileChat && active?.unread > 0) markConversationRead(active.id).catch(() => {})
  }, [active?.id, active?.unread, mobileChat, markConversationRead])

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [active?.messages.at(-1)?.id, active?.id])

  const open = async (conversation) => {
    setActiveId(conversation.id)
    setMobileChat(true)
    setSearchParams({ opportunity: conversation.opportunityId })
    if (conversation.unread) {
      try { await markConversationRead(conversation.id) } catch { toast({ type: 'error', title: 'Could not mark messages as read' }) }
    }
  }

  const send = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !active) return
    setDraft('')
    try { await sendMessage(active.opportunityId, text) } catch (error) {
      setDraft(text)
      toast({ type: 'error', title: 'Could not send message', message: error.message || 'Please try again.' })
    }
  }

  return (
    <div>
      <PageHeader title="Messages" description="Chat with students on opportunities you’re part of." actions={<Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refreshConversations().catch(() => toast({ type: 'error', title: 'Could not refresh chats' }))}>Refresh</Button>} />
      <p className="mb-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900 ring-1 ring-brand-100">
        Team chats are private to current members of each opportunity. New messages sync automatically while this page is open.
      </p>

      {loading ? (
        <div className="card h-[32rem] animate-pulse" aria-busy="true" />
      ) : sorted.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No team chats yet" description="Create an opportunity or be accepted into a team. Its private chat will appear here." action={<Button to="/">Go to Discover</Button>} />
      ) : (
        <div className="card flex h-[34rem] overflow-hidden md:h-[36rem]">
          <nav aria-label="Team chats" className={`${mobileChat ? 'hidden' : 'flex'} w-full flex-col border-cream-200 md:flex md:w-80 md:shrink-0 md:border-r`}>
            <ul className="flex-1 overflow-y-auto">
              {sorted.map((conversation) => {
                const last = conversation.messages.at(-1)
                const current = conversation.id === active?.id
                return (
                  <li key={conversation.id}>
                    <button type="button" onClick={() => open(conversation)} aria-current={current ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 border-b border-cream-200 px-4 py-4 text-left transition hover:bg-cream-100 ${current ? 'md:bg-brand-50' : ''}`}>
                      <Avatar name={conversation.name} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${conversation.unread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>{conversation.name}</span>
                          <span className="shrink-0 text-xs text-ink-muted">{timeAgo(last?.sentAt || conversation.lastMessageAt)}</span>
                        </span>
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${conversation.unread ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                            {last ? `${last.from === 'me' ? 'You' : last.senderName}: ${last.text}` : 'Start a conversation with your team'}
                          </span>
                          {conversation.unread > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white"><span className="sr-only">Unread messages: </span>{conversation.unread}</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section aria-label={`Team chat for ${active.name}`} className={`${mobileChat ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`}>
            <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3 sm:px-5">
              <button type="button" onClick={() => setMobileChat(false)} aria-label="Back to team chats" className="rounded-lg p-2 text-ink-soft hover:bg-cream-200 md:hidden">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <Avatar name={active.name} size="sm" />
              <p className="min-w-0 text-sm leading-tight"><span className="block truncate font-bold text-ink">{active.name}</span><span className="block truncate text-ink-muted">{active.context}</span></p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-cream-50 px-4 py-5 sm:px-5" role="log" aria-live="polite" aria-label="Team messages">
              {active.messages.length === 0 ? (
                <div className="grid h-full place-items-center text-center"><div><MessageCircle className="mx-auto h-8 w-8 text-brand-500" aria-hidden="true" /><p className="mt-3 font-semibold text-ink">Say hello to your team</p><p className="mt-1 text-sm text-ink-muted">Your message will be saved for all team members.</p></div></div>
              ) : active.messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.from === 'me' ? 'rounded-br-md bg-gradient-to-br from-brand-500 to-brand-700 text-white' : 'rounded-bl-md bg-white text-ink ring-1 ring-cream-300'}`}>
                    {message.from !== 'me' && <p className="mb-1 text-xs font-bold text-brand-700">{message.senderName}</p>}
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`mt-1 text-[11px] ${message.from === 'me' ? 'text-white/70' : 'text-ink-muted'}`}>{formatTime(message.sentAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex items-center gap-3 border-t border-cream-200 p-3 sm:p-4">
              <label htmlFor="chat-input" className="sr-only">Type a message to your team</label>
              <input id="chat-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message your team…" autoComplete="off" maxLength={2000} className="field h-11" />
              <Button type="submit" icon={Send} disabled={!draft.trim()} aria-label="Send message"><span className="hidden sm:inline">Send</span></Button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
