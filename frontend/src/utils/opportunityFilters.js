// Filtering and sorting for the Discover board.
// When you add a backend, this logic can move to the server (GET /api/opportunities?q=...&category=...).
export function filterOpportunities(list, { q = '', category = 'All', mode = 'All', commitment = 'All' }) {
  const term = q.trim().toLowerCase()
  return list.filter((o) => {
    if (category !== 'All' && o.category !== category) return false
    if (mode !== 'All' && o.mode !== mode) return false
    if (commitment !== 'All' && o.commitment !== commitment) return false
    if (term) {
      const haystack = [o.title, o.description, ...o.requiredSkills, ...o.niceToHaveSkills].join(' ').toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
}

export function sortOpportunities(list, sort) {
  const copy = [...list]
  if (sort === 'popular') copy.sort((a, b) => b.interestedCount - a.interestedCount)
  else copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return copy
}
