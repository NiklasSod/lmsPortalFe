import { Alert } from 'react-bootstrap'
import { Clock, ExclamationTriangle } from 'react-bootstrap-icons'
import type { Deadline } from '../../types/dashboard'

interface AtRiskAlertsProps {
  deadlines: Deadline[]
  onDismiss: (id: number) => void
}

function formatDueDate(deadline: Deadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const AtRiskAlerts = ({ deadlines, onDismiss }: AtRiskAlertsProps) => {
  return (
    <>
      {deadlines.map((deadline) => (
        <Alert
          key={deadline.id}
          variant="warning"
          dismissible
          onClose={() => onDismiss(deadline.id)}
        >
          <div className="d-flex align-items-start gap-3">
            <ExclamationTriangle
              className="flex-shrink-0"
              aria-hidden="true"
              width={20}
              height={20}
            />
            <div className="w-100">
              <div className="d-flex align-items-center mb-1">
                <Alert.Heading className="h6 mb-0">Assignment due soon</Alert.Heading>
              </div>
              <p className="mb-1 small">
                <strong>{deadline.assignmentTitle}</strong>
              </p>
              <div className="d-flex align-items-center gap-2 small">
                <Clock aria-hidden="true" />
                <span>Due {formatDueDate(deadline)}</span>
              </div>
            </div>
          </div>
        </Alert>
      ))}
    </>
  )
}

export default AtRiskAlerts