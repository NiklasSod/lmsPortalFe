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
  Button,
} from 'react-bootstrap'
import { getCourseById, enrollInCourse } from '../api/course'
import { useAuth } from '../auth/AuthContext'
import type { CourseDetail } from '../types/course'
import CourseSections from '../components/CourseSections'

export const CourseOverviewView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolled, setEnrolled] = useState<boolean>(true)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [enrollError, setEnrollError] = useState<string | null>(null)

  const { role, email, userId } = useAuth()
  const isStudent = role === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return
      try {
        setLoading(true)
        const data = await getCourseById(courseId)
        setCourse(data)

        const myEmail = email
        const myUserId = userId
        if (myEmail === null && myUserId === null) {
          setEnrolled(true)
        } else {
          setEnrolled(
            data.enrollments.some(
              (enrollment) =>
                (myEmail !== null && enrollment.email === myEmail) ||
                (myUserId !== null && enrollment.userId === myUserId),
            ),
          )
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
  }, [courseId, email, userId])

  const handleEnroll = async () => {
    if (!course) return
    try {
      setEnrolling(true)
      setEnrollError(null)
      await enrollInCourse(course.id)
      setEnrolled(true)
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
          Overview
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4 position-relative">
            {!enrolled && (
              <Button
                size="sm"
                className="d-flex align-items-center gap-2 fw-medium"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'var(--btn-bg)',
                  color: 'var(--btn-text)',
                  borderColor: 'var(--btn-bg)',
                  borderRadius: '6px',
                }}
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling…' : 'Enroll in course'}
              </Button>
            )}
            <Card.Body>
              <Card.Title className={`h3 mb-2 ${!enrolled ? 'pe-5' : ''}`}>
                {course.name}
              </Card.Title>
              {enrollError && (
                <Alert variant="danger" className="py-2">
                  {enrollError}
                </Alert>
              )}
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
