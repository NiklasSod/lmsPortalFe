import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ListGroup, Spinner } from 'react-bootstrap'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import {
  getActivityResources,
  getCourseResources,
  getModuleResources,
  deleteResource,
} from '../../api/resource'
import type { Resource } from '../../types/resource'
import ResourceFormModal from './ResourceFormModal'
import ConfirmModal from '../ConfirmModal'

interface ResourcesSectionProps {
  courseId?: number
  moduleId?: number
  activityId?: number
  title?: string
  bordered?: boolean
}

function ResourcesSection({
  courseId,
  moduleId,
  activityId,
  title = 'Resources',
  bordered = false,
}: ResourcesSectionProps) {
  const { role, userId } = useAuth()
  const isTeacher = role !== 'student'

  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formState, setFormState] = useState<{
    mode: 'add' | 'edit'
    resource?: Resource
  } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadResources = useCallback(async () => {
    try {
      setError(null)
      let data: Resource[] = []
      if (courseId !== undefined) {
        data = await getCourseResources(courseId)
      } else if (moduleId !== undefined) {
        data = await getModuleResources(moduleId)
      } else if (activityId !== undefined) {
        data = await getActivityResources(activityId)
      }
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }, [courseId, moduleId, activityId])

  useEffect(() => {
    loadResources()
  }, [loadResources])

  const handleSaved = (resource: Resource, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      setResources((prev) => [...prev, resource])
    } else {
      setResources((prev) =>
        prev.map((r) => (r.id === resource.id ? resource : r)),
      )
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteResource(deleteTarget.id)
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Could not delete resource.',
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-2">
        <Spinner animation="border" size="sm" role="status" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="py-1 px-2 small mb-0">
        {error}
      </Alert>
    )
  }

  return (
    <div className={bordered ? 'mt-3 pt-2 border-top' : ''}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold small text-secondary mb-0">{title}</h6>
        {isTeacher && (
          <Button
            variant="outline-primary"
            size="sm"
            className="py-0 px-2 small"
            onClick={() => setFormState({ mode: 'add' })}
          >
            + Add resource
          </Button>
        )}
      </div>

      {resources.length === 0 ? (
        <p className="text-muted small mb-0">No resources yet.</p>
      ) : (
        <ListGroup variant="flush">
          {resources.map((resource) => {
            const isOwner = isTeacher && resource.creatorId === userId
            return (
              <ListGroup.Item
                key={resource.id}
                className="px-0 py-2 bg-transparent border-bottom d-flex justify-content-between align-items-start"
              >
                <div className="me-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-semibold small text-decoration-none d-inline-flex align-items-center gap-1"
                    style={{ color: 'var(--link-color)' }}
                  >
                    <span className="text-break">{resource.displayName}</span>
                    <BoxArrowUpRight size={12} className="flex-shrink-0" />
                  </a>
                  <div className="text-muted small mt-1">
                    Added {new Date(resource.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                {isOwner && (
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="py-0 px-2 small"
                      onClick={() => setFormState({ mode: 'edit', resource })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="py-0 px-2 small"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(resource)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}

      <ResourceFormModal
        show={formState !== null}
        mode={formState?.mode ?? 'add'}
        resource={formState?.resource ?? null}
        courseId={courseId}
        moduleId={moduleId}
        activityId={activityId}
        onHide={() => setFormState(null)}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={deleteTarget !== null}
        title="Delete resource"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong>{deleteTarget?.displayName}</strong>?
          </>
        }
        confirmLabel="Delete"
        busyLabel="Deleting…"
        variant="danger"
        isBusy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default ResourcesSection
