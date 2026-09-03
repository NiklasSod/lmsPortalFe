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
import { getCourseById } from '../api/course'
import type { CourseDetail, CourseEnrollment } from '../types/course'
import CourseSections from '../components/CourseSections'

function CourseMembersPage() {
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

  const teachers = course.enrollments.filter((e) => e.role === 'Teacher')
  const students = course.enrollments.filter((e) => e.role === 'Student')

  const renderMember = (member: CourseEnrollment) => (
    <ListGroup.Item key={member.userId}>
      <div className="fw-semibold">
        {member.firstName} {member.lastName}
      </div>
      <div className="text-muted">{member.email}</div>
    </ListGroup.Item>
  )

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
          <ListGroup>
            <ListGroup.Item variant="secondary" className="fw-semibold">
              Teachers
            </ListGroup.Item>
            {teachers.length === 0 ? (
              <ListGroup.Item className="text-muted">
                No teachers listed.
              </ListGroup.Item>
            ) : (
              teachers.map(renderMember)
            )}
          </ListGroup>

          <ListGroup className="mt-3">
            <ListGroup.Item variant="secondary" className="fw-semibold">
              Students
            </ListGroup.Item>
            {students.length === 0 ? (
              <ListGroup.Item className="text-muted">
                No students enrolled.
              </ListGroup.Item>
            ) : (
              students.map(renderMember)
            )}
          </ListGroup>
        </Col>

        <Col md={4}>
          <CourseSections courseId={course.id.toString()} />
        </Col>
      </Row>
    </Container>
  )
}

export default CourseMembersPage
