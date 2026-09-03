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
  if (!getAccessToken()) return null

  if (isExpiredOrExpiringSoon()) {
    try {
      await refresh()
    } catch {
      return null
    }
  }

  return getAccessToken()
}
