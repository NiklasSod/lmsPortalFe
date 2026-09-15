import { useState } from 'react'
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap'
import type { CourseSummary } from '../../types/course'
import ClampedText from '../ClampedText'
import PaginationControls from '../PaginationControls'

interface CoursesCardProps {
  courses: CourseSummary[]
  loading: boolean
  error: string | null
}

const PAGE_SIZE = 3

const CoursesCard = ({ courses, loading, error }: CoursesCardProps) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(courses.length / PAGE_SIZE))
  const currentCourses = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header as="h2" className="h5 mb-0">
        My courses
      </Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" size="sm" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-muted mb-0">
            You are not enrolled in any courses yet.
          </p>
        )}
        {!loading && !error && courses.length > 0 && (
          <>
            <Row xs={1} md={2} lg={3} className="g-3">
              {currentCourses.map((course) => (
                <Col key={course.id}>
                  <Card className="h-100 border shadow-sm">
                    <Card.Body>
                      <Card.Title className="h6 mb-2">{course.name}</Card.Title>
                      <ClampedText
                        text={course.description}
                        className="text-muted small mb-2"
                      />
                      <Card.Text className="text-muted small mb-0">
                        {new Date(course.startDate).toLocaleDateString()} -{' '}
                        {new Date(course.endDate).toLocaleDateString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <PaginationControls
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default CoursesCard
