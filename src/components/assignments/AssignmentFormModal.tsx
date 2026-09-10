import React, { useState } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import {
  createAssignment,
  createModuleAssignment,
  updateAssignment,
} from '../../api/assignment'
import type { Assignment } from '../../types/assignment'

interface AssignmentFormModalProps {
  show: boolean
  onHide: () => void
  onSaved: (assignment: Assignment) => void
  assignment?: Assignment | null
  defaultModuleId?: number
  modules?: { id: number; name: string }[]
}

export function AssignmentFormModal({
  show,
  onHide,
  onSaved,
  assignment,
  defaultModuleId,
  modules,
}: AssignmentFormModalProps) {

  const isEditMode = Boolean(assignment)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [moduleId, setModuleId] = useState<number | string>(
    defaultModuleId || '',
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [prevAssignment, setPrevAssignment] = useState(assignment)
  const [prevShow, setPrevShow] = useState(show)

  if (show !== prevShow || assignment !== prevAssignment) {
    setPrevShow(show)
    setPrevAssignment(assignment)
    if (show && assignment) {
      setName(assignment.name ?? '')
      setDescription(assignment.description ?? '')
      const d = assignment.dueDate ? new Date(assignment.dueDate) : null
      setDueDate(d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : '')
      setModuleId(assignment.moduleId ?? defaultModuleId ?? '')
    } else if (show) {
      setName('')
      setDescription('')
      setDueDate('')
      setModuleId(defaultModuleId ?? '')
    }
    setError(null)
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setDueDate('')
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onHide()
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Assignment name is required.')
      return
    }

    if (!dueDate) {
      setError('Due date is required.')
      return
    }

    const numericModuleId = Number(moduleId)
    if (isNaN(numericModuleId) || numericModuleId <= 0) {
      setError('Valid Module ID is required.')
      return
    }

    setIsLoading(true)

    try {
      let savedAssignment: Assignment
      const isoDueDate = new Date(dueDate).toISOString()

      if (isEditMode && assignment) {
        savedAssignment = await updateAssignment(assignment.id, {
          name: name.trim(),
          description: description.trim(),
          dueDate: isoDueDate,
          moduleId: numericModuleId,
        })
      } else if (defaultModuleId) {
        savedAssignment = await createModuleAssignment(numericModuleId, {
          name: name.trim(),
          description: description.trim(),
          dueDate: isoDueDate,
          moduleId: numericModuleId,
        })
      } else {
        savedAssignment = await createAssignment({
          name: name.trim(),
          description: description.trim(),
          dueDate: isoDueDate,
          moduleId: numericModuleId,
        })
      }

      onSaved(savedAssignment)
      handleClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to save assignment.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Edit Assignment' : 'Create Assignment'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="assignmentName">
            <Form.Label>Assignment Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assignment name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="assignmentDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter assignment description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="assignmentDueDate">
            <Form.Label>Due Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Form.Group>

          {!defaultModuleId && (
            <Form.Group className="mb-3" controlId="assignmentModuleId">
              <Form.Label>Module</Form.Label>
              {modules && modules.length > 0 ? (
                <Form.Select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  required
                >
                  <option value="">Select a module...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type="number"
                  placeholder="Enter module ID"
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  required
                />
              )}
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
              borderColor: 'var(--btn-bg)',
            }}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create Assignment'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
