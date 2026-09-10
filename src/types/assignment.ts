export interface Assignment {
  id: number
  moduleId: number
  name: string
  description: string
  dueDate: string
  latestSubmissionId: number | null
  latestSubmissionStatus: string | null
  latestFeedback: string
}

export interface CreateAssignmentRequest {
  moduleId: number
  name: string
  description: string
  dueDate: string
}

export interface UpdateAssignmentRequest {
  moduleId?: number
  name?: string
  description?: string
  dueDate?: string
}

