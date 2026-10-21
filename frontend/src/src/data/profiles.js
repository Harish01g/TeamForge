// The signed-in demo student, and the other students who post opportunities.
export const currentStudent = {
  id: 'u1',
  name: 'Ananya Rao',
  year: '3rd year',
  major: 'Computer Science & Engineering',
  bio: 'I like turning rough ideas into clean, usable interfaces. Looking for hackathon teams and product-minded side projects.',
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'Figma', 'Git'],
  interests: ['Hackathons', 'EdTech', 'Open source', 'Accessibility'],
  availability: 'Weekday evenings and weekends, about 10 hours a week',
  github: 'github.com/ananya-rao',
  portfolio: '',
  completedProjects: [
    { id: 'cp-1', title: 'Notes Swap', role: 'Frontend lead', year: '2025', summary: 'A campus marketplace for sharing class notes, used by 300+ students.' },
    { id: 'cp-2', title: 'Bus Tracker UI', role: 'UI developer', year: '2025', summary: 'Mobile-first live bus timings for the college shuttle.' },
    { id: 'cp-3', title: 'Green Hack 2025', role: 'Team member', year: '2025', summary: 'Finalist. Built a carbon footprint calculator in 24 hours.' },
  ],
}

export const people = {
  rohan: { id: 'u2', name: 'Rohan Mehta', year: '4th year', major: 'Electronics & Communication', bio: 'Hackathon organiser. Runs the campus innovation cell and loves a good demo day.' },
  priya: { id: 'u3', name: 'Priya Nair', year: '2nd year', major: 'Information Technology', bio: 'Backend and ML tinkerer. Always building something with Python at midnight.' },
  kabir: { id: 'u4', name: 'Kabir Sharma', year: '3rd year', major: 'Mechanical Engineering', bio: 'Captain of the robotics club. Believes every problem can be solved with another sensor.' },
  sneha: { id: 'u5', name: 'Sneha Iyer', year: '4th year', major: 'Design (B.Des)', bio: 'Product designer focused on wellbeing and inclusive design.' },
  arjun: { id: 'u6', name: 'Arjun Reddy', year: '2nd year', major: 'Computer Science', bio: 'Mobile developer. Ships small apps and learns by doing.' },
  meera: { id: 'u7', name: 'Meera Joshi', year: '3rd year', major: 'Management Studies', bio: 'Entrepreneurship club lead. Pitches for fun.' },
  dev: { id: 'u8', name: 'Dev Patel', year: '3rd year', major: 'Agricultural Engineering', bio: 'Bridging farms and firmware. Hardware first, always.' },
}
