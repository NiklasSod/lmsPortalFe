export interface Submission {
  id: number
  assignmentId: number
  studentId: string
  content: string
  feedback: string
  handinDate: string
  gradedAt?: string
  status: string
}

export interface CreateSubmissionRequest {
  assignmentId: number
  content: string
}

export interface UpdateSubmissionRequest {
  feedback?: string
  status?: string
}
