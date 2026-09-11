export interface Assignment {
  id: number
  moduleId: number
  courseId?: number
  name: string
  description: string
  dueDate: string
  latestSubmissionId: number | null
  latestSubmissionStatus: string | null
  latestFeedback: string
}
