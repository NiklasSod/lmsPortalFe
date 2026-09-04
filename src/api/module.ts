import { apiFetch } from '../utils/apifetch'
import type { CourseModule } from '../types/module'

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

export async function deleteModule(id: number): Promise<void> {
  const res = await apiFetch(`/api/modules/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to delete module: ${res.status}`)
  }
}

// TODO NIK - add updateModule
// TODO NIK - add addModule
