import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'
import type {
  CourseSummary,
  CourseDetail,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/course'

export async function getCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses')
  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to fetch courses: ${res.status}`),
    )
  }
  return res.json()
}

export async function getMyCourses(): Promise<CourseSummary[]> {
  const res = await apiFetch('/api/courses/mine')
  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to fetch your courses: ${res.status}`),
    )
  }
  return res.json()
}

export async function getCourseById(id: string): Promise<CourseDetail> {
  const res = await apiFetch(`/api/courses/${id}`)
  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to fetch course: ${res.status}`),
    )
  }
  return res.json()
}

export async function enrollInCourse(courseId: number): Promise<void> {
  const res = await apiFetch('/api/courses/enroll', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not enroll in course.'))
  }
}

export async function createCourse(
  request: CreateCourseRequest,
): Promise<CourseSummary> {
  const res = await apiFetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not create course.'))
  }

  return res.json()
}

export async function updateCourse(
  id: string | number,
  request: UpdateCourseRequest,
): Promise<CourseSummary> {
  const res = await apiFetch(`/api/courses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not update course.'))
  }

  return res.json()
}

export async function deleteCourse(id: string | number): Promise<void> {
  const res = await apiFetch(`/api/courses/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not delete course.'))
  }
}
