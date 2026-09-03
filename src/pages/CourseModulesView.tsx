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
} from 'react-bootstrap'
import { getCourseById } from '../api/course'
import { getRole } from '../api/auth'
import type { Course } from '../types/course'
import CourseSections from '../components/CourseSections'

export const CourseModulesView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isStudent = getRole() === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return
      try {
        setLoading(true)
        const data = await getCourseById(courseId)
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course modules.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

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
          <ListGroup>
            <ListGroup.Item variant="secondary" className="fw-semibold">
              Modules
            </ListGroup.Item>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module) => (
                <ListGroup.Item key={module.id} className="py-3">
                  <div className="fw-semibold">{module.name}</div>
                  <div className="text-muted small">{module.description}</div>
                  <div className="text-muted small mt-1">
                    {new Date(module.startDate).toLocaleDateString()} - {new Date(module.endDate).toLocaleDateString()}
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-muted">
                No modules found for this course.
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        <Col md={4}>
          <CourseSections courseId={String(course.id)} />
        </Col>
      </Row>
    </Container>
  )
}

export default CourseModulesView