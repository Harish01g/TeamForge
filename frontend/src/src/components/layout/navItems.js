import { Compass, Users, Bookmark, MessageCircle, User } from 'lucide-react'

// Edit this list to add or rename sidebar and mobile navigation links.
export const navItems = [
  { to: '/', label: 'Discover', icon: Compass, end: true },
  { to: '/teams', label: 'My Teams', icon: Users },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profile', label: 'My Profile', icon: User },
]
