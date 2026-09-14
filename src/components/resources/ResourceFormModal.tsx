import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { createResource, updateResource } from '../../api/resource'
import type { Resource } from '../../types/resource'

interface ResourceFormModalProps {
  show: boolean
  mode: 'add' | 'edit'
  resource?: Resource | null
  courseId?: number
  moduleId?: number
  activityId?: number
  onHide: () => void
  onSaved: (resource: Resource, mode: 'add' | 'edit') => void
}

function normalizeUrl(raw: string): string {
  const value = raw.trim()
  if (!value) return value
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function ResourceFormModal({
  show,
  mode,
  resource,
  courseId,
  moduleId,
  activityId,
  onHide,
  onSaved,
}: ResourceFormModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!show) return
    setError(null)
    setDisplayName(resource?.displayName ?? '')
    setUrl(resource?.url ?? '')
  }, [show, resource])

  const handleHide = () => {
    setError(null)
    onHide()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const name = displayName.trim()
    const link = normalizeUrl(url)
    if (!name || !link) {
      setError('Please provide both a name and a valid link.')
      return
    }

    setSaving(true)
    try {
      if (mode === 'add') {
        const created = await createResource({
          displayName: name,
          url: link,
          courseId,
          moduleId,
          activityId,
        })
        onSaved(created, 'add')
      } else if (resource) {
        const updated = await updateResource(resource.id, {
          displayName: name,
          url: link,
        })
        onSaved(updated, 'edit')
      }

      onHide()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save resource.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' ? 'Add Resource' : 'Edit Resource'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="resourceName">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Lecture slides"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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

          <Form.Group className="mb-3" controlId="resourceUrl">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Link
            </Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/resource"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
              required
            />
            <Form.Text className="text-muted">
              A URL starting with https:// is recommended.
            </Form.Text>
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
            ) : mode === 'add' ? (
              'Add Resource'
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ResourceFormModal
