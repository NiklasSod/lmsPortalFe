import type { Student } from './student'
import type { CourseModule } from './module'

export interface CourseSummary {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
}

export interface CourseEnrollment {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface Course extends CourseSummary {
  students?: Student[]
  modules?: CourseModule[]
}

export interface CourseDetail extends CourseSummary {
  enrollments: CourseEnrollment[]
}

export interface CreateCourseRequest {
  name: string
  description?: string
  startDate: string | null
  endDate: string | null
}

