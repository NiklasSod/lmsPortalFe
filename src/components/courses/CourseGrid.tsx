import { Card, Col, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { CourseSummary } from '../../types/course'

interface CourseGridProps {
  courses: CourseSummary[]
  base: string
  onDeleteRequest?: (course: CourseSummary) => void
  isMyCourses: boolean
}

const CourseGrid = ({
  courses,
  base,
  onDeleteRequest,
  isMyCourses,
}: CourseGridProps) => {
  const isTeacher = base.startsWith('/teacher')

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {courses.map((course) => (
        <Col key={course.id}>
          <Card className="h-100 border-0 shadow-sm position-relative">
            <Card.Body
              as={Link}
              to={`${base}/${course.id}`}
              className="text-reset text-decoration-none d-flex flex-column p-3"
            >
              <Card.Title className="h5 pe-5 mb-2">{course.name}</Card.Title>
              <Card.Text className="text-muted small pe-5 mb-3">
                {course.description}
              </Card.Text>
              <Card.Text className="text-muted small pe-5 mb-0 mt-auto">
                {new Date(course.startDate).toLocaleDateString()} -{' '}
                {new Date(course.endDate).toLocaleDateString()}
              </Card.Text>
            </Card.Body>

            {isTeacher && isMyCourses && (
              <>
                <Link
                  to={`${base}/${course.id}/edit`}
                  className="btn btn-sm btn-outline-primary"
                  style={{ position: 'absolute', top: 6, right: 6 }}
                  title="Edit Course"
                >
                  Edit
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{ position: 'absolute', bottom: 6, right: 6 }}
                  onClick={() => onDeleteRequest?.(course)}
                  title="Delete Course"
                >
                  Delete
                </Button>
              </>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default CourseGrid
