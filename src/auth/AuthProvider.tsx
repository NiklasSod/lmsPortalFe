import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  getEmail,
  getFullName,
  getRole,
  getSession,
  getUserId,
  login as loginRequest,
  logout as logoutRequest,
  refresh,
  register as registerRequest,
} from '../api/auth'
import type { AuthResponse } from '../types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    getSession(),
  )
  const [isRestoring, setIsRestoring] = useState(() => session === null)
  const needsRefresh = useRef(session === null)

  useEffect(() => {
    let cancelled = false

    if (!needsRefresh.current) {
      return
    }

    refresh()
      .then((data) => {
        if (!cancelled) setSession(data)
      })
      .catch(() => {
        // No valid refresh token — the user stays logged out.
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const token = session?.accessToken ?? null

    return {
      isLoggedIn: token !== null,
      isRestoring,
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
  }, [session, isRestoring])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
