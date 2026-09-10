import { useEffect, useState } from 'react'
import { Alert, Badge, Modal, Spinner } from 'react-bootstrap'
import { getMySubmissions } from '../../api/submission'
import type { Assignment } from '../../types/assignment'
import type { Submission } from '../../types/submission'
import { statusBadgeBg, statusLabel } from '../../utils/submissionStatus'

interface ViewSubmissionModalProps {
  show: boolean
  assignment: Assignment | null
  onHide: () => void
}

function formatHandinDate(handinDate: string) {
  const d = new Date(handinDate)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ViewSubmissionModal({
  show,
  assignment,
  onHide,
}: ViewSubmissionModalProps) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!show || !assignment) return

    let ignore = false
    setLoading(true)
    setError(null)
    setSubmission(null)

    getMySubmissions()
      .then((data) => {
        if (ignore) return
        const subs = Array.isArray(data) ? data : []
        const latest = assignment.latestSubmissionId
          ? subs.find((sub) => sub.id === assignment.latestSubmissionId)
          : subs.find((sub) => sub.assignmentId === assignment.id)
        setSubmission(latest ?? null)
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
  }, [show, assignment])

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{assignment?.name ?? 'Submission'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-2">
            <Spinner animation="border" size="sm" role="status" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        ) : submission ? (
          <>
            <p className="mb-1 small text-secondary">Your answer</p>
            <p className="border rounded p-2">{submission.content}</p>

            <p className="mb-1 small text-secondary">Handed in</p>
            <p className="mb-2">{formatHandinDate(submission.handinDate)}</p>

            <p className="mb-1 small text-secondary">Status</p>
            <div>
              <Badge bg={statusBadgeBg(submission.status)}>
                {statusLabel(submission.status)}
              </Badge>
            </div>
          </>
        ) : (
          <p className="text-muted small mb-0">No submission found.</p>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewSubmissionModal
