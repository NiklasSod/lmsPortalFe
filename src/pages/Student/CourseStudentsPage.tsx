import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  ListGroup,
  Alert,
  Breadcrumb,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap'
import { getCourseById } from '../../api/course'
import type { CourseDetail } from '../../types/course'
import CourseSections from '../../components/CourseSections'

function CourseStudentsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<CourseDetail | undefined>(undefined)
  const [loading, setLoading] = useState(() => courseId !== undefined)

  useEffect(() => {
    if (!courseId) {
      return
    }

    getCourseById(courseId)
      .then(setCourse)
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (!course) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Course not found.</Alert>
        <Link to="/">Back to course list</Link>
      </Container>
    )
  }

  const students = course.enrollments.filter((e) => e.role === 'Student')

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: '/' }}
          style={{ color: 'var(--link-color)' }}
        >
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>
          {course.name}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          {students.length === 0 ? (
            <p>No students are enrolled in this course.</p>
          ) : (
            <ListGroup>
              <ListGroup.Item variant="secondary" className="fw-semibold">
                Students
              </ListGroup.Item>
              {students.map((student) => (
                <ListGroup.Item key={student.userId}>
                  <div className="fw-semibold">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-muted">{student.email}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <CourseSections courseId={course.id.toString()} />
        </Col>
      </Row>
    </Container>
  )
}

export default CourseStudentsPage
