import { hoursAgo } from '../utils/format'

export const sampleNotifications = [
  { id: 'n-1', type: 'match', title: 'New match: Smart Campus Hackathon 2026', body: 'Your React and UI skills fit this team.', link: '/opportunities/opp-1', read: false, createdAt: hoursAgo(1) },
  { id: 'n-2', type: 'request', title: 'Your join request is being reviewed', body: 'Campus Eats: Food Waste Tracker has your request.', link: '/opportunities/opp-4', read: false, createdAt: hoursAgo(5) },
  { id: 'n-3', type: 'deadline', title: 'Deadline in 3 days', body: 'Design Sprint: Student Wellbeing App closes soon.', link: '/opportunities/opp-6', read: false, createdAt: hoursAgo(8) },
  { id: 'n-4', type: 'match', title: 'New match: AI Study Buddy', body: 'They are looking for people who like building with Python.', link: '/opportunities/opp-2', read: true, createdAt: hoursAgo(30) },
  { id: 'n-5', type: 'request', title: 'You joined Campus Navigator', body: 'Priya accepted your request. Say hello to the team.', link: '/teams/team-1', read: true, createdAt: hoursAgo(90) },
]
