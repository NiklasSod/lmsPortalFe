import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Container,
  Alert,
  Breadcrumb,
  Row,
  Col,
  Spinner,
  Card,
} from 'react-bootstrap'
import { getCourseById } from '../api/course'
import { getRole } from '../api/auth'
import type { Course } from '../types/course'
import CourseSections from '../components/CourseSections'

export const CourseOverviewView: React.FC = () => {
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
        setError(err instanceof Error ? err.message : 'Failed to load course overview.')
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
          Overview
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="h3 mb-2">{course.name}</Card.Title>
              <Card.Text className="text-muted small mb-3">
                {new Date(course.startDate).toLocaleDateString()} –{' '}
                {new Date(course.endDate).toLocaleDateString()}
              </Card.Text>
              <Card.Text>{course.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <CourseSections courseId={String(course.id)} />
        </Col>
      </Row>
    </Container>
  )
}

export default CourseOverviewView