import type { Student } from './student'

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

export interface Course {
  id: string | number
  name: string
  description: string
  startDate: string
  endDate: string
  students?: Student[]
}

export interface CourseDetail extends CourseSummary {
  enrollments: CourseEnrollment[]
}
