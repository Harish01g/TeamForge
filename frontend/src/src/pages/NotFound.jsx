import { Compass } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function NotFound() {
  return <EmptyState icon={Compass} title="This page does not exist" description="The link may be old or mistyped. Head back to Discover to keep exploring." action={<Button to="/">Back to Discover</Button>} />
}
