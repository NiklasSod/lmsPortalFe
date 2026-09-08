import React, { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap'
import { ListCheck } from 'react-bootstrap-icons'
import { getMineActivities, getAllActivities } from '../../api/activity'
import type { Activity } from '../../types/activity'

function formatActivityDate(act: Activity) {
  const startDateObj = act.startDate ? new Date(act.startDate) : null
  const endDateObj = act.endDate ? new Date(act.endDate) : null

  const start = startDateObj && !isNaN(startDateObj.getTime()) ? startDateObj.toLocaleDateString() : ''
  const end = endDateObj && !isNaN(endDateObj.getTime()) ? endDateObj.toLocaleDateString() : ''

  if (start && end && start !== end) {
    return `Occurs: ${start} – ${end}`
  }

  return start || end ? `Occurs: ${start || end}` : 'Occurs: -'
}

export const ActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <ListCheck size={28} className="text-primary" />
        <h1 className="h2 mb-0">Activities</h1>
      </div>

      <p className="text-muted mb-4">
        Overview of your upcoming and ongoing course activities.
      </p>

      {activities.length === 0 ? (
        <Alert variant="info">No activities found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {activities.map((activity) => (
            <Col key={activity.id}>
              <Card className="h-100 border-0 shadow-sm">
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
                  <Card.Text className="text-muted small mb-0 mt-auto">
                    {formatActivityDate(activity)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default ActivitiesView
