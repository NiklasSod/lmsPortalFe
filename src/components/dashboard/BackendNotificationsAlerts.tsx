import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DomainIcon } from '../../components/DomainIcon'
import type { UserNotification } from '../../types/notification'

interface BackendNotificationsAlertsProps {
  notifications: UserNotification[]
  loading: boolean
  role: string | null
  onDismiss: (id: number) => void
}

const BackendNotificationsAlerts = ({
  notifications,
  loading,
  role,
  onDismiss,
}: BackendNotificationsAlertsProps) => {
  if (role !== 'student' || loading || notifications.length === 0) {
    return null
  }

  const base = role === 'student' ? '/student' : '/teacher'

  const getAlertConfig = (item: UserNotification) => {
    const type = item.type?.toLowerCase() || ''
    const title = (item.title || '').toLowerCase()

    if (type === 'ResourceAdded' || title.includes('resource')) {
      return {
        variant: 'info' as const,
      linkTo: item.courseId ? `${base}/courses/${item.courseId}/resources` : `${base}/courses`,
      linkText: 'View resources \u2192',
      }
    }
    if (type === 'SubmissionApproved' || title.includes('approved')) {
      return {
        variant: 'success' as const,
        linkTo: `${base}/assignments`,
        linkText: 'View assignments \u2192',
      }
    }
    if (type === 'SubmissionReturned' || title.includes('revision')) {
      return {
        variant: 'warning' as const,
        linkTo: `${base}/assignments`,
        linkText: 'View assignments \u2192',
      }
    }
    
    return {
      variant: 'info' as const,
    }
  }

  return (
    <>
      {notifications.map((item) => {
        const config = getAlertConfig(item)
        return (
          <Alert
            key={`notification-${item.id}`}
            variant={config.variant}
            dismissible
            onClose={() => onDismiss(item.id)}
          >
            <div className="d-flex align-items-start gap-3">
              <DomainIcon
                type={item.type}
                className="flex-shrink-0"
              />
              <div className="w-100">
                <Alert.Heading className="h6 d-flex align-items-center mb-1">
                  {item.title || 'Notification'}
                </Alert.Heading>
                <p className="mb-1 small">{item.body}</p>
                {config.linkTo && config.linkText && (
                  <div>
                    <Link
                      to={config.linkTo}
                      className="alert-link small fw-semibold text-decoration-none"
                    >
                      {config.linkText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )
      })}
    </>
  )
}

export default BackendNotificationsAlerts