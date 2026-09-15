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

  return (
    <>
      {notifications.map((item) => (
        <Alert
          key={`notification-${item.id}`}
          variant="primary"
          dismissible
          onClose={() => onDismiss(item.id)}
        >
          <div className="d-flex align-items-center gap-3 mb-2">
            <DomainIcon type={item.type} />
            <Alert.Heading className="h5 mb-0">
              {item.title || 'Notification'}
            </Alert.Heading>
          </div>
          <p className="mb-2 ms-4 ps-2">{item.body}</p>
          <div className="ms-4 ps-2">
            <Link
              to={`${base}/assignments`}
              className="alert-link small fw-semibold text-decoration-none"
            >
              View assignments &rarr;
            </Link>
          </div>
        </Alert>
      ))}
    </>
  )
}

export default BackendNotificationsAlerts