export interface ModuleResource {
  id: number
  moduleId?: number
  courseId?: number
  name?: string
  title?: string
  resourceName?: string
  description?: string
  url?: string
  createdById?: string
  createdByName?: string
  createdAt?: string
}

export interface CreateResourceRequest {
  moduleId: number
  name: string
  description?: string
  url?: string
}

export interface UpdateResourceRequest {
  name?: string
  description?: string
  url?: string
}
