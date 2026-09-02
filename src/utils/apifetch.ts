import { getAccessToken, refresh } from '../api/auth/auth'
import { getValidAccessToken } from './tokenExpiry'

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const doFetch = () => {
    const token = getAccessToken()
    return fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  }

  await getValidAccessToken()

  let res = await doFetch()

  if (res.status === 401) {
    try {
      await refresh()
      res = await doFetch()
    } catch {
      throw new Error('Session expired, please log in again.')
    }
  }

  return res
}
