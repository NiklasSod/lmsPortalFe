import { apiFetch } from '../utils/apifetch'
import type {
  CourseSummary,
  CourseDetail,
  CreateCourseRequest,
} from '../types/course'

export async function getCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses')
  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`)
  }
  return res.json()
}

export async function getMyCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses/mine')
  if (!res.ok) {
    throw new Error(`Failed to fetch your courses: ${res.status}`)
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
export async function createCourse(
  request: CreateCourseRequest,
): Promise<CourseSummary> {
  const res = await apiFetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    let errorMessage = 'Could not create course.'
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
