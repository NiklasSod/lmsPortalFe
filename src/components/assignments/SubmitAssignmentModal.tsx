import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { createSubmission } from '../../api/submission'
import type { Assignment } from '../../types/assignment'

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
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Submit assignment</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small mb-3">{assignment.name}</p>

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
