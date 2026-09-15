import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Badge, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { createSubmission, getMySubmissions } from '../../api/submission'
import type { Assignment } from '../../types/assignment'
import type { Submission } from '../../types/submission'
import { statusBadgeBg, statusLabel } from '../../utils/submissionStatus'

function formatDate(value: string) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

interface SubmitAssignmentModalProps {
  show: boolean
  assignment: Assignment
  onHide: () => void
  onSubmitted?: () => void
}

function SubmitAssignmentModal({
  show,
  assignment,
  onHide,
  onSubmitted,
}: SubmitAssignmentModalProps) {
  const isResubmit = assignment.latestSubmissionId != null
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<Submission[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const loadHistory = () => {
    setHistoryLoading(true)
    setHistory([])

    getMySubmissions()
      .then((data) => {
        const list = (Array.isArray(data) ? data : []).filter(
          (sub) => sub.assignmentId === assignment.id,
        )
        setHistory(
          list.sort(
            (a, b) =>
              new Date(a.handinDate).getTime() -
              new Date(b.handinDate).getTime(),
          ),
        )
      })
      .catch(() => {
        setHistory([])
      })
      .finally(() => {
        setHistoryLoading(false)
      })
  }

  const handleHide = () => {
    setContent('')
    setError(null)
    onHide()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Please enter your submission.')
      return
    }

    setError(null)
    setSaving(true)

    try {
      await createSubmission({ assignmentId: assignment.id, content })
      handleHide()
      onSubmitted?.()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Could not submit assignment.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={handleHide} onShow={loadHistory} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isResubmit ? 'Resubmit assignment' : 'Submit assignment'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small mb-3">{assignment.name}</p>

          {historyLoading && (
            <div className="text-center py-2">
              <Spinner animation="border" size="sm" role="status" />
            </div>
          )}

          {!historyLoading && history.length > 0 && (
            <div className="mb-3">
              <p className="fw-semibold small text-secondary mb-2">
                Previous submissions
              </p>
              {history.map((sub) => (
                <div key={sub.id} className="border rounded p-2 mb-2 small">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                    <Badge bg={statusBadgeBg(sub.status)}>
                      {statusLabel(sub.status)}
                    </Badge>
                    <span className="text-muted">
                      {formatDate(sub.handinDate)}
                    </span>
                  </div>
                  <p className="mb-1">{sub.content}</p>
                  {sub.feedback.trim() && (
                    <p className="mb-0">
                      <span className="text-muted">Feedback: </span>
                      {sub.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="submissionContent">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your answer
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Write your submission here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
              required
            />
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
                Submitting…
              </>
            ) : isResubmit ? (
              'Resubmit'
            ) : (
              'Submit'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SubmitAssignmentModal
