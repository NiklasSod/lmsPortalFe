import { useEffect, useState } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PlusLg } from 'react-bootstrap-icons'
import { getCourses, getMyCourses } from '../../api/course'
import { deleteCourse } from '../../api/course'
import { useAuth } from '../../auth/AuthContext'
import type { CourseSummary } from '../../types/course'
import CourseGrid from '../../components/courses/CourseGrid'
import DeleteCourseModal from '../../components/courses/DeleteCourseModal'

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
          isMyCourses={true}
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
          isMyCourses={false}
        />
      )}

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
