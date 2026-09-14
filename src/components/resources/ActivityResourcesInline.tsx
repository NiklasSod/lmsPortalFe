import { useEffect, useState } from 'react'
import { Alert, Button, Form, ListGroup, Spinner } from 'react-bootstrap'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import {
  createResource,
  deleteResource,
  getActivityResources,
  updateResource,
} from '../../api/resource'
import type { Resource } from '../../types/resource'

interface ActivityResourcesInlineProps {
  activityId: number
}

function normalizeUrl(raw: string): string {
  const value = raw.trim()
  if (!value) return value
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function ActivityResourcesInline({ activityId }: ActivityResourcesInlineProps) {
  const { role, userId } = useAuth()
  const isTeacher = role !== 'student'

  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    try {
      setError(null)
      const data = await getActivityResources(activityId)
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId])

  const startAdd = () => {
    setAdding(true)
    setName('')
    setUrl('')
    setFormError(null)
  }

  const submitAdd = async () => {
    const link = normalizeUrl(url)
    if (!name.trim() || !link) {
      setFormError('Please provide both a name and a valid link.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      const created = await createResource({
        displayName: name.trim(),
        url: link,
        activityId,
      })
      setResources((prev) => [...prev, created])
      setAdding(false)
      setName('')
      setUrl('')
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Could not add resource.',
      )
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (resource: Resource) => {
    setEditingId(resource.id)
    setEditName(resource.displayName)
    setEditUrl(resource.url)
    setFormError(null)
  }

  const submitEdit = async () => {
    if (editingId === null) return
    const link = normalizeUrl(editUrl)
    if (!editName.trim() || !link) {
      setFormError('Please provide both a name and a valid link.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      const updated = await updateResource(editingId, {
        displayName: editName.trim(),
        url: link,
      })
      setResources((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      )
      setEditingId(null)
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Could not update resource.',
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async (id: number) => {
    try {
      await deleteResource(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
      setDeleteId(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete resource.',
      )
    }
  }

  if (loading) {
    return (
      <div className="text-center py-1">
        <Spinner animation="border" size="sm" role="status" />
      </div>
    )
  }

  return (
    <div className="mt-2 small">
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold text-secondary">Resources</span>
        {isTeacher && !adding && (
          <Button
            variant="outline-primary"
            size="sm"
            className="py-0 px-2 small"
            onClick={startAdd}
          >
            + Add
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="danger" className="py-1 px-2 small mb-0 mt-1">
          {error}
        </Alert>
      )}
      {formError && (
        <Alert variant="danger" className="py-1 px-2 small mb-0 mt-1">
          {formError}
        </Alert>
      )}

      {resources.length === 0 && !adding && (
        <div className="text-muted">No resources.</div>
      )}

      <ListGroup variant="flush">
        {resources.map((resource) => {
          const isOwner = isTeacher && resource.creatorId === userId

          if (editingId === resource.id) {
            return (
              <ListGroup.Item
                key={resource.id}
                className="px-0 py-2 bg-transparent border-0"
              >
                <Form.Control
                  size="sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mb-1"
                  placeholder="Name"
                />
                <Form.Control
                  size="sm"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="mb-1"
                  placeholder="https://…"
                />
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="py-0 px-2"
                    disabled={saving}
                    onClick={submitEdit}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="py-0 px-2"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </ListGroup.Item>
            )
          }

          return (
            <ListGroup.Item
              key={resource.id}
              className="px-0 py-1 bg-transparent border-0 d-flex justify-content-between align-items-start"
            >
              <div className="me-2 p-1">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none d-inline-flex align-items-center gap-1"
                  style={{ color: 'var(--link-color)' }}
                >
                  <span className="text-break">{resource.displayName}</span>
                  <BoxArrowUpRight
                    size={10}
                    className="flex-shrink-0"
                    style={{ width: 10, height: 10, flexShrink: 0 }}
                  />
                </a>
              </div>
              {isOwner && (
                <div className="d-flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="py-0 px-2 small"
                    onClick={() => startEdit(resource)}
                  >
                    Edit
                  </Button>
                  {deleteId === resource.id ? (
                    <span className="d-inline-flex gap-1 align-items-center">
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="py-0 px-2 small"
                        onClick={() => confirmDelete(resource.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="py-0 px-2 small"
                        onClick={() => setDeleteId(null)}
                      >
                        Cancel
                      </Button>
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="py-0 px-2 small"
                      onClick={() => setDeleteId(resource.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </ListGroup.Item>
          )
        })}
      </ListGroup>

      {adding && (
        <div className="mt-2">
          <Form.Control
            size="sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-1"
            placeholder="Name"
          />
          <Form.Control
            size="sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mb-1"
            placeholder="https://…"
          />
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="primary"
              className="py-0 px-2"
              disabled={saving}
              onClick={submitAdd}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="py-0 px-2"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityResourcesInline
