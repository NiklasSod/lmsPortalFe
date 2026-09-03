import { Fragment, useEffect, useState } from 'react'
import { Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getCourses, getMyCourses } from '../api/course'
import { getRole } from '../api/auth'
import type { CourseSummary } from '../types/course'

interface CourseGridProps {
  courses: CourseSummary[]
  base: string
}

function CourseGrid({ courses, base }: CourseGridProps) {
  return (
    <Row xs={1} md={2} lg={4} className="g-3">
      {courses.map((course, index) => (
        <Fragment key={course.id}>
          <Col>
            <Card
              as={Link}
              to={`${base}/${course.id}`}
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
          {(index + 1) % 3 === 0 && <div className="w-100 d-none d-lg-block" />}
        </Fragment>
      ))}
    </Row>
  )
}

function CoursesPage() {
  const [allCourses, setAllCourses] = useState<CourseSummary[]>([])
  const [myCourses, setMyCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isStudent = getRole() === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const [all, mine] = await Promise.all([getCourses(), getMyCourses()])
        setAllCourses(all)
        setMyCourses(mine)
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

  const myCourseIds = new Set(myCourses.map((course) => course.id))
  const otherCourses = allCourses.filter(
    (course) => !myCourseIds.has(course.id),
  )

  return (
    <Container className="py-4">
      <h2 className="h3">My courses</h2>
      {myCourses.length === 0 ? (
        <p className="text-muted">You are not enrolled in any courses.</p>
      ) : (
        <CourseGrid courses={myCourses} base={base} />
      )}

      <h2 className="h3 mt-5">Other courses</h2>
      {otherCourses.length === 0 ? (
        <p className="text-muted">No other courses available.</p>
      ) : (
        <CourseGrid courses={otherCourses} base={base} />
      )}
    </Container>
  )
}

export default CoursesPage
