import { apiFetch } from '../utils/apifetch'
import type {
  CourseModule,
  CreateModuleRequest,
  UpdateModuleRequest,
} from '../types/module'

export async function getCurrentModules(): Promise<CourseModule[]> {
  const res = await apiFetch('/api/modules/current')

  if (!res.ok) {
    throw new Error(
      `Failed to fetch current modules: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getMineModules(): Promise<CourseModule[]> {
  const res = await apiFetch('/api/modules/mine')

  if (!res.ok) {
    throw new Error(`Failed to fetch modules: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function getModulesByCourse(
  courseId: number,
): Promise<CourseModule[]> {
  const res = await apiFetch(`/api/courses/${courseId}/modules`)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch course modules: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function deleteModule(id: number): Promise<void> {
  const res = await apiFetch(`/api/modules/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to delete module: ${res.status}`)
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
    let errorMessage = 'Could not add module.'
    const text = await res.text()
    if (text) {
      try {
        const data = JSON.parse(text)
        if (typeof data === 'string') errorMessage = data
        else if (data?.message) errorMessage = data.message
        else if (data?.title) errorMessage = data.title
      } catch {
        errorMessage = text
      }
    }
    throw new Error(errorMessage)
  }

  return res.json()
}

// TODO NIK - add updateModule
export async function updateModule(
  id: number,
  request: UpdateModuleRequest,
): Promise<CourseModule> {
  const res = await apiFetch(`/api/modules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    let errorMessage = 'Could not update module.'
    const text = await res.text()
    if (text) {
      try {
        const data = JSON.parse(text)
        if (typeof data === 'string') errorMessage = data
        else if (data?.message) errorMessage = data.message
        else if (data?.title) errorMessage = data.title
      } catch {
        errorMessage = text
      }
    }
    throw new Error(errorMessage)
  }

  return res.json()
}
