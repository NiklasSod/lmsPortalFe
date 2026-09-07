import { useState } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { addModule } from '../../api/module'
import type { CourseModule } from '../../types/module'

interface ModuleFormModalProps {
  courseId: number
  show: boolean
  onHide: () => void
  onCreated: (module: CourseModule) => void
}

function ModuleFormModal({
  courseId,
  show,
  onHide,
  onCreated,
}: ModuleFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const reset = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setError(null)
  }

  const handleHide = () => {
    reset()
    onHide()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.')
      return
    }

    setIsLoading(true)

    try {
      const created = await addModule({
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        courseId,
      })

      reset()
      onCreated(created)
      onHide()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not connect to server.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Module</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="moduleName">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Module Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter module name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <Form.Group className="mb-3" controlId="moduleDescription">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter module description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="moduleStartDate">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start Date
            </Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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

          <Form.Group className="mb-3" controlId="moduleEndDate">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              End Date
            </Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
          <Button variant="secondary" onClick={handleHide} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--btn-bg)',
              borderColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
              borderRadius: '6px',
            }}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding module...
              </>
            ) : (
              'Add Module'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModuleFormModal
