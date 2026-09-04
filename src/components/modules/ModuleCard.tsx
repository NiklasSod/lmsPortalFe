import { useState } from 'react'
import type { SubmitEvent } from 'react'
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

  const [deleteState, setDeleteState] = useState({
    show: false,
    loading: false,
    error: null as string | null,
  })

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const [editState, setEditState] = useState({
    show: false,
    saving: false,
    error: null as string | null,
  })

  const handleDelete = async () => {
    setDeleteState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await deleteModule(moduleData.id)
      setDeleteState((prev) => ({ ...prev, show: false }))
      onDelete?.(moduleData)
    } catch (err) {
      setDeleteState((prev) => ({ ...prev, error: (err as Error).message }))
    } finally {
      setDeleteState((prev) => ({ ...prev, loading: false }))
    }
  }

  const openEdit = () => {
    setEditState((prev) => ({ ...prev, error: null, show: true }))
    setEditForm({
      name: moduleData.name,
      description: moduleData.description,
      startDate: moduleData.startDate ? moduleData.startDate.split('T')[0] : '',
      endDate: moduleData.endDate ? moduleData.endDate.split('T')[0] : '',
    })
  }

  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditState((prev) => ({ ...prev, error: null }))

    if (
      editForm.startDate &&
      editForm.endDate &&
      new Date(editForm.endDate) < new Date(editForm.startDate)
    ) {
      setEditState((prev) => ({
        ...prev,
        error: 'End date cannot be earlier than start date.',
      }))
      return
    }

    setEditState((prev) => ({ ...prev, saving: true }))
    try {
      const updated = await updateModule(moduleData.id, {
        name: editForm.name,
        description: editForm.description,
        startDate: editForm.startDate
          ? new Date(editForm.startDate).toISOString()
          : undefined,
        endDate: editForm.endDate
          ? new Date(editForm.endDate).toISOString()
          : undefined,
      })

      setModuleData(updated)
      setEditState((prev) => ({ ...prev, show: false }))
      onEdit?.(updated)
    } catch (err: unknown) {
      setEditState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Could not update module.',
      }))
    } finally {
      setEditState((prev) => ({ ...prev, saving: false }))
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
              onClick={() =>
                setDeleteState((prev) => ({ ...prev, show: true, error: null }))
              }
            >
              Delete
            </Button>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={deleteState.show}
        onHide={() => setDeleteState((prev) => ({ ...prev, show: false }))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteState.error && (
            <Alert variant="danger">{deleteState.error}</Alert>
          )}
          Are you sure you want to delete <strong>{moduleData.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteState((prev) => ({ ...prev, show: false }))}
            disabled={deleteState.loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteState.loading}
          >
            {deleteState.loading ? 'Deleting…' : 'Yes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editState.show}
        onHide={() => setEditState((prev) => ({ ...prev, show: false }))}
        centered
      >
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Module</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editState.error && (
              <Alert variant="danger">{editState.error}</Alert>
            )}
            <Form.Group className="mb-3" controlId="editModuleName">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.startDate}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editModuleEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.endDate}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, endDate: e.target.value }))
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setEditState((prev) => ({ ...prev, show: false }))}
              disabled={editState.saving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editState.saving}>
              {editState.saving ? (
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
