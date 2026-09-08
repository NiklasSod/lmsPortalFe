import { getAccessToken, getExpiresAt, refresh } from '../api/auth'

const REFRESH_THRESHOLD = 60 * 1000

export function isExpiredOrExpiringSoon(): boolean {
  const expiresAt = getExpiresAt()
  if (!expiresAt) return true

  const expireTime = Date.parse(expiresAt)
  if (Number.isNaN(expireTime)) return true

  return Date.now() >= expireTime - REFRESH_THRESHOLD
}

export async function getValidAccessToken(): Promise<string | null> {
  const token = getAccessToken()

  // We already have a token that is valid for a while — use it as is.
  if (token && !isExpiredOrExpiringSoon()) {
    return token
  }

  // No token (fresh page load) or a token that expires soon. Try to refresh.
  // This also restores the session when only the refresh_token cookie exists.
  try {
    await refresh()
    return getAccessToken()
  } catch {
    return null
  }
}
