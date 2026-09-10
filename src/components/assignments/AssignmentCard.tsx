import { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import type { Assignment } from '../../types/assignment'
import type { UserDto } from '../../api/user'
import { statusBadgeBg, statusLabel } from '../../utils/submissionStatus'
import SubmitAssignmentModal from './SubmitAssignmentModal'
import AssignmentSubmissionsList from './AssignmentSubmissionsList'
import { AssignmentFormModal } from './AssignmentFormModal'
import { DeleteAssignmentModal } from './DeleteAssignmentModal'

interface AssignmentCardProps {
  assignment: Assignment
  usersById?: Map<string, UserDto>
  modules?: { id: number; name: string }[]
  onSubmitted?: () => void
  onUpdated?: () => void
  onDeleted?: () => void
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
  modules,
  onSubmitted,
  onUpdated,
  onDeleted,
}: AssignmentCardProps) {
  const { role } = useAuth()
  const isTeacher = role !== 'student'

  const [showSubmit, setShowSubmit] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Body className="position-relative d-flex flex-column">
          {isTeacher && (
            <Button
              variant="outline-primary"
              size="sm"
              style={{ position: 'absolute', top: 6, right: 6 }}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </Button>
          )}

          <Card.Title className="h5 pe-5 mb-2">{assignment.name}</Card.Title>

          {!isTeacher && (
            <Badge
              bg={statusBadgeBg(assignment.latestSubmissionStatus)}
              className="ms-2"
            >
              {statusLabel(assignment.latestSubmissionStatus)}
            </Badge>
          )}

          {assignment.description && (
            <Card.Text className="text-muted small pe-5 mb-2">
              {assignment.description}
            </Card.Text>
          )}

          <Card.Text className="text-muted small pe-5 mb-3">
            Due {formatDueDate(assignment.dueDate)}
          </Card.Text>

          {isTeacher && (
            <div className="d-flex justify-content-end mb-1">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowDelete(true)}
              >
                Delete
              </Button>
            </div>
          )}

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

      {isTeacher && (
        <>
          <AssignmentFormModal
            show={showEdit}
            assignment={assignment}
            modules={modules}
            onHide={() => setShowEdit(false)}
            onSaved={() => {
              onUpdated?.()
            }}
          />

          <DeleteAssignmentModal
            show={showDelete}
            assignment={assignment}
            onHide={() => setShowDelete(false)}
            onDeleted={() => {
              onDeleted?.()
            }}
          />
        </>
      )}
    </>
  )
}

export default AssignmentCard
