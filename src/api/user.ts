import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  email: string
}

export interface UserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export async function getUser(userId: string): Promise<UserDto> {
  const res = await apiFetch(`/api/users/${userId}`)

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not fetch user: ${res.status}`),
    )
  }

  return res.json()
}

export async function updateUser(
  userId: string,
  request: UpdateUserRequest,
): Promise<void> {
  const res = await apiFetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not update user: ${res.status}`),
    )
  }
}
