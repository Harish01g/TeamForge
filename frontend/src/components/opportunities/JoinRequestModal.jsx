import { useState } from 'react'
import { Send, UserRoundCheck } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormField from '../ui/FormField'

export default function JoinRequestModal({ opportunity, onClose, onSubmit }) {
  const [message, setMessage] = useState('') // UI-only draft
  const [sending, setSending] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    await onSubmit(message)
    setSending(false)
  }

  return (
    <Modal title="Request to join" description={opportunity.title} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <FormField as="textarea" label="Message to the team" value={message} maxLength={300} rows={5}
          onChange={(e) => setMessage(e.target.value)} placeholder="Share what you would like to work on and what you can bring."
          hint={`${message.length}/300 characters`} />
        <p className="flex gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-900">
          <UserRoundCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          The opportunity poster can review your message and student profile before deciding.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" icon={Send} disabled={sending}>{sending ? 'Sending…' : 'Send request'}</Button>
        </div>
      </form>
    </Modal>
  )
}
