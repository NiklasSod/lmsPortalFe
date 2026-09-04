import { apiFetch } from '../utils/apifetch'

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  email: string
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
    const text = await res.text()
    throw new Error(text || `Could not update user: ${res.status}`)
  }
}
