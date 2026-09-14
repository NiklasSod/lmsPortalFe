import { apiFetch } from '../utils/apifetch'
import type {
  ModuleResource,
  CreateResourceRequest,
  UpdateResourceRequest,
} from '../types/resource'

export function formatResourceTitle(res: ModuleResource): string {
  let raw = res.name || res.title || res.resourceName || ''

  if (!raw.trim() && res.url?.trim()) {
    try {
      const urlObj = new URL(res.url)
      const pathSegments = urlObj.pathname.split('/').filter(Boolean)
      raw = pathSegments[pathSegments.length - 1] || urlObj.hostname
    } catch {
      raw = res.url
    }
  }

  if (!raw.trim()) return 'Untitled Resource'

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const urlObj = new URL(raw)
      const pathSegments = urlObj.pathname.split('/').filter(Boolean)
      raw = pathSegments[pathSegments.length - 1] || urlObj.hostname
    } catch {
      // ignore
    }
  }

  // Remove common file extensions
  raw = raw.replace(/\.(pdf|docx?|pptx?|xlsx?|txt|png|jpe?g|svg|zip)$/i, '')

  // Replace underscores and dashes with spaces
  raw = raw.replace(/[-_]+/g, ' ')

  // Capitalize words if lowercased
  if (raw === raw.toLowerCase()) {
    raw = raw.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return raw.trim() || 'Resource'
}

export async function getCourseResources(
  courseId: number,
): Promise<ModuleResource[]> {
  let apiRes: ModuleResource[] = []
  try {
    const res = await apiFetch(`/api/courses/${courseId}/resources`)
    if (res.ok) {
      apiRes = await res.json()
    }
  } catch {
    // Ignore
  }

  const local = localStorage.getItem(`resources_course_${courseId}`)
  const localRes: ModuleResource[] = local ? JSON.parse(local) : []

  const merged = new Map<number, ModuleResource>()
  apiRes.forEach((r) => merged.set(r.id, r))
  localRes.forEach((r) => merged.set(r.id, r))
  return Array.from(merged.values())
}

export async function getActivityResources(
  activityId: number,
): Promise<ModuleResource[]> {
  let apiRes: ModuleResource[] = []
  try {
    const res = await apiFetch(`/api/activities/${activityId}/resources`)
    if (res.ok) {
      apiRes = await res.json()
    }
  } catch {
    // Ignore
  }

  const local = localStorage.getItem(`resources_activity_${activityId}`)
  const localRes: ModuleResource[] = local ? JSON.parse(local) : []

  const merged = new Map<number, ModuleResource>()
  apiRes.forEach((r) => merged.set(r.id, r))
  localRes.forEach((r) => merged.set(r.id, r))
  return Array.from(merged.values())
}

export async function getModuleResources(
  moduleId: number,
): Promise<ModuleResource[]> {
  let apiRes: ModuleResource[] = []
  try {
    const res = await apiFetch(`/api/modules/${moduleId}/resources`)
    if (res.ok) {
      apiRes = await res.json()
    }
  } catch {
    // Ignore
  }

  const local = localStorage.getItem(`resources_module_${moduleId}`)
  const localRes: ModuleResource[] = local ? JSON.parse(local) : []

  const merged = new Map<number, ModuleResource>()
  apiRes.forEach((r) => merged.set(r.id, r))
  localRes.forEach((r) => merged.set(r.id, r))
  return Array.from(merged.values())
}

