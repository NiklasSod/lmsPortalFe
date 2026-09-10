import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
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

export async function getUsers(): Promise<UserDto[]> {
  const res = await apiFetch('/api/users/students')

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not fetch users: ${res.status}`),
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

export async function updateAccount(request: UpdateUserRequest): Promise<void> {
  const res = await apiFetch('/api/account', {
    method: 'PUT',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not update account: ${res.status}`),
    )
  }
}

export async function changePassword(
  request: ChangePasswordRequest,
): Promise<void> {
  const res = await apiFetch('/api/account/change-password', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not change password: ${res.status}`),
    )
  }
}

export async function deleteAccount(): Promise<void> {
  const res = await apiFetch('/api/account', {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Could not delete account: ${res.status}`),
    )
  }
}
