import { useEffect, useState } from 'react'
import {
  Alert,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Clock } from 'react-bootstrap-icons'
import { getCurrentAssignments } from '../../api/assignment'
import { getMyCourses } from '../../api/course'
import { getCurrentModules } from '../../api/module'
import type { Assignment } from '../../types/assignment'
import type { CourseSummary } from '../../types/course'
import type { CourseModule } from '../../types/module'
import { useAuth } from '../../auth/AuthContext'

type Deadline = {
  id: number
  assignmentTitle: string
  dueAt: Date
}

function mapToDeadline(assignment: Assignment): Deadline {
  return {
    id: assignment.id,
    assignmentTitle: assignment.name,
    dueAt: new Date(assignment.dueDate),
  }
}

function formatDueDate(deadline: Deadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function DashboardView() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modules, setModules] = useState<CourseModule[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [modulesError, setModulesError] = useState<string | null>(null)

  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [deadlinesLoading, setDeadlinesLoading] = useState(false)
  const [deadlinesError, setDeadlinesError] = useState<string | null>(null)

  const { role } = useAuth()

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getCurrentModules()
      .then(setModules)
      .catch((err: Error) => setModulesError(err.message))
      .finally(() => setModulesLoading(false))
  }, [])

  useEffect(() => {
    if (role !== 'student') return

    getCurrentAssignments()
      .then((data) => setDeadlines(data.map(mapToDeadline)))
      .catch((err: Error) => setDeadlinesError(err.message))
      .finally(() => setDeadlinesLoading(false))
  }, [role])

  if (role === null) return

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">
        {role.charAt(0).toUpperCase() + role.slice(1)} dashboard
      </h1>

      <Row className="g-4 align-items-start">
        <Col lg={role === 'student' ? 8 : 12}>
          <Card className="border-0 shadow-sm">
            <Card.Header as="h2" className="h5 mb-0">
              My courses
            </Card.Header>
            <Card.Body>
              {loading && <Spinner animation="border" size="sm" />}
              {error && <Alert variant="danger">{error}</Alert>}
              {!loading && !error && courses.length === 0 && (
                <p className="text-muted mb-0">
                  You are not enrolled in any courses yet.
                </p>
              )}
              {!loading && !error && courses.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {courses.map((course) => (
                    <Col key={course.id}>
                      <Card className="h-100 border shadow-sm">
                        <Card.Body>
                          <Card.Title className="h6 mb-2">
                            {course.name}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-2">
                            {course.description}
                          </Card.Text>
                          <Card.Text className="text-muted small mb-0">
                            {new Date(course.startDate).toLocaleDateString()} -{' '}
                            {new Date(course.endDate).toLocaleDateString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-4">
            <Card.Header as="h2" className="h5 mb-0">
              Current modules
            </Card.Header>
            <Card.Body>
              {modulesLoading && <Spinner animation="border" size="sm" />}
              {modulesError && <Alert variant="danger">{modulesError}</Alert>}
              {!modulesLoading && !modulesError && modules.length === 0 && (
                <p className="text-muted mb-0">You have no current modules.</p>
              )}
              {!modulesLoading && !modulesError && modules.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {modules.map((module) => (
                    <Col key={module.id}>
                      <Card className="h-100 border shadow-sm">
                        <Card.Body>
                          <Card.Title className="h6 mb-2">
                            {module.name}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-2">
                            {module.description}
                          </Card.Text>
                          <Card.Text className="text-muted small mb-0">
                            {new Date(module.startDate).toLocaleDateString()} -{' '}
                            {new Date(module.endDate).toLocaleDateString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        {role === 'student' && (
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header as="h2" className="h5 mb-0">
                Assignment deadlines
              </Card.Header>
              {deadlinesLoading && (
                <Card.Body>
                  <Spinner animation="border" size="sm" />
                </Card.Body>
              )}
              {deadlinesError && (
                <Card.Body>
                  <Alert variant="danger" className="mb-0">
                    {deadlinesError}
                  </Alert>
                </Card.Body>
              )}
              {!deadlinesLoading && !deadlinesError && (
                <ListGroup variant="flush">
                  {deadlines.length === 0 && (
                    <ListGroup.Item className="text-muted">
                      No upcoming assignments.
                    </ListGroup.Item>
                  )}
                  {deadlines.map((deadline) => (
                    <ListGroup.Item key={deadline.id} className="py-3">
                      <div className="fw-semibold">
                        {deadline.assignmentTitle}
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2 text-muted">
                        <Clock aria-hidden="true" />
                        <span>Due {formatDueDate(deadline)}</span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default DashboardView
