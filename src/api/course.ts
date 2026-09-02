import { apiFetch } from '../utils/apifetch'
import type { CourseSummary, CourseDetail } from '../types/course'

export async function getTeacherCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses')
  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`)
  }
  return res.json()
}

export async function getCourseById(id: string): Promise<CourseDetail> {
  const res = await apiFetch(`/api/courses/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.status}`)
  }
  return res.json()
}
