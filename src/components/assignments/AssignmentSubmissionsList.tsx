import { useEffect, useState } from 'react'
import { Alert, Badge, Button, ListGroup, Spinner } from 'react-bootstrap'
import { getAssignmentSubmissions } from '../../api/submission'
import type { Submission } from '../../types/submission'
import type { UserDto } from '../../api/user'
import { statusBadgeBg, statusLabel } from '../../utils/submissionStatus'
import ReviewSubmissionModal from './ReviewSubmissionModal'

interface AssignmentSubmissionsListProps {
  assignmentId: number
  usersById?: Map<string, UserDto>
}

function studentName(sub: Submission, usersById?: Map<string, UserDto>) {
  const user = usersById?.get(sub.studentId)
  if (user && (user.firstName || user.lastName)) {
    return `${user.firstName} ${user.lastName}`.trim()
  }
  return sub.studentId ? `Student ${sub.studentId.slice(0, 8)}` : 'Student'
}

function formatHandinDate(handinDate: string) {
  const d = new Date(handinDate)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function AssignmentSubmissionsList({
  assignmentId,
  usersById,
}: AssignmentSubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewing, setReviewing] = useState<Submission | null>(null)

  const loadSubmissions = async () => {
    try {
      const data = await getAssignmentSubmissions(assignmentId)
      setSubmissions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useEffect(() => {
    let ignore = false

    getAssignmentSubmissions(assignmentId)
      .then((data) => {
        if (!ignore) setSubmissions(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!ignore) setError((err as Error).message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [assignmentId])

  if (loading) {
    return (
      <div className="text-center py-2">
        <Spinner animation="border" size="sm" role="status" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="py-1 px-2 small mb-0">
        {error}
      </Alert>
    )
  }

  return (
    <div className="mt-3 pt-2 border-top">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold small text-secondary mb-0">
          Submissions ({submissions.length})
        </h6>
      </div>

      {submissions.length === 0 ? (
        <p className="text-muted small mb-0">No submissions yet.</p>
      ) : (
        <ListGroup variant="flush">
          {submissions.map((sub) => (
            <ListGroup.Item
              key={sub.id}
              className="px-0 py-2 bg-transparent border-bottom"
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold small">
                      {studentName(sub, usersById)}
                    </span>
                    <Badge bg={statusBadgeBg(sub.status)}>
                      {statusLabel(sub.status)}
                    </Badge>
                  </div>
                  <div className="text-muted small mt-1">{sub.content}</div>
                  <div className="text-muted small mt-1">
                    {formatHandinDate(sub.handinDate)}
                  </div>
                  {sub.feedback.trim() && (
                    <div className="small mt-1">
                      <span className="text-muted">Feedback: </span>
                      {sub.feedback}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setReviewing(sub)}
                >
                  Review
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <ReviewSubmissionModal
        key={reviewing?.id ?? 'closed'}
        show={reviewing !== null}
        submission={reviewing}
        usersById={usersById}
        onHide={() => setReviewing(null)}
        onReviewed={loadSubmissions}
      />
    </div>
  )
}

export default AssignmentSubmissionsList
