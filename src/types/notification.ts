export type UserNotification = {
  id: number
  type: string
  title: string
  body: string
  courseId: number | null
  moduleId: number | null
  activityId: number | null
  resourceId: number | null
  submissionId: number | null
  createdAt: string
  isSeen: boolean
  seenAt: string | null
}