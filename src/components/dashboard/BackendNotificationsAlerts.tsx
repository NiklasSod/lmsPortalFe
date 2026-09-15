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

  const getAlertVariant = (item: UserNotification) => {
    const title = (item.title || '').toLowerCase()
    if (item.type === 'approved' || title.includes('approved')) {
      return 'success'
    }
    if (item.type === 'revision' || title.includes('revision')) {
      return 'warning'
    }
    return 'primary'
  }

  return (
    <>
      {notifications.map((item) => {
        const variant = getAlertVariant(item)
        return (
          <Alert
            key={`notification-${item.id}`}
            variant={variant}
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
                <div>
                  <Link
                    to={`${base}/assignments`}
                    className="alert-link small fw-semibold text-decoration-none"
                  >
                    View assignments &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </Alert>
        )
      })}
    </>
  )
}

export default BackendNotificationsAlerts