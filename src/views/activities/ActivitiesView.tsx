import React, { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Form,
} from 'react-bootstrap'
import { DomainIcon } from '../../components/DomainIcon'
import { getMineActivities, getAllActivities } from '../../api/activity'
import type { Activity } from '../../types/activity'
import PaginationControls from '../../components/PaginationControls'
import ActivityResourcesInline from '../../components/resources/ActivityResourcesInline'

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
    return `Occurs: ${start} - ${end}`
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
  const [activities, setActivities] = useState<Activity[]>([])
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
  const [allActivitiesPage, setAllActivitiesPage] = useState(1)

  useEffect(() => {
    async function fetchActivities() {
      try {
        let data = await getMineActivities().catch(() => [])

        if (data.length === 0) {
          data = await getAllActivities().catch(() => [])
        }

        setActivities(data)
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

  const effectiveWeek =
    selectedWeek === 'this' &&
    weeklySchedule.thisWeek.length === 0 &&
    weeklySchedule.nextWeek.length > 0
      ? 'next'
      : selectedWeek

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

  const allActivities = sortActivities(
    filterActivitiesByType(activities, selectedTypeBySection.allActivities),
  )

  const ALL_ACTIVITIES_PAGE_SIZE = 6
  const allActivitiesPageCount = Math.max(
    1,
    Math.ceil(allActivities.length / ALL_ACTIVITIES_PAGE_SIZE),
  )
  const visibleAllActivities = allActivities.slice(
    (allActivitiesPage - 1) * ALL_ACTIVITIES_PAGE_SIZE,
    allActivitiesPage * ALL_ACTIVITIES_PAGE_SIZE,
  )

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
        {items.map((activity) => (
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
                  <Card.Text className="text-muted small mb-3">
                    {activity.description}
                  </Card.Text>
                )}
                <ActivityResourcesInline activityId={activity.id} />
                <Card.Text className="text-muted small mb-0 mt-auto">
                  {formatActivityDate(activity)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3 mb-3">
        <DomainIcon type="activity" size={28} className="text-primary" />
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
                    effectiveWeek === 'this' ? 'text-body' : 'text-muted'
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
                    effectiveWeek === 'next' ? 'text-body' : 'text-muted'
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
                  effectiveWeek === 'this'
                    ? weeklySchedule.thisWeek
                    : weeklySchedule.nextWeek,
                  selectedTypeBySection.thisWeek,
                ),
                effectiveWeek === 'this'
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
                onChange={(event) => {
                  setSelectedTypeBySection((prev) => ({
                    ...prev,
                    allActivities: event.target.value,
                  }))
                  setAllActivitiesPage(1)
                }}
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
              <Row xs={1} md={2} lg={3} className="g-3">
                {visibleAllActivities.map((activity) => (
                  <Col key={activity.id}>
                    <Card className="h-100 border shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="h5 mb-0">
                            {activity.name}
                          </Card.Title>
                          {activity.type && (
                            <Badge bg="secondary" className="ms-2">
                              {activity.type}
                            </Badge>
                          )}
                        </div>
                        {activity.description && (
                          <Card.Text className="text-muted small mb-3">
                            {activity.description}
                          </Card.Text>
                        )}
                        <ActivityResourcesInline activityId={activity.id} />
                        <Card.Text className="text-muted small mb-0 mt-auto">
                          {formatActivityDate(activity)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <PaginationControls
                page={allActivitiesPage}
                pageCount={allActivitiesPageCount}
                onPageChange={setAllActivitiesPage}
              />
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  )
}

export default ActivitiesView