import { useState } from 'react'
import { Alert, Button, Card, Modal } from 'react-bootstrap'
import { getRole } from '../../api/auth'
import { deleteModule } from '../../api/module'
import type { CourseModule } from '../../types/module'

interface ModuleCardProps {
  module: CourseModule
  onEdit?: (module: CourseModule) => void
  onDelete?: (module: CourseModule) => void
}

function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  const isTeacher = getRole() !== 'student'
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteModule(module.id)
      setShowConfirm(false)
      onDelete?.(module)
    } catch (err) {
      setDeleteError((err as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Body className="position-relative">
          {isTeacher && (
            <Button
              variant="outline-primary"
              size="sm"
              style={{ position: 'absolute', top: 6, right: 6 }}
              onClick={() => onEdit?.(module)}
            >
              Edit
            </Button>
          )}
          <Card.Title className="h5 pe-5">{module.name}</Card.Title>
          <Card.Text className="text-muted small">
            {module.description}
          </Card.Text>
          <Card.Text className="text-muted small mb-0 pe-5">
            {new Date(module.startDate).toLocaleDateString()} -{' '}
            {new Date(module.endDate).toLocaleDateString()}
          </Card.Text>
          {isTeacher && (
            <Button
              variant="outline-danger"
              size="sm"
              style={{ position: 'absolute', bottom: 6, right: 6 }}
              onClick={() => {
                setDeleteError(null)
                setShowConfirm(true)
              }}
            >
              Delete
            </Button>
          )}
        </Card.Body>
      </Card>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete <strong>{module.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Yes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModuleCard
