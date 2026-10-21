import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!authService.getToken()) {
      setLoading(false)
      return () => { active = false }
    }
    authService.getMe()
      .then((profile) => { if (active) setUser(profile) })
      .catch(() => { authService.clearSession(); if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const signIn = useCallback(async (values) => setUser(await authService.login(values)), [])
  const signUp = useCallback(async (values) => setUser(await authService.register(values)), [])
  const signOut = useCallback(() => {
    authService.clearSession()
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
