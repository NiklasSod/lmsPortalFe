import { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import type { Assignment } from '../../types/assignment'
import type { Submission } from '../../types/submission'
import type { UserDto } from '../../api/user'
import {
  normalizeStatus,
  statusBadgeBg,
  statusLabel,
} from '../../utils/submissionStatus'
import SubmitAssignmentModal from './SubmitAssignmentModal'
import AssignmentSubmissionsList from './AssignmentSubmissionsList'
import ViewSubmissionModal from './ViewSubmissionModal'

interface AssignmentCardProps {
  assignment: Assignment
  usersById?: Map<string, UserDto>
  submissionsById?: Map<number, Submission>
  onSubmitted?: () => void
}

const REVISION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function formatDate(value: Date | string) {
  const d = typeof value === 'string' ? new Date(value) : value
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function AssignmentCard({
  assignment,
  usersById,
  submissionsById,
  onSubmitted,
}: AssignmentCardProps) {
  const { role } = useAuth()
  const isTeacher = role !== 'student'
  const statusKind = normalizeStatus(assignment.latestSubmissionStatus)
  const isCompleted =
    !isTeacher && (statusKind === 'handedIn' || statusKind === 'approved')
  const isResubmit = !isTeacher && statusKind === 'revision'

  const resubmitDeadline = (() => {
    if (!isResubmit || !assignment.latestSubmissionId) return null
    const sub = submissionsById?.get(assignment.latestSubmissionId)
    if (!sub?.gradedAt) return null
    const gradedAt = new Date(sub.gradedAt).getTime()
    if (isNaN(gradedAt)) return null
    return new Date(gradedAt + REVISION_WINDOW_MS)
  })()

  const [showSubmit, setShowSubmit] = useState(false)
  const [showSubmission, setShowSubmission] = useState(false)

  return (
    <>
      <Card
        className="h-100 shadow-sm"
        onClick={isCompleted ? () => setShowSubmission(true) : undefined}
        style={isCompleted ? { cursor: 'pointer' } : undefined}
      >
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="h5 mb-0">{assignment.name}</Card.Title>
            {!isTeacher && (
              <Badge
                bg={statusBadgeBg(assignment.latestSubmissionStatus)}
                className="ms-2"
              >
                {statusLabel(assignment.latestSubmissionStatus)}
              </Badge>
            )}
          </div>

          {assignment.description && (
            <Card.Text className="text-muted small mb-2">
              {assignment.description}
            </Card.Text>
          )}

          <Card.Text className="text-muted small mb-3">
            {isResubmit && resubmitDeadline
              ? `Resubmit by ${formatDate(resubmitDeadline)}`
              : `Due ${formatDate(assignment.dueDate)}`}
          </Card.Text>

          {isTeacher ? (
            <AssignmentSubmissionsList
              assignmentId={assignment.id}
              usersById={usersById}
              dueDate={assignment.dueDate}
            />
          ) : (
            <div className="mt-auto">
              {assignment.latestFeedback.trim() && (
                <Card.Text className="small mb-2">
                  <span className="text-muted">Feedback: </span>
                  {assignment.latestFeedback}
                </Card.Text>
              )}
              {isCompleted ? (
                <p className="small text-muted mb-0">
                  Click to view your submission
                </p>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowSubmit(true)}
                >
                  {assignment.latestSubmissionId
                    ? 'Resubmit'
                    : 'Submit assignment'}
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <SubmitAssignmentModal
        show={showSubmit}
        assignment={assignment}
        onHide={() => setShowSubmit(false)}
        onSubmitted={onSubmitted}
      />

      <ViewSubmissionModal
        show={showSubmission}
        assignment={assignment}
        onHide={() => setShowSubmission(false)}
      />
    </>
  )
}

export default AssignmentCard
