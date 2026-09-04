import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Container,
  ListGroup,
  Alert,
  Breadcrumb,
  Row,
  Col,
  Spinner,
  Button,
} from 'react-bootstrap'
import { getCourseById, enrollInCourse } from '../api/course'
import { getModulesByCourse } from '../api/module'
import { useAuth } from '../auth/AuthContext'
import type { Course } from '../types/course'
import type { CourseModule } from '../types/module'
import CourseSections from '../components/CourseSections'
import ModuleFormModal from '../components/modules/ModuleFormModal'

export const CourseModulesView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notEnrolled, setNotEnrolled] = useState<boolean>(false)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [enrollError, setEnrollError] = useState<string | null>(null)
  const [showAddModule, setShowAddModule] = useState<boolean>(false)

  const { role } = useAuth()
  const isStudent = role === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return
      try {
        setLoading(true)
        setError(null)
        setNotEnrolled(false)

        const data = await getCourseById(courseId)
        setCourse(data)

        try {
          const courseModules = await getModulesByCourse(Number(courseId))
          setModules(courseModules)
        } catch (err) {
          if (err instanceof Error && /403/.test(err.message)) {
            setNotEnrolled(true)
          } else {
            setError(
              err instanceof Error
                ? err.message
                : 'Failed to load course modules.',
            )
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load course overview.',
        )
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  const handleEnroll = async () => {
    if (!courseId) return
    try {
      setEnrolling(true)
      setEnrollError(null)
      await enrollInCourse(Number(courseId))
      const courseModules = await getModulesByCourse(Number(courseId))
      setModules(courseModules)
      setNotEnrolled(false)
    } catch (err) {
      setEnrollError(
        err instanceof Error ? err.message : 'Could not enroll in course.',
      )
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  if (error || !course) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Course not found.'}</Alert>
        <Link to={base}>Back to course list</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: base }}
          style={{ color: 'var(--link-color)' }}
        >
          Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `${base}/${course.id}` }}
          style={{ color: 'var(--link-color)' }}
        >
          {course.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>
          Modules
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h6 fw-semibold mb-0">Modules</h2>
            {!isStudent && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModule(true)}
              >
                Add module
              </Button>
            )}
          </div>
          {notEnrolled ? (
            <Alert variant="info">
              <p className="mb-2">You are not enrolled in this course.</p>
              {enrollError && (
                <Alert variant="danger" className="py-2">
                  {enrollError}
                </Alert>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling…' : 'Enroll in course'}
              </Button>
            </Alert>
          ) : (
            <ListGroup>
              {modules.length > 0 ? (
                modules.map((module) => (
                  <ListGroup.Item key={module.id} className="py-3">
                    <div className="fw-semibold">{module.name}</div>
                    <div className="text-muted small">{module.description}</div>
                    <div className="text-muted small mt-1">
                      {new Date(module.startDate).toLocaleDateString()} -{' '}
                      {new Date(module.endDate).toLocaleDateString()}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted">
                  No modules found for this course.
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <CourseSections courseId={String(course.id)} />
        </Col>
      </Row>

      <ModuleFormModal
        courseId={course.id}
        show={showAddModule}
        onHide={() => setShowAddModule(false)}
        onCreated={(created) => setModules((prev) => [...prev, created])}
      />
    </Container>
  )
}

export default CourseModulesView
