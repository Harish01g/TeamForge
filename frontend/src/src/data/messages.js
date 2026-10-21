import { hoursAgo } from '../utils/format'

export const sampleConversations = [
  {
    id: 'c-1', name: 'Priya Nair', context: 'Campus Navigator team', unread: 0,
    messages: [
      { id: 'a1', from: 'them', text: 'The search API is ready for you to plug into the map.', sentAt: hoursAgo(1.2) },
      { id: 'a2', from: 'me', text: 'Great, I will wire it up tonight and send a preview.', sentAt: hoursAgo(0.5) },
    ],
  },
  {
    id: 'c-2', name: 'Rohan Mehta', context: 'Smart Campus Hackathon 2026', unread: 2,
    messages: [
      { id: 'b1', from: 'me', text: 'Hi Rohan, I am interested in the frontend spot for the hackathon.', sentAt: hoursAgo(6) },
      { id: 'b2', from: 'them', text: 'Hi Ananya! Your Notes Swap project looks great.', sentAt: hoursAgo(2.5) },
      { id: 'b3', from: 'them', text: 'Can you join a quick call on Thursday to meet the team?', sentAt: hoursAgo(2.4) },
    ],
  },
  {
    id: 'c-3', name: 'Sneha Iyer', context: 'Design Sprint: Student Wellbeing App', unread: 1,
    messages: [
      { id: 'd1', from: 'them', text: 'We still need one person who can build clickable prototypes. Interested?', sentAt: hoursAgo(5) },
    ],
  },
  {
    id: 'c-4', name: 'Kabir Sharma', context: 'Robotics Club', unread: 0,
    messages: [
      { id: 'e1', from: 'them', text: 'Workshop notes are in the shared folder.', sentAt: hoursAgo(30) },
      { id: 'e2', from: 'me', text: 'Thanks Kabir, I will go through them this weekend.', sentAt: hoursAgo(29) },
    ],
  },
]
