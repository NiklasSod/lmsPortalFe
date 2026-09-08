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
import { Clock, ExclamationTriangle } from 'react-bootstrap-icons'
import { getCurrentAssignments } from '../../api/assignment'
import { getMyCourses } from '../../api/course'
import { getCurrentModules } from '../../api/module'
import type { Assignment } from '../../types/assignment'
import type { CourseSummary } from '../../types/course'
import type { CourseModule } from '../../types/module'

type Deadline = {
  id: number
  moduleId: number
  assignmentTitle: string
  dueAt: Date
}

function mapToDeadline(assignment: Assignment): Deadline {
  return {
    id: assignment.id,
    moduleId: assignment.moduleId,
    assignmentTitle: assignment.name,
    dueAt: new Date(assignment.dueDate),
  }
}

function isDueSoon(deadline: Deadline) {
  const hoursUntilDue =
    (deadline.dueAt.getTime() - Date.now()) / (60 * 60 * 1000)
  return hoursUntilDue >= 0 && hoursUntilDue <= 48
}

function formatDueDate(deadline: Deadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function StudentDashboardView() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState<string | null>(null)

  const [modules, setModules] = useState<CourseModule[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [modulesError, setModulesError] = useState<string | null>(null)

  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [deadlinesLoading, setDeadlinesLoading] = useState(true)
  const [deadlinesError, setDeadlinesError] = useState<string | null>(null)

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch((err: Error) => setCoursesError(err.message))
      .finally(() => setCoursesLoading(false))
  }, [])

  useEffect(() => {
    getCurrentModules()
      .then(setModules)
      .catch((err: Error) => setModulesError(err.message))
      .finally(() => setModulesLoading(false))
  }, [])

  useEffect(() => {
    let cancelled = false

    getCurrentAssignments()
      .then((data) => {
        if (!cancelled) setDeadlines(data.map(mapToDeadline))
      })
      .catch((err: Error) => {
        if (!cancelled) setDeadlinesError(err.message)
      })
      .finally(() => {
        if (!cancelled) setDeadlinesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const upcomingDeadlines = deadlines.filter(isDueSoon)

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Student dashboard</h1>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
          {deadlinesLoading && <Spinner animation="border" size="sm" />}
          {deadlinesError && <Alert variant="danger">{deadlinesError}</Alert>}

          {upcomingDeadlines.map((deadline) => (
            <Alert key={deadline.id} variant="warning">
              <div className="d-flex gap-3">
                <ExclamationTriangle
                  className="flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <Alert.Heading className="h5">
                    Assignment due soon
                  </Alert.Heading>
                  <p className="mb-2">
                    <strong>{deadline.assignmentTitle}</strong>
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <Clock aria-hidden="true" />
                    <span>Due {formatDueDate(deadline)}</span>
                  </div>
                </div>
              </div>
            </Alert>
          ))}

          <Card className="border-0 shadow-sm mb-4">
            <Card.Header as="h2" className="h5 mb-0">
              My courses
            </Card.Header>
            <Card.Body>
              {coursesLoading && <Spinner animation="border" size="sm" />}
              {coursesError && <Alert variant="danger">{coursesError}</Alert>}
              {!coursesLoading && !coursesError && courses.length === 0 && (
                <p className="text-muted mb-0">
                  You are not enrolled in any courses yet.
                </p>
              )}
              {!coursesLoading && !coursesError && courses.length > 0 && (
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
                            {new Date(course.startDate).toLocaleDateString()} –{' '}
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

          <Card className="border-0 shadow-sm mb-4">
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
                            {new Date(module.startDate).toLocaleDateString()} –{' '}
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
      </Row>
    </Container>
  )
}

export default StudentDashboardView
