import { useState } from 'react'
import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { deleteAssignment } from '../../api/assignment'
import type { Assignment } from '../../types/assignment'

interface DeleteAssignmentModalProps {
  show: boolean
  assignment: Assignment | null
  onHide: () => void
  onDeleted: (assignmentId: number) => void
}

export function DeleteAssignmentModal({
  show,
  assignment,
  onHide,
  onDeleted,
}: DeleteAssignmentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (!assignment) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteAssignment(assignment.id)
      onDeleted(assignment.id)
      onHide()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not delete assignment.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        Are you sure you want to delete{' '}
        <strong>{assignment?.name}</strong>? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Deleting...
            </>
          ) : (
            'Delete Assignment'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
