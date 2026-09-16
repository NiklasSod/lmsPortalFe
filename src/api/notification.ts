import { apiFetch } from '../utils/apiFetch'

export type UserNotification = {
  id: number
  userId: string
  notificationId: number
  isSeen: boolean
  seenAt: string | null
  notification: {
    id: number
    title: string
    message: string
    type?: string
    createdAt: string
  }
}

// Fetches user notifications with optional unread filter
export async function getMyNotifications(unreadOnly = true): Promise<UserNotification[]> {
  const response = await apiFetch(`/api/notifications?unreadOnly=${unreadOnly}`)
  if (!response.ok) {
    throw new Error('Failed to fetch notifications.')
  }
  return response.json()
}

// Marks a specific notification as seen in the backend
export async function markNotificationAsSeen(id: number): Promise<void> {
  const response = await apiFetch(`/api/notifications/${id}/seen`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to mark notification as seen.')
  }
}