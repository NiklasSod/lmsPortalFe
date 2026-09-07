import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'
import type {
  CourseModule,
  CreateModuleRequest,
  UpdateModuleRequest,
} from '../types/module'

export async function getCurrentModules(): Promise<CourseModule[]> {
  const res = await apiFetch('/api/modules/current')

  if (!res.ok) {
    throw new Error(
      await parseApiError(
        res,
        `Failed to fetch current modules: ${res.status} ${res.statusText}`,
      ),
    )
  }
  return res.json()
}

export async function getMineModules(): Promise<CourseModule[]> {
  const res = await apiFetch('/api/modules/mine')

  if (!res.ok) {
    throw new Error(
      await parseApiError(
        res,
        `Failed to fetch modules: ${res.status} ${res.statusText}`,
      ),
    )
  }
  return res.json()
}

export async function getModulesByCourse(
  courseId: number,
): Promise<CourseModule[]> {
  const res = await apiFetch(`/api/courses/${courseId}/modules`)

  if (!res.ok) {
    throw new Error(
      await parseApiError(
        res,
        `Failed to fetch course modules: ${res.status} ${res.statusText}`,
      ),
    )
  }
  return res.json()
}

export async function deleteModule(id: number): Promise<void> {
  const res = await apiFetch(`/api/modules/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to delete module: ${res.status}`),
    )
  }
}

export async function addModule(
  request: CreateModuleRequest,
): Promise<CourseModule> {
  const res = await apiFetch('/api/modules', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not add module.'))
  }

  return res.json()
}

export async function updateModule(
  id: number,
  request: UpdateModuleRequest,
): Promise<CourseModule> {
  const res = await apiFetch(`/api/modules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not update module.'))
  }

  return res.json()
}
