import { useEffect, useState } from 'react'
import { Card, Container, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PlusLg } from 'react-bootstrap-icons'
import { getCourses, getMyCourses } from '../../api/course'
import { deleteCourse } from '../../api/course'
import { useAuth } from '../../auth/AuthContext'
import type { CourseSummary } from '../../types/course'
import CourseGrid from '../../components/courses/CourseGrid'
import DeleteCourseModal from '../../components/courses/DeleteCourseModal'
import { DomainIcon } from '../../components/DomainIcon'

function CoursesView() {
  const [allCourses, setAllCourses] = useState<CourseSummary[]>([])
  const [myCourses, setMyCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<CourseSummary | null>(
    null,
  )

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

  const { role } = useAuth()
  const isStudent = role === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    let ignore = false

    async function fetchCourses() {
      try {
        const [all, mine] = await Promise.all([getCourses(), getMyCourses()])
        if (ignore) return
        setAllCourses(all)
        setMyCourses(mine)
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchCourses()

    return () => {
      ignore = true
    }
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
    <Container className="py-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <DomainIcon type="course" size={28} className="text-primary" />
          <h1 className="h2 mb-0">Courses</h1>
        </div>
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

      <Card className="border-0 shadow-sm">
        <Card.Header as="h2" className="h5 mb-0">
          My courses
        </Card.Header>
        <Card.Body>
          {myCourses.length === 0 ? (
            <p className="text-muted mb-0">
              You are not enrolled in any courses.
            </p>
          ) : (
            <CourseGrid
              courses={myCourses}
              base={base}
              onDeleteRequest={setCourseToDelete}
              isMyCourses={true}
            />
          )}
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm mt-4">
        <Card.Header as="h2" className="h5 mb-0">
          Other courses
        </Card.Header>
        <Card.Body>
          {otherCourses.length === 0 ? (
            <p className="text-muted mb-0">No other courses available.</p>
          ) : (
            <CourseGrid
              courses={otherCourses}
              base={base}
              onDeleteRequest={setCourseToDelete}
              isMyCourses={false}
            />
          )}
        </Card.Body>
      </Card>

      <DeleteCourseModal
        isDeleting={isDeleting}
        deleteError={deleteError}
        handleConfirmDelete={handleConfirmDelete}
        courseToDelete={courseToDelete}
        setCourseToDelete={setCourseToDelete}
      />
    </Container>
  )
}

export default CoursesView
