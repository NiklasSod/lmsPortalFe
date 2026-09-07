import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'

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
    throw new Error(
      await parseApiError(res, `Could not update user: ${res.status}`),
    )
  }
}
