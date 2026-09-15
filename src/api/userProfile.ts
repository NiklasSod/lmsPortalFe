import { apiFetch } from '../utils/apifetch'
import { parseApiError, toApiError } from '../utils/apiError'
import type { CreateProfileRequest, ProfileRequest } from '../types/userProfile'

export async function getProfile(userId: string): Promise<ProfileRequest> {
  const res = await apiFetch(`/api/profiles/${userId}`)
  if (!res.ok) {
    throw await toApiError(res, `Failed to fetch profile: ${res.status}`)
  }
  return res.json()
}

export async function createProfile(
  request: CreateProfileRequest,
): Promise<ProfileRequest> {
  const res = await apiFetch('/api/profiles', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not create profile.'))
  }

  return res.json()
}
