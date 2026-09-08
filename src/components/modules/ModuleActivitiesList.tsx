import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Badge,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import {
  getModuleActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../../api/activity'
import type { Activity } from '../../types/activity'

interface ModuleActivitiesListProps {
  moduleId: number
}

const ACTIVITY_TYPES = [
  'Lecture',
  'ELearning',
  'Mentorship',
  'Seminar',
  'Practice',
]

function formatActivityDate(act: Activity) {
  const s = act.startDate ? new Date(act.startDate) : null
  const e = act.endDate ? new Date(act.endDate) : null
  const start = s && !isNaN(s.getTime()) ? s.toLocaleDateString() : ''
  const end = e && !isNaN(e.getTime()) ? e.toLocaleDateString() : ''

  if (start && end && start !== end) return `Occurs: ${start} – ${end}`
  return start || end ? `Occurs: ${start || end}` : 'Occurs: -'
}

export function ModuleActivitiesList({ moduleId }: ModuleActivitiesListProps) {
  const { role } = useAuth()
  const isTeacher = role !== 'student'

  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showViewModal, setShowViewModal] = useState<boolean>(false)

  const [modalState, setModalState] = useState<{
    mode: 'add' | 'edit'
    activity?: Activity
  } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Lecture',
    startDate: '',
    endDate: '',
  })

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadActivities = async () => {
    try {
      const data = await getModuleActivities(moduleId)
      const list = Array.isArray(data) ? data : []
      setActivities(
        [...list].sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
        ),
      )
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useEffect(() => {
    let ignore = false
    getModuleActivities(moduleId)
      .then((data) => {
        if (ignore) return
        const list = Array.isArray(data) ? data : []
        setActivities(
          [...list].sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
          ),
        )
      })
      .catch((err) => {
        if (ignore) return
        setError((err as Error).message)
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [moduleId])

  const openAdd = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Lecture',
      startDate: '',
      endDate: '',
    })
    setFormError(null)
    setModalState({ mode: 'add' })
  }

  const openEdit = (act: Activity) => {
    setFormData({
      name: act.name,
      description: act.description || '',
      type: act.type || 'Lecture',
      startDate: act.startDate ? act.startDate.split('T')[0] : '',
      endDate: act.endDate ? act.endDate.split('T')[0] : '',
    })
    setFormError(null)
    setModalState({ mode: 'edit', activity: act })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.startDate || !formData.endDate) {
      setFormError('Please specify both start and end dates.')
      return
    }

    const startD = new Date(formData.startDate)
    const endD = new Date(formData.endDate)

    if (isNaN(startD.getTime()) || isNaN(endD.getTime())) {
      setFormError('Invalid date specified.')
      return
    }

    if (endD <= startD) {
      setFormError('End date must be after start date.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        startDate: startD.toISOString(),
        endDate: endD.toISOString(),
      }

      if (modalState?.mode === 'add') {
        await createActivity({ moduleId, ...payload })
      } else if (modalState?.mode === 'edit' && modalState.activity) {
        await updateActivity(modalState.activity.id, payload)
      }

      setModalState(null)
      loadActivities()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Operation failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteActivity(id)
      loadActivities()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete activity.',
      )
    } finally {
      setDeletingId(null)
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

  const nextActivity = activities[0]

  return (
    <div className="mt-3 pt-2 border-top">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold small text-secondary mb-0">Activities</h6>
        <div className="d-flex gap-2">
          {isTeacher && (
            <Button
              variant="outline-primary"
              size="sm"
              className="py-0 px-2 small"
              onClick={openAdd}
            >
              + Add Activity
            </Button>
          )}
          {activities.length > 0 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none small"
              onClick={() => setShowViewModal(true)}
            >
              View all ({activities.length})
            </Button>
          )}
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="text-muted small mb-0">No activities in this module.</p>
      ) : (
        <ListGroup variant="flush">
          <ListGroup.Item
            key={nextActivity.id}
            className="px-0 py-1 bg-transparent d-flex justify-content-between align-items-start border-0"
          >
            <div>
              <div className="fw-semibold small">{nextActivity.name}</div>
              {nextActivity.description && (
                <div className="text-muted small">
                  {nextActivity.description}
                </div>
              )}
              <div className="text-muted small mt-1">
                {formatActivityDate(nextActivity)}
              </div>
            </div>
            {nextActivity.type && (
              <Badge bg="secondary" className="ms-2">
                {nextActivity.type}
              </Badge>
            )}
          </ListGroup.Item>
        </ListGroup>
      )}

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Module Activities</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {activities.map((act) => (
              <ListGroup.Item
                key={act.id}
                className="px-0 py-2 bg-transparent d-flex justify-content-between align-items-start border-bottom"
              >
                <div>
                  <div className="fw-semibold">{act.name}</div>
                  {act.description && (
                    <div className="text-muted small my-1">
                      {act.description}
                    </div>
                  )}
                  <div className="text-muted small">
                    {formatActivityDate(act)}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {act.type && <Badge bg="secondary">{act.type}</Badge>}
                  {isTeacher && (
                    <>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="py-0 px-2 small"
                        onClick={() => openEdit(act)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="py-0 px-2 small"
                        disabled={deletingId === act.id}
                        onClick={() => handleDelete(act.id)}
                      >
                        {deletingId === act.id ? '…' : 'Delete'}
                      </Button>
                    </>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={Boolean(modalState)}
        onHide={() => setModalState(null)}
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="h5">
              {modalState?.mode === 'add' ? 'Add Activity' : 'Edit Activity'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && (
              <Alert variant="danger" className="py-2">
                {formError}
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="actName">
              <Form.Label>Activity Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actType">
              <Form.Label>Activity Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="actStart">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actEnd">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalState(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving…'
                : modalState?.mode === 'add'
                  ? 'Add Activity'
                  : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ModuleActivitiesList
