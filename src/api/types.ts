export interface AuthResponse {
  accessToken: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

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

export interface CourseDetail extends CourseSummary {
  enrollments: CourseEnrollment[]
}
