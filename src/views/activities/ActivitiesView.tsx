import React, { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Form,
  Button,
  Modal,
} from 'react-bootstrap'
import { ListCheck, BoxArrowUpRight } from 'react-bootstrap-icons'
import { getMineActivities, getAllActivities } from '../../api/activity'
import {
  getActivityResources,
  createActivityResource,
  updateActivityResource,
  deleteActivityResource,
  formatResourceTitle,
} from '../../api/resource'
import { useAuth } from '../../auth/AuthContext'
import type { Activity } from '../../types/activity'
import type { ModuleResource } from '../../types/resource'

function formatActivityDate(act: Activity) {
  const startDateObj = act.startDate ? new Date(act.startDate) : null
  const endDateObj = act.endDate ? new Date(act.endDate) : null

  const start =
    startDateObj && !isNaN(startDateObj.getTime())
      ? startDateObj.toLocaleDateString()
      : ''
  const end =
    endDateObj && !isNaN(endDateObj.getTime())
      ? endDateObj.toLocaleDateString()
      : ''

  if (start && end && start !== end) {
    return `Occurs: ${start} – ${end}`
  }

  return start || end ? `Occurs: ${start || end}` : 'Occurs: -'
}

function getStartOfWeek(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)

  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)

  return result
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function activityWithinRange(activity: Activity, start: Date, end: Date) {
  const startDate = activity.startDate ? new Date(activity.startDate) : null
  const endDate = activity.endDate ? new Date(activity.endDate) : null

  if (
    startDate &&
    !isNaN(startDate.getTime()) &&
    startDate >= start &&
    startDate <= end
  ) {
    return true
  }

  if (
    endDate &&
    !isNaN(endDate.getTime()) &&
    endDate >= start &&
    endDate <= end
  ) {
    return true
  }

  if (
    startDate &&
    endDate &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime())
  ) {
    return startDate <= end && endDate >= start
  }

  return false
}

function sortActivities(activities: Activity[]) {
  return [...activities].sort((a, b) => {
    const aDate = a.startDate
      ? new Date(a.startDate).getTime()
      : Number.MAX_SAFE_INTEGER
    const bDate = b.startDate
      ? new Date(b.startDate).getTime()
      : Number.MAX_SAFE_INTEGER
    return aDate - bDate
  })
}

