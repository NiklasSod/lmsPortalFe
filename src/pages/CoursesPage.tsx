import { useEffect, useState } from 'react'
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Alert,
  Button,
  Modal,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PlusLg } from 'react-bootstrap-icons'
import { getCourses, getMyCourses, deleteCourse } from '../api/course'
import { getRole } from '../api/auth'
import type { CourseSummary } from '../types/course'

interface CourseGridProps {
  courses: CourseSummary[]
  base: string
  onDeleteRequest?: (course: CourseSummary) => void
}

function CourseGrid({ courses, base, onDeleteRequest }: CourseGridProps) {
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
                {new Date(course.startDate).toLocaleDateString()} –{' '}
                {new Date(course.endDate).toLocaleDateString()}
              </Card.Text>
            </Card.Body>

            {isTeacher && (
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

function CoursesPage() {
  const [allCourses, setAllCourses] = useState<CourseSummary[]>([])
  const [myCourses, setMyCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [courseToDelete, setCourseToDelete] = useState<CourseSummary | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return
    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteCourse(courseToDelete.id)

      setAllCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setMyCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setCourseToDelete(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDeleteError(err.message)
      } else {
        setDeleteError('Could not delete course.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

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
    <Container className="py-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Courses</h1>
        {!isStudent && (
          <Link
            to="/teacher/courses/create"
            className="btn d-flex align-items-center gap-2 fw-medium"
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
              borderColor: 'var(--btn-bg)',
              borderRadius: '6px',
            }}
          >
            <PlusLg /> Create Course
          </Link>
        )}
      </div>

      <h2 className="h3">My courses</h2>
      {myCourses.length === 0 ? (
        <p className="text-muted">You are not enrolled in any courses.</p>
      ) : (
        <CourseGrid
          courses={myCourses}
          base={base}
          onDeleteRequest={setCourseToDelete}
        />
      )}

      <h2 className="h3 mt-5">Other courses</h2>
      {otherCourses.length === 0 ? (
        <p className="text-muted">No other courses available.</p>
      ) : (
        <CourseGrid
          courses={otherCourses}
          base={base}
          onDeleteRequest={setCourseToDelete}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(courseToDelete)}
        onHide={() => setCourseToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete{' '}
          <strong>{courseToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setCourseToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />{' '}
                Deleting...
              </>
            ) : (
              'Delete Course'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CoursesPage
