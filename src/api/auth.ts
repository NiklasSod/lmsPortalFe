import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

const ACCESS_TOKEN = 'accessToken'
const EXPIRES_AT = 'expiresAt'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN)
}

export function getExpiresAt(): string | null {
  return sessionStorage.getItem(EXPIRES_AT)
}

export function getRole(): string | null {
  const token = getAccessToken()
  if (!token) return null

  return extractRole(token)
}

export function getFullName(): string | null {
  const token = getAccessToken()
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const firstName = payload['given_name']
  const lastName = payload['family_name']

  if (typeof firstName === 'string' && typeof lastName === 'string') {
    return `${firstName} ${lastName}`.trim()
  }

  return null
}

export function getEmail(): string | null {
  const token = getAccessToken()
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const keys = [
    'email',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  ]
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' && value) return value
  }

  return null
}

export function getUserId(): string | null {
  const token = getAccessToken()
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const keys = [
    'sub',
    'nameid',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  ]
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' && value) return value
  }

  return null
}

const ROLE_CLAIM_KEYS = [
  'role',
  'roles',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
]

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )

    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function extractRole(token: string): string | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  for (const key of ROLE_CLAIM_KEYS) {
    const value = payload[key]
    if (typeof value === 'string' && value) return value
    if (Array.isArray(value)) {
      const role = value.find((item) => typeof item === 'string')
      if (role) return role
    }
  }

  return null
}

export function getSession(): AuthResponse | null {
  const accessToken = getAccessToken()
  const expiresAt = getExpiresAt()
  if (!accessToken || !expiresAt) return null

  return { accessToken, expiresAt }
}

function storeSession(data: AuthResponse): void {
  sessionStorage.setItem(ACCESS_TOKEN, data.accessToken)
  sessionStorage.setItem(EXPIRES_AT, data.expiresAt)
}

function clearSession(): void {
  sessionStorage.removeItem(ACCESS_TOKEN)
  sessionStorage.removeItem(EXPIRES_AT)
}

// gives good errors from the backend
async function errorMessage(res: Response, fallback: string): Promise<string> {
  const text = await res.text()
  if (!text) return fallback

  try {
    const data = JSON.parse(text)
    if (typeof data === 'string') return data
    if (data?.message) return String(data.message)
  } catch {
    // body is plain text
  }

  return text
}

export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(await errorMessage(res, 'Could not create account.'))
  }

  const data: AuthResponse = await res.json()
  storeSession(data)
  return data
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
    throw new Error(await errorMessage(res, 'Invalid email or password.'))
  }

  const data: AuthResponse = await res.json()
  storeSession(data)
  return data
}

export async function refresh(): Promise<AuthResponse> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    clearSession()
    throw new Error('Session expired, please log in again.')
  }

  const data: AuthResponse = await res.json()
  storeSession(data)
  return data
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } finally {
    clearSession()
  }
}
