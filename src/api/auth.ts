import type { AuthResponse, LoginRequest } from './types'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password } satisfies LoginRequest),
    credentials: 'include',
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Login failed: ${res.status}`)
  }

  const data: AuthResponse = await res.json()
  accessToken = data.accessToken
  return data
}

export async function refresh(): Promise<string> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Refresh failed')

  const data: AuthResponse = await res.json()
  accessToken = data.accessToken
  return accessToken
}

export async function logout(): Promise<void> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Logout failed: ${res.status}`)
  }
  accessToken = null
}
