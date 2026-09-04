import { useMemo, useState, type ReactNode } from 'react'
import {
  getEmail,
  getFullName,
  getRole,
  getSession,
  getUserId,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../api/auth'
import type { AuthResponse } from '../types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  // The token is the single source of truth. We keep it in state so that
  // login/logout trigger a re-render, and derive the rest below.
  const [session, setSession] = useState<AuthResponse | null>(() =>
    getSession(),
  )

  const value = useMemo<AuthContextValue>(() => {
    const token = session?.accessToken ?? null

    return {
      isLoggedIn: token !== null,
      role: token ? getRole() : null,
      fullName: token ? getFullName() : null,
      email: token ? getEmail() : null,
      userId: token ? getUserId() : null,
      login: async (email, password) => {
        const data = await loginRequest(email, password)
        setSession(data)
        return data
      },
      register: async (request) => {
        const data = await registerRequest(request)
        setSession(data)
        return data
      },
      logout: async () => {
        await logoutRequest()
        setSession(null)
      },
    }
  }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
