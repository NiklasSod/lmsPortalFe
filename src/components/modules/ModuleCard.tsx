import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form, Modal, Spinner } from 'react-bootstrap'
import { getRole } from '../../api/auth'
import { deleteModule, updateModule } from '../../api/module'
import type { CourseModule } from '../../types/module'

interface ModuleCardProps {
  module: CourseModule
  onEdit?: (module: CourseModule) => void
  onDelete?: (module: CourseModule) => void
}

function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  const isTeacher = getRole() !== 'student'
  const [moduleData, setModuleData] = useState<CourseModule>(module)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteModule(moduleData.id)
      setShowConfirm(false)
      onDelete?.(moduleData)
    } catch (err) {
      setDeleteError((err as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = () => {
    setEditError(null)
    setEditName(moduleData.name)
    setEditDescription(moduleData.description)
    setEditStartDate(
      moduleData.startDate ? moduleData.startDate.split('T')[0] : '',
    )
    setEditEndDate(moduleData.endDate ? moduleData.endDate.split('T')[0] : '')
    setShowEdit(true)
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditError(null)

    if (
      editStartDate &&
      editEndDate &&
      new Date(editEndDate) < new Date(editStartDate)
    ) {
      setEditError('End date cannot be earlier than start date.')
      return
    }

    setIsSaving(true)
    try {
      const updated = await updateModule(moduleData.id, {
        name: editName,
        description: editDescription,
        startDate: editStartDate
          ? new Date(editStartDate).toISOString()
          : undefined,
        endDate: editEndDate ? new Date(editEndDate).toISOString() : undefined,
      })

      setModuleData(updated)
      setShowEdit(false)
      onEdit?.(updated)
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : 'Could not update module.',
      )
    } finally {
      setIsSaving(false)
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
              onClick={openEdit}
            >
              Edit
            </Button>
          )}
          <Card.Title className="h5 pe-5">{moduleData.name}</Card.Title>
          <Card.Text className="text-muted small">
            {moduleData.description}
          </Card.Text>
          <Card.Text className="text-muted small mb-0 pe-5">
            {new Date(moduleData.startDate).toLocaleDateString()} -{' '}
            {new Date(moduleData.endDate).toLocaleDateString()}
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
          Are you sure you want to delete <strong>{moduleData.name}</strong>?
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

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Module</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-3" controlId="editModuleName">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEdit(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />{' '}
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ModuleCard
