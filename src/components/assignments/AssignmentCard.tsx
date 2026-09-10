import { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import type { Assignment } from '../../types/assignment'
import type { UserDto } from '../../api/user'
import { statusBadgeBg, statusLabel } from '../../utils/submissionStatus'
import SubmitAssignmentModal from './SubmitAssignmentModal'
import AssignmentSubmissionsList from './AssignmentSubmissionsList'

interface AssignmentCardProps {
  assignment: Assignment
  usersById?: Map<string, UserDto>
  onSubmitted?: () => void
}

function formatDueDate(dueDate: string) {
  const d = new Date(dueDate)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function AssignmentCard({
  assignment,
  usersById,
  onSubmitted,
}: AssignmentCardProps) {
  const { role } = useAuth()
  const isTeacher = role !== 'student'
  const [showSubmit, setShowSubmit] = useState(false)

  return (
    <>
      <Card className="h-100 shadow-sm">
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
            Due {formatDueDate(assignment.dueDate)}
          </Card.Text>

          {isTeacher ? (
            <AssignmentSubmissionsList
              assignmentId={assignment.id}
              usersById={usersById}
            />
          ) : (
            <div className="mt-auto">
              {assignment.latestFeedback.trim() && (
                <Card.Text className="small mb-2">
                  <span className="text-muted">Feedback: </span>
                  {assignment.latestFeedback}
                </Card.Text>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowSubmit(true)}
              >
                {assignment.latestSubmissionId
                  ? 'Resubmit'
                  : 'Submit assignment'}
              </Button>
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
    </>
  )
}

export default AssignmentCard