export const ActivitiesView: React.FC = () => {
  const { userId } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [activityResourcesMap, setActivityResourcesMap] = useState<
    Record<number, ModuleResource[]>
  >({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'next'>('this')
  const [selectedTypeBySection, setSelectedTypeBySection] = useState<{
    thisWeek: string
    allActivities: string
  }>({
    thisWeek: 'All',
    allActivities: 'All',
  })

  const [resModalState, setResModalState] = useState<{
    show: boolean
    mode: 'add' | 'edit'
    activityId?: number
    resource?: ModuleResource
  }>({ show: false, mode: 'add' })

  const [resFormData, setResFormData] = useState({
    name: '',
    description: '',
    url: '',
  })

  const [savingRes, setSavingRes] = useState(false)
  const [resFormError, setResFormError] = useState<string | null>(null)
  const [deletingResId, setDeletingResId] = useState<number | null>(null)

  const loadSingleActivityResources = async (actId: number) => {
    try {
      const resList = await getActivityResources(actId)
      setActivityResourcesMap((prev) => ({
        ...prev,
        [actId]: resList,
      }))
    } catch {
      // ignore
    }
  }

  const openAddResource = (activityId: number) => {
    setResFormData({ name: '', description: '', url: '' })
    setResFormError(null)
    setResModalState({ show: true, mode: 'add', activityId })
  }

  const openEditResource = (res: ModuleResource, activityId: number) => {
    setResFormData({
      name: res.name || res.title || res.resourceName || '',
      description: res.description || '',
      url: res.url || '',
    })
    setResFormError(null)
    setResModalState({ show: true, mode: 'edit', activityId, resource: res })
  }

  const handleResourceSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setResFormError(null)

    const actId = resModalState.activityId
    if (!actId) return

    try {
      setSavingRes(true)
      if (resModalState.mode === 'add') {
        await createActivityResource(
          actId,
          {
            name: resFormData.name.trim(),
            description: resFormData.description.trim(),
            url: resFormData.url.trim(),
          },
          userId,
        )
      } else if (resModalState.mode === 'edit' && resModalState.resource) {
        await updateActivityResource(
          resModalState.resource.id,
          actId,
          {
            name: resFormData.name.trim(),
            description: resFormData.description.trim(),
            url: resFormData.url.trim(),
          },
        )
      }

      setResModalState({ show: false, mode: 'add' })
      loadSingleActivityResources(actId)
    } catch (err) {
      setResFormError(
        err instanceof Error ? err.message : 'Could not save resource.',
      )
    } finally {
      setSavingRes(false)
    }
  }

  const handleResourceDelete = async (id: number, actId: number) => {
    try {
      setDeletingResId(id)
      await deleteActivityResource(id, actId)
      loadSingleActivityResources(actId)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete resource.',
      )
    } finally {
      setDeletingResId(null)
    }
  }

  useEffect(() => {
    async function fetchActivities() {
      try {
        let data = await getMineActivities().catch(() => [])

        if (data.length === 0) {
          data = await getAllActivities().catch(() => [])
        }

        setActivities(data)

        // Fetch activity resources in parallel
        const map: Record<number, ModuleResource[]> = {}
        await Promise.all(
          data.map(async (act) => {
            const res = await getActivityResources(act.id).catch(() => [])
            if (res.length > 0) {
              map[act.id] = res
            }
          }),
        )
        setActivityResourcesMap(map)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const weeklySchedule = useMemo(() => {
    const now = new Date()
    const thisWeekStart = getStartOfWeek(now)
    const thisWeekEnd = addDays(thisWeekStart, 6)
    const nextWeekStart = addDays(thisWeekStart, 7)
    const nextWeekEnd = addDays(nextWeekStart, 6)

    return {
      thisWeek: sortActivities(
        activities.filter((activity) =>
          activityWithinRange(activity, thisWeekStart, thisWeekEnd),
        ),
      ),
      nextWeek: sortActivities(
        activities.filter((activity) =>
          activityWithinRange(activity, nextWeekStart, nextWeekEnd),
        ),
      ),
    }
  }, [activities])

  const activityTypeOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          activities
            .map((activity) => activity.type?.trim())
            .filter((type): type is string => Boolean(type)),
        ),
      ),
    ],
    [activities],
  )

  const filterActivitiesByType = (items: Activity[], type: string) =>
    type === 'All' ? items : items.filter((activity) => activity.type === type)

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  const renderActivityList = (items: Activity[], emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <div className="d-flex justify-content-start">
          <Alert
            variant="light"
            className="mb-0 w-auto border-0 shadow-none text-body"
            style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}
          >
            {emptyMessage}
          </Alert>
        </div>
      )
    }

    return (
      <Row xs={1} md={2} lg={3} className="g-3">
        {items.map((activity) => {
          const resList = activityResourcesMap[activity.id] || []

          return (
            <Col key={activity.id}>
              <Card className="h-100 border shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h5 mb-0">{activity.name}</Card.Title>
                    {activity.type && (
                      <Badge bg="secondary" className="ms-2">
                        {activity.type}
                      </Badge>
                    )}
                  </div>
                  {activity.description && (
                    <Card.Text className="text-body-secondary small mb-2">
                      {activity.description}
                    </Card.Text>
                  )}

                  <div className="mt-2 pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold small text-body">
                        Resources ({resList.length})
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-primary small text-decoration-none fw-medium"
                        onClick={() => openAddResource(activity.id)}
                      >
                        + Add
                      </Button>
                    </div>

                    {resList.length > 0 && (
                      <div className="d-flex flex-column gap-1 mt-1">
                        {resList.map((res) => {
                          const title = formatResourceTitle(res)

                          return (
                            <div
                              key={res.id}
                              className="py-1 border-bottom border-light-subtle d-flex justify-content-between align-items-start gap-1"
                            >
                              <div className="pe-1 min-w-0 flex-grow-1">
                                {res.url ? (
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="fw-semibold small text-body text-decoration-none d-inline-flex align-items-center gap-1"
                                  >
                                    {title} <BoxArrowUpRight size={10} />
                                  </a>
                                ) : (
                                  <span className="fw-semibold small text-body">
                                    {title}
                                  </span>
                                )}
                                {res.description && (
                                  <div className="text-body-secondary small">
                                    {res.description}
                                  </div>
                                )}
                              </div>

                              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 text-body-secondary small text-decoration-none"
                                  style={{ fontSize: '0.75rem' }}
                                  onClick={() => openEditResource(res, activity.id)}
                                >
                                  Edit
                                </Button>
                                <span className="text-body-secondary small" style={{ fontSize: '0.75rem' }}>·</span>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 text-danger small text-decoration-none"
                                  style={{ fontSize: '0.75rem' }}
                                  disabled={deletingResId === res.id}
                                  onClick={() => handleResourceDelete(res.id, activity.id)}
                                >
                                  {deletingResId === res.id ? '…' : 'Delete'}
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <Card.Text className="text-body-secondary small mb-0 mt-auto pt-2">
                    {formatActivityDate(activity)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <ListCheck size={28} className="text-body" />
        <h1 className="h2 mb-0">Activities</h1>
      </div>

      <p className="text-muted mb-4">
        Overview of your upcoming and ongoing course activities.
      </p>

      {activities.length === 0 ? (
        <Alert variant="info">No activities found.</Alert>
      ) : (
        <>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="d-flex align-items-center justify-content-between p-0 border-0 border-bottom border-light-subtle">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className={`btn btn-link text-decoration-none fw-semibold px-3 py-2 ${
                    selectedWeek === 'this' ? 'text-body' : 'text-muted'
                  }`}
                  onClick={() => setSelectedWeek('this')}
                >
                  This week
                </button>
                <div
                  className="border-start border-secondary"
                  style={{ height: '1.5rem' }}
                />
                <button
                  type="button"
                  className={`btn btn-link text-decoration-none fw-semibold px-3 py-2 ${
                    selectedWeek === 'next' ? 'text-body' : 'text-muted'
                  }`}
                  onClick={() => setSelectedWeek('next')}
                >
                  Next week
                </button>
              </div>

              <Form.Select
                size="sm"
                className="w-auto me-3"
                value={selectedTypeBySection.thisWeek}
                onChange={(event) =>
                  setSelectedTypeBySection((prev) => ({
                    ...prev,
                    thisWeek: event.target.value,
                  }))
                }
                aria-label="Filter this week activities"
              >
                {activityTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Card.Header>
            <Card.Body>
              {renderActivityList(
                filterActivitiesByType(
                  selectedWeek === 'this'
                    ? weeklySchedule.thisWeek
                    : weeklySchedule.nextWeek,
                  selectedTypeBySection.thisWeek,
                ),
                selectedWeek === 'this'
                  ? 'No activities scheduled for this week.'
                  : 'No activities scheduled for next week.',
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="d-flex align-items-center justify-content-between p-0 border-0 border-bottom border-light-subtle">
              <div className="h5 mb-0 px-3 py-2">All activities</div>
              <Form.Select
                size="sm"
                className="w-auto me-3"
                value={selectedTypeBySection.allActivities}
                onChange={(event) =>
                  setSelectedTypeBySection((prev) => ({
                    ...prev,
                    allActivities: event.target.value,
                  }))
                }
                aria-label="Filter all activities"
              >
                {activityTypeOptions.map((type) => (
                  <option key={`${type}-all`} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Card.Header>
            <Card.Body>
              {renderActivityList(
                sortActivities(
                  filterActivitiesByType(
                    activities,
                    selectedTypeBySection.allActivities,
                  ),
                ),
                'No activities found.',
              )}
            </Card.Body>
          </Card>
        </>
      )}

      {/* Resource Add/Edit Modal */}
      <Modal
        show={resModalState.show}
        onHide={() => setResModalState({ show: false, mode: 'add' })}
        centered
      >
        <Form onSubmit={handleResourceSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="h5">
              {resModalState.mode === 'add'
                ? 'Add Resource'
                : 'Edit Resource'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resFormError && <Alert variant="danger">{resFormError}</Alert>}
            <Form.Group className="mb-3" controlId="actResName">
              <Form.Label>Resource Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Activity guide, Lecture slides, Exercise sheet"
                value={resFormData.name}
                onChange={(e) =>
                  setResFormData({ ...resFormData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actResDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Brief description of the resource"
                value={resFormData.description}
                onChange={(e) =>
                  setResFormData({ ...resFormData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actResUrl">
              <Form.Label>URL / Link (optional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={resFormData.url}
                onChange={(e) =>
                  setResFormData({ ...resFormData, url: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setResModalState({ show: false, mode: 'add' })}
              disabled={savingRes}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={savingRes}
            >
              {savingRes
                ? 'Saving…'
                : resModalState.mode === 'add'
                  ? 'Add Resource'
                  : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default ActivitiesView
