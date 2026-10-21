import Modal from './Modal'
import Button from './Button'

// Used before anything destructive. The parent keeps a "confirm" object in state and renders this when it is set.
export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel }) {
  return (
    <Modal title={title} description={message} onClose={onCancel}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>Keep it</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onCancel() }}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
