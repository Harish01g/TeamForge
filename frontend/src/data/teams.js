import { daysFromNow } from '../utils/format'

export const sampleTeams = [
  {
    id: 'team-1', name: 'Campus Navigator', status: 'Active', myRole: 'Frontend developer',
    description: 'An indoor map and search tool that helps first-year students find classrooms, labs, and offices.',
    members: [
      { id: 'u1', name: 'Ananya Rao', role: 'Frontend developer' },
      { id: 'u3', name: 'Priya Nair', role: 'Backend developer' },
      { id: 'u6', name: 'Arjun Reddy', role: 'Mobile developer' },
      { id: 'u5', name: 'Sneha Iyer', role: 'Product designer' },
    ],
    milestones: [
      { id: 'm1', title: 'Finalise wireframes', due: daysFromNow(-12), done: true },
      { id: 'm2', title: 'Build the interactive map component', due: daysFromNow(-3), done: true },
      { id: 'm3', title: 'Add room search and filters', due: daysFromNow(6), done: false },
      { id: 'm4', title: 'Run usability tests with 10 freshers', due: daysFromNow(14), done: false },
    ],
    resources: [
      { id: 'r1', label: 'Design files', type: 'Figma', url: 'https://www.figma.com' },
      { id: 'r2', label: 'Source code', type: 'GitHub', url: 'https://github.com' },
      { id: 'r3', label: 'Team notes', type: 'Notion', url: 'https://www.notion.so' },
    ],
  },
  {
    id: 'team-2', name: 'EcoTrack Squad', status: 'Planning', myRole: 'Team lead',
    description: 'Preparing a carbon-footprint tracker for the upcoming Smart Campus Hackathon.',
    members: [
      { id: 'u1', name: 'Ananya Rao', role: 'Team lead' },
      { id: 'u8', name: 'Dev Patel', role: 'Data and hardware' },
      { id: 'u7', name: 'Meera Joshi', role: 'Pitch and research' },
    ],
    milestones: [
      { id: 'm1', title: 'Pick the problem statement', due: daysFromNow(-1), done: true },
      { id: 'm2', title: 'Sketch the user flow', due: daysFromNow(2), done: false },
      { id: 'm3', title: 'Assign hackathon roles', due: daysFromNow(5), done: false },
    ],
    resources: [
      { id: 'r1', label: 'Hackathon rules', type: 'Devpost', url: 'https://devpost.com' },
      { id: 'r2', label: 'Brainstorm board', type: 'Miro', url: 'https://miro.com' },
    ],
  },
  {
    id: 'team-3', name: 'Photography Club Website', status: 'Shipped', myRole: 'Developer',
    description: 'A portfolio site for the photography club with event galleries and a sign-up form.',
    members: [
      { id: 'u1', name: 'Ananya Rao', role: 'Developer' },
      { id: 'u5', name: 'Sneha Iyer', role: 'Designer' },
    ],
    milestones: [
      { id: 'm1', title: 'Design the gallery layout', due: daysFromNow(-40), done: true },
      { id: 'm2', title: 'Build and deploy the site', due: daysFromNow(-25), done: true },
    ],
    resources: [{ id: 'r1', label: 'Site repository', type: 'GitHub', url: 'https://github.com' }],
  },
]
