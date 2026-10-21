export const categoryTone = (category) =>
  ({ Hackathon: 'violet', Project: 'sky', Club: 'emerald', Other: 'amber' })[category] || 'slate'

export const statusTone = (status) =>
  ({ Planning: 'amber', Active: 'emerald', Shipped: 'violet' })[status] || 'slate'

export const externalUrl = (value = '') => (/^https?:\/\//.test(value) ? value : `https://${value}`)
