export function profileCompleteness(p) {
  const checks = [
    { label: 'Add your name', done: !!p.name?.trim() },
    { label: 'Add your major', done: !!p.major?.trim() },
    { label: 'Write a short bio (20+ characters)', done: (p.bio?.trim().length || 0) >= 20 },
    { label: 'List at least 3 skills', done: p.skills.length >= 3 },
    { label: 'Add an interest', done: p.interests.length >= 1 },
    { label: 'Share your availability', done: !!p.availability?.trim() },
    { label: 'Add a GitHub link', done: !!p.github?.trim() },
    { label: 'Add a portfolio link', done: !!p.portfolio?.trim() },
    { label: 'Add a completed project', done: p.completedProjects.length >= 1 },
  ]
  const done = checks.filter((c) => c.done).length
  return { percent: Math.round((done / checks.length) * 100), checks }
}
