import { Spinner, Alert, Button, Modal } from 'react-bootstrap'
import type { CourseSummary } from '../../types/course'

interface DeletCourseModalProps {
  isDeleting: boolean
  deleteError: string | null
  handleConfirmDelete: () => Promise<void>
  courseToDelete: CourseSummary | null
  setCourseToDelete: React.Dispatch<React.SetStateAction<CourseSummary | null>>
}

const DeleteCourseModal = ({
  isDeleting,
  deleteError,
  handleConfirmDelete,
  courseToDelete,
  setCourseToDelete,
}: DeletCourseModalProps) => {
  return (
    <Modal
      show={Boolean(courseToDelete)}
      onHide={() => setCourseToDelete(null)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}
        Are you sure you want to delete <strong>{courseToDelete?.name}</strong>?
        This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setCourseToDelete(null)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />{' '}
              Deleting...
            </>
          ) : (
            'Delete Course'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteCourseModal
