import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../types/auth'

const ACCESS_TOKEN = 'accessToken'
const EXPIRES_AT = 'expiresAt'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN)
}

export function getExpiresAt(): string | null {
  return sessionStorage.getItem(EXPIRES_AT)
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
