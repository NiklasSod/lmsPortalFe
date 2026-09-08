import { useEffect, useState } from 'react'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { getMyCourses } from '../../api/course'
import { getCurrentModules } from '../../api/module'
import type { CourseSummary } from '../../types/course'
import type { CourseModule } from '../../types/module'
import { useAuth } from '../../auth/AuthContext'

function DashboardView() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modules, setModules] = useState<CourseModule[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [modulesError, setModulesError] = useState<string | null>(null)

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

  if (role === null) return

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">
        {role.charAt(0).toUpperCase() + role.slice(1)} dashboard
      </h1>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
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
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
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
      </Row>
    </Container>
  )
}

export default DashboardView
