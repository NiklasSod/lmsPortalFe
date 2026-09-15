import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'
import type {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
} from '../types/resource'

async function readJson<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) {
    throw new Error(await parseApiError(res, fallback))
  }
  return res.json()
}

export async function getCourseResources(
  courseId: number,
): Promise<Resource[]> {
  const res = await apiFetch(`/api/courses/${courseId}/resources`)
  return readJson(res, `Failed to fetch course resources: ${res.status}`)
}

export async function getModuleResources(
  moduleId: number,
): Promise<Resource[]> {
  const res = await apiFetch(`/api/modules/${moduleId}/resources`)
  return readJson(res, `Failed to fetch module resources: ${res.status}`)
}

export async function getModuleStudentResources(
  moduleId: number,
): Promise<Resource[]> {
  const res = await apiFetch(`/api/modules/${moduleId}/student-resources`)
  return readJson(res, `Failed to fetch student resources: ${res.status}`)
}

export async function getActivityResources(
  activityId: number,
): Promise<Resource[]> {
  const res = await apiFetch(`/api/activity/${activityId}/resources`)
  return readJson(res, `Failed to fetch activity resources: ${res.status}`)
}

export async function createResource(
  request: CreateResourceRequest,
): Promise<Resource> {
  const res = await apiFetch('/api/resources', {
    method: 'POST',
    body: JSON.stringify(request),
  })
  return readJson(res, 'Could not add resource.')
}

export async function updateResource(
  id: number,
  request: UpdateResourceRequest,
): Promise<Resource> {
  const res = await apiFetch(`/api/resources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })
  return readJson(res, 'Could not update resource.')
}

export async function deleteResource(id: number): Promise<void> {
  const res = await apiFetch(`/api/resources/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not delete resource.'))
  }
}
