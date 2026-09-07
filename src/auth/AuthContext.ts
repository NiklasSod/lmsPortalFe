import { createContext, useContext } from 'react'
import type { AuthResponse, RegisterRequest } from '../types/auth'

export interface AuthContextValue {
  /** True when an access token exists in the session. */
  isLoggedIn: boolean
  role: string | null
  fullName: string | null
  email: string | null
  userId: string | null
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (request: RegisterRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>.')
  }
  return context
}
