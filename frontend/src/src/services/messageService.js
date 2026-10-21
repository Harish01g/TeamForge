import { sampleConversations } from '../data/messages'
import { wait, copy } from './delay'

// DEMO ONLY: messages stay in this browser tab. They are never sent to anyone.
// FUTURE: GET /api/conversations, POST /api/conversations/:id/messages (plus WebSockets for live chat)
let store = copy(sampleConversations)

export async function getConversations() {
  await wait(300)
  return copy(store)
}

export async function sendMessage(conversationId, text) {
  await wait(150)
  const message = { id: `msg-${Date.now()}`, from: 'me', text: text.trim(), sentAt: new Date().toISOString() }
  store = store.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c))
  return copy(store.find((c) => c.id === conversationId))
}

export async function markConversationRead(conversationId) {
  store = store.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
  return copy(store.find((c) => c.id === conversationId))
}
