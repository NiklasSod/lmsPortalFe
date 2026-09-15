import type { SubmissionStatusKind } from '../utils/submissionStatus'

export type Deadline = {
  id: number
  moduleId: number
  assignmentTitle: string
  dueAt: Date
  status: string | null
}

export type FeedbackItem = {
  id: number
  assignmentTitle: string
  feedback: string
  handinDate: Date
  status: SubmissionStatusKind
  hasResubmission: boolean
}
