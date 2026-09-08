import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'
import type {
  // CreateProfileRequest,
  // UpdateProfileRequest,
  ProfileRequest,
} from '../types/userProfile'

export async function getProfile(userId: string): Promise<ProfileRequest> {
  const res = await apiFetch(`/api/profiles/${userId}`)
  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to fetch courses: ${res.status}`),
    )
  }
  return res.json()
}
