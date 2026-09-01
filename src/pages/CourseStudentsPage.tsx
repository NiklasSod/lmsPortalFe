import { Link, useParams } from 'react-router-dom'
import {
  Container,
  ListGroup,
  Alert,
  Breadcrumb,
  Row,
  Col,
} from 'react-bootstrap'
import { getCourseById } from '../data/courses'
import CourseSections from '../components/CourseSections'

function CourseStudentsPage() {
  const { id } = useParams<{ id: string }>()
  const course = id ? getCourseById(id) : undefined

  if (!course) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Course not found.</Alert>
        <Link to="/">Back to course list</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/student/courses' }}>
          Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{course.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          {course.students.length === 0 ? (
            <p>No students are enrolled in this course.</p>
          ) : (
            <ListGroup>
              <ListGroup.Item variant="secondary" className="fw-semibold">
                Students
              </ListGroup.Item>
              {course.students.map((student) => (
                <ListGroup.Item key={student.id}>
                  <div className="fw-semibold">{student.name}</div>
                  <div className="text-muted">{student.email}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <CourseSections courseId={course.id} />
        </Col>
      </Row>
    </Container>
  )
}

export default CourseStudentsPage
