import * as authService from './authService'

export function getProfile() {
  return authService.getMe()
}

export function updateProfile(values) {
  return authService.updateMe(values)
}
