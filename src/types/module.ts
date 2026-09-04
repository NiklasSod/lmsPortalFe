export interface CreateModuleRequest {
  name: string
  description?: string
  startDate: string
  endDate: string
  courseId: number
}

// TODO NIK - add UpdateModuleRequest
export interface CourseModule {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
}