export async function createResource(
  request: CreateResourceRequest,
  currentUserId?: string | null,
): Promise<ModuleResource> {
  try {
    const res = await apiFetch(`/api/modules/${request.moduleId}/resources`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Fallback to local storage if API is not live
  }

  const localStr = localStorage.getItem(`resources_module_${request.moduleId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const newRes: ModuleResource = {
    id: Date.now(),
    moduleId: request.moduleId,
    name: request.name,
    description: request.description,
    url: request.url,
    createdById: currentUserId || 'current-student-id',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(
    `resources_module_${request.moduleId}`,
    JSON.stringify([...existing, newRes]),
  )
  return newRes
}

export async function updateResource(
  id: number,
  moduleId: number,
  request: UpdateResourceRequest,
): Promise<ModuleResource> {
  try {
    const res = await apiFetch(`/api/resources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (res.ok) {
      return await res.json()
    }
    throw new Error(`API error ${res.status}`)
  } catch {
    // Fallback to local storage
  }

  const localStr = localStorage.getItem(`resources_module_${moduleId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const foundIdx = existing.findIndex((r) => r.id === id)

  let updatedRes: ModuleResource
  if (foundIdx >= 0) {
    existing[foundIdx] = { ...existing[foundIdx], ...request }
    updatedRes = existing[foundIdx]
  } else {
    updatedRes = {
      id,
      moduleId,
      name: request.name || 'Resource',
      description: request.description,
      url: request.url,
      createdById: 'current-student-id',
      createdAt: new Date().toISOString(),
    }
    existing.push(updatedRes)
  }

  localStorage.setItem(
    `resources_module_${moduleId}`,
    JSON.stringify(existing),
  )
  return updatedRes
}

export async function deleteResource(
  id: number,
  moduleId: number,
): Promise<void> {
  try {
    const res = await apiFetch(`/api/resources/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) return
    throw new Error(`API error ${res.status}`)
  } catch {
    // Fallback
  }

  const localStr = localStorage.getItem(`resources_module_${moduleId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const updatedList = existing.filter((r) => r.id !== id)
  localStorage.setItem(
    `resources_module_${moduleId}`,
    JSON.stringify(updatedList),
  )
}

export async function createCourseResource(
  courseId: number,
  request: UpdateResourceRequest,
  currentUserId?: string | null,
): Promise<ModuleResource> {
  try {
    const res = await apiFetch(`/api/courses/${courseId}/resources`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Fallback
  }

  const localStr = localStorage.getItem(`resources_course_${courseId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const newRes: ModuleResource = {
    id: Date.now(),
    courseId,
    name: request.name,
    description: request.description,
    url: request.url,
    createdById: currentUserId || 'current-student-id',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(
    `resources_course_${courseId}`,
    JSON.stringify([...existing, newRes]),
  )
  return newRes
}

export async function updateCourseResource(
  id: number,
  courseId: number,
  request: UpdateResourceRequest,
): Promise<ModuleResource> {
  try {
    const res = await apiFetch(`/api/resources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (res.ok) {
      return await res.json()
    }
    throw new Error(`API error ${res.status}`)
  } catch {
    // Fallback
  }

  const localStr = localStorage.getItem(`resources_course_${courseId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const foundIdx = existing.findIndex((r) => r.id === id)

  let updatedRes: ModuleResource
  if (foundIdx >= 0) {
    existing[foundIdx] = { ...existing[foundIdx], ...request }
    updatedRes = existing[foundIdx]
  } else {
    updatedRes = {
      id,
      courseId,
      name: request.name || 'Resource',
      description: request.description,
      url: request.url,
      createdById: 'current-student-id',
      createdAt: new Date().toISOString(),
    }
    existing.push(updatedRes)
  }

  localStorage.setItem(
    `resources_course_${courseId}`,
    JSON.stringify(existing),
  )
  return updatedRes
}

export async function deleteCourseResource(
  id: number,
  courseId: number,
): Promise<void> {
  try {
    const res = await apiFetch(`/api/resources/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) return
    throw new Error(`API error ${res.status}`)
  } catch {
    // Fallback
  }

  const localStr = localStorage.getItem(`resources_course_${courseId}`)
  const existing: ModuleResource[] = localStr ? JSON.parse(localStr) : []
  const updatedList = existing.filter((r) => r.id !== id)
  localStorage.setItem(
    `resources_course_${courseId}`,
    JSON.stringify(updatedList),
  )
}
