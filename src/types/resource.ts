export interface Resource {
  id: number
  creatorId: string
  displayName: string
  url: string
  isStudentSubmitted: boolean
  lastEditDate: string
  uploadDate: string
  courseId: number | null
  activityId: number | null
  moduleId: number | null
}

export interface CreateResourceRequest {
  displayName: string
  url: string
  courseId?: number
  activityId?: number
  moduleId?: number
}

export interface UpdateResourceRequest {
  displayName?: string
  url?: string
}
