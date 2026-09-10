import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { updateSubmission } from '../../api/submission'
import type { Submission } from '../../types/submission'
import type { UserDto } from '../../api/user'

interface ReviewSubmissionModalProps {
  show: boolean
  submission: Submission | null
  usersById?: Map<string, UserDto>
  onHide: () => void
  onReviewed?: () => void
}

function studentName(sub: Submission, usersById?: Map<string, UserDto>) {
  const user = usersById?.get(sub.studentId)
  if (user && (user.firstName || user.lastName)) {
    return `${user.firstName} ${user.lastName}`.trim()
  }
  return sub.studentId ? `Student ${sub.studentId.slice(0, 8)}` : 'Student'
}

function ReviewSubmissionModal({
  show,
  submission,
  usersById,
  onHide,
  onReviewed,
}: ReviewSubmissionModalProps) {
  const [feedback, setFeedback] = useState(submission?.feedback ?? '')
  const [status, setStatus] = useState(
    (submission?.status ?? '').toLowerCase() === 'revision'
      ? 'revision'
      : 'approved',
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleHide = () => {
    setError(null)
    onHide()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!submission) return

    setError(null)
    setSaving(true)

    try {
      await updateSubmission(submission.id, { feedback, status })
      handleHide()
      onReviewed?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Review submission</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {submission && (
            <>
              <p className="mb-1 small text-secondary">Student</p>
              <p className="fw-semibold">
                {studentName(submission, usersById)}
              </p>

              <p className="mb-1 small text-secondary">Answer</p>
              <p className="border rounded p-2">{submission.content}</p>
            </>
          )}

          <Form.Group className="mb-3" controlId="reviewFeedback">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Feedback
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Give feedback to the student…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="reviewStatus">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Status
            </Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
            >
              <option value="approved">Approved</option>
              <option value="revision">Needs revision</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="dark"
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: 'var(--btn-bg)',
              borderColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
              borderRadius: '6px',
            }}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving…
              </>
            ) : (
              'Save review'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ReviewSubmissionModal
