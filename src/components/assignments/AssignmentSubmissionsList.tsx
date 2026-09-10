import { useEffect, useState } from 'react'
import { Alert, Badge, Button, ListGroup, Spinner } from 'react-bootstrap'
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons'
import { getAssignmentSubmissions } from '../../api/submission'
import type { Submission } from '../../types/submission'
import type { UserDto } from '../../api/user'
import {
  normalizeStatus,
  statusBadgeBg,
  statusLabel,
} from '../../utils/submissionStatus'
import ReviewSubmissionModal from './ReviewSubmissionModal'

interface AssignmentSubmissionsListProps {
  assignmentId: number
  usersById?: Map<string, UserDto>
  dueDate?: string
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

const REVISION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function submissionDeadline(
  sub: Submission,
  all: Submission[],
  dueDate?: string,
): number | null {
  const previous = all
    .filter((s) => s.studentId === sub.studentId && s.id !== sub.id)
    .sort(
      (a, b) =>
        new Date(a.handinDate).getTime() - new Date(b.handinDate).getTime(),
    )
    .pop()

  if (previous?.gradedAt && normalizeStatus(previous.status) === 'revision') {
    const gradedAt = new Date(previous.gradedAt).getTime()
    if (!isNaN(gradedAt)) return gradedAt + REVISION_WINDOW_MS
  }

  if (dueDate) {
    const due = new Date(dueDate).getTime()
    if (!isNaN(due)) return due
  }

  return null
}

function isLateSubmission(
  sub: Submission,
  all: Submission[],
  dueDate?: string,
): boolean {
  const deadline = submissionDeadline(sub, all, dueDate)
  if (deadline === null) return false
  const handin = new Date(sub.handinDate).getTime()
  return !isNaN(handin) && handin > deadline
}

interface SubmissionRowProps {
  sub: Submission
  usersById?: Map<string, UserDto>
  late?: boolean
  onReview: (sub: Submission) => void
}

function SubmissionRow({
  sub,
  usersById,
  late = false,
  onReview,
}: SubmissionRowProps) {
  const readOnly =
    normalizeStatus(sub.status) === 'approved' ||
    normalizeStatus(sub.status) === 'revision'

  return (
    <ListGroup.Item className="px-0 py-2 bg-transparent border-bottom">
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold small">
              {studentName(sub, usersById)}
            </span>
            <Badge bg={statusBadgeBg(sub.status)}>
              {statusLabel(sub.status)}
            </Badge>
            {late && (
              <Badge bg="warning" text="dark">
                Late
              </Badge>
            )}
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
          onClick={() => onReview(sub)}
        >
          {readOnly ? 'Show' : 'Review'}
        </Button>
      </div>
    </ListGroup.Item>
  )
}

function AssignmentSubmissionsList({
  assignmentId,
  usersById,
  dueDate,
}: AssignmentSubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewing, setReviewing] = useState<Submission | null>(null)
  const [showGraded, setShowGraded] = useState(false)
  const [showAllActive, setShowAllActive] = useState(false)

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

  const lateIds = new Set<number>()
  for (const sub of submissions) {
    if (isLateSubmission(sub, submissions, dueDate)) {
      lateIds.add(sub.id)
    }
  }

  const active = submissions
    .filter((sub) => {
      const kind = normalizeStatus(sub.status)
      return kind !== 'approved' && kind !== 'revision'
    })
    .sort((a, b) => {
      const aLate = Number(lateIds.has(a.id))
      const bLate = Number(lateIds.has(b.id))
      return bLate - aLate
    })
  const graded = submissions.filter((sub) => {
    const kind = normalizeStatus(sub.status)
    return kind === 'approved' || kind === 'revision'
  })
  const visibleActive = active.slice(0, 2)
  const hiddenActive = active.slice(2)

  return (
    <div className="mt-3 pt-2 border-top">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold small text-secondary mb-0">
          Needs review ({active.length})
        </h6>
      </div>

      {submissions.length === 0 ? (
        <p className="text-muted small mb-0">No submissions yet.</p>
      ) : active.length === 0 ? (
        <p className="text-muted small mb-0">No submissions to review.</p>
      ) : (
        <>
          <ListGroup variant="flush">
            {visibleActive.map((sub) => (
              <SubmissionRow
                key={sub.id}
                sub={sub}
                usersById={usersById}
                late={lateIds.has(sub.id)}
                onReview={setReviewing}
              />
            ))}
          </ListGroup>

          {hiddenActive.length > 0 && (
            <div className="mt-2">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none d-flex align-items-center gap-1"
                onClick={() => setShowAllActive((prev) => !prev)}
                aria-expanded={showAllActive}
              >
                {showAllActive ? <ChevronDown /> : <ChevronRight />}
                {showAllActive
                  ? 'Show fewer'
                  : `Show more (${hiddenActive.length})`}
              </Button>

              {showAllActive && (
                <ListGroup variant="flush" className="mt-1">
                  {hiddenActive.map((sub) => (
                    <SubmissionRow
                      key={sub.id}
                      sub={sub}
                      usersById={usersById}
                      late={lateIds.has(sub.id)}
                      onReview={setReviewing}
                    />
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </>
      )}

      {graded.length > 0 && (
        <div className="mt-2">
          <Button
            variant="link"
            size="sm"
            className="p-0 text-decoration-none d-flex align-items-center gap-1"
            onClick={() => setShowGraded((prev) => !prev)}
            aria-expanded={showGraded}
          >
            {showGraded ? <ChevronDown /> : <ChevronRight />}
            Graded ({graded.length})
          </Button>

          {showGraded && (
            <ListGroup variant="flush" className="mt-1">
              {graded.map((sub) => (
                <SubmissionRow
                  key={sub.id}
                  sub={sub}
                  usersById={usersById}
                  late={lateIds.has(sub.id)}
                  onReview={setReviewing}
                />
              ))}
            </ListGroup>
          )}
        </div>
      )}

      <ReviewSubmissionModal
        key={reviewing?.id ?? 'closed'}
        show={reviewing !== null}
        submission={reviewing}
        usersById={usersById}
        readOnly={
          reviewing !== null &&
          (normalizeStatus(reviewing.status) === 'approved' ||
            normalizeStatus(reviewing.status) === 'revision')
        }
        onHide={() => setReviewing(null)}
        onReviewed={loadSubmissions}
      />
    </div>
  )
}

export default AssignmentSubmissionsList
