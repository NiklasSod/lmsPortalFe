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
          <div className="d-flex gap-3">
            <ExclamationTriangle
              className="flex-shrink-0 mt-1"
              aria-hidden="true"
            />
            <div>
              <Alert.Heading className="h5">Assignment due soon</Alert.Heading>
              <p className="mb-2">
                <strong>{deadline.assignmentTitle}</strong>
              </p>
              <div className="d-flex align-items-center gap-2">
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
