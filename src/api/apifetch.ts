import { getAccessToken, refresh } from './auth'

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const doFetch = () =>
    fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
        ...options.headers,
      },
    })

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
