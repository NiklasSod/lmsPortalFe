import { apiFetch } from '../utils/apifetch'
import { parseApiError, toApiError } from '../utils/apiError'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from '../types/activity'

export async function getMineActivities(): Promise<Activity[]> {
  const res = await apiFetch('/api/activities/mine')

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch your activities: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getAllActivities(): Promise<Activity[]> {
  const res = await apiFetch('/api/activities')

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch activities: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getActivityById(id: number): Promise<Activity> {
  const res = await apiFetch(`/api/activities/${id}`)

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch activity: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getModuleActivities(moduleId: number): Promise<Activity[]> {
  const res = await apiFetch(`/api/modules/${moduleId}/activities`)

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch module activities: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function createActivity(
  request: CreateActivityRequest,
): Promise<Activity> {
  const res = await apiFetch('/api/activities', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not create activity.'))
  }
  return res.json()
}

export async function updateActivity(
  id: number,
  request: UpdateActivityRequest,
): Promise<Activity> {
  const res = await apiFetch(`/api/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not update activity.'))
  }
  return res.json()
}

export async function deleteActivity(id: number): Promise<void> {
  const res = await apiFetch(`/api/activities/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to delete activity: ${res.status}`),
    )
  }
}
