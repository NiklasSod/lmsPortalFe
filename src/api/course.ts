import { apiFetch } from '../utils/apifetch'
import type { CourseSummary } from '../types/course'

export async function getTeacherCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses')
  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`)
  }
  return res.json()
}
