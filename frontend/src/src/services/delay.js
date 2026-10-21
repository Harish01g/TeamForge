// Pretends the network takes a moment, so loading states are visible.
// Delete this when your services call a real API with fetch().
export const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
export const copy = (value) => structuredClone(value)
