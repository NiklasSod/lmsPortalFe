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
import { AssignmentFormModal } from './AssignmentFormModal'
import { DeleteAssignmentModal } from './DeleteAssignmentModal'
import ViewSubmissionModal from './ViewSubmissionModal'

interface AssignmentCardProps {
  assignment: Assignment
  usersById?: Map<string, UserDto>
  modules?: { id: number; name: string }[]
  submissionsById?: Map<number, Submission>
  onSubmitted?: () => void
  onUpdated?: () => void
  onDeleted?: () => void
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
  modules,
  submissionsById,
  onSubmitted,
  onUpdated,
  onDeleted,
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
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <Card
        className="h-100 shadow-sm"
        onClick={isCompleted ? () => setShowSubmission(true) : undefined}
        style={isCompleted ? { cursor: 'pointer' } : undefined}
      >
        <Card.Body className="position-relative d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="h5 mb-0">{assignment.name}</Card.Title>
            <div className="d-flex align-items-center gap-2">
              {!isTeacher && (
                <Badge
                  bg={statusBadgeBg(assignment.latestSubmissionStatus)}
                  className="ms-2"
                >
                  {statusLabel(assignment.latestSubmissionStatus)}
                </Badge>
              )}
              {isTeacher && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowEdit(true)
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          {assignment.description && (
            <Card.Text className="text-muted small pe-5 mb-2">
              {assignment.description}
            </Card.Text>
          )}

          <Card.Text className="text-muted small mb-3">
            {isResubmit && resubmitDeadline
              ? `Resubmit by ${formatDate(resubmitDeadline)}`
              : `Due ${formatDate(assignment.dueDate)}`}
          </Card.Text>

          {isTeacher && (
            <div className="d-flex justify-content-end mb-1">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDelete(true)
                }}
              >
                Delete
              </Button>
            </div>
          )}

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
