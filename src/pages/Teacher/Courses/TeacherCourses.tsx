import { Fragment, useEffect, useState } from 'react'
import { Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getTeacherCourses } from '../../../api/course'
import type { CourseSummary } from '../../../types/course'

function TeacherCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const data = await getTeacherCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="h2">My courses</h1>
      <Row xs={1} md={2} lg={4} className="g-3">
        {courses.map((course, index) => (
          <Fragment key={course.id}>
            <Col>
              <Card
                as={Link}
                to={`/teacher/courses/${course.id}`}
                className="h-100 text-decoration-none text-reset"
              >
                <Card.Body>
                  <Card.Title className="h5">{course.name}</Card.Title>
                  <Card.Text className="text-muted small">
                    {course.description}
                  </Card.Text>
                  <Card.Text className="text-muted small mb-0">
                    {new Date(course.startDate).toLocaleDateString()} –{' '}
                    {new Date(course.endDate).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {(index + 1) % 3 === 0 && (
              <div className="w-100 d-none d-lg-block" />
            )}
          </Fragment>
        ))}
      </Row>
    </Container>
  )
}

export default TeacherCourses
