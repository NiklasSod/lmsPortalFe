export interface CreateModuleRequest {
  name: string
  description?: string
  startDate: string
  endDate: string
  courseId: number
}

export interface UpdateModuleRequest {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
}

export interface CourseModule {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
}
