export const nextMilestone = (team) => team.milestones.find((m) => !m.done) || null
export const milestoneProgress = (team) =>
  team.milestones.length ? Math.round((team.milestones.filter((m) => m.done).length / team.milestones.length) * 100) : 0
