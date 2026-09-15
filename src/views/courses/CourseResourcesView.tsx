import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Alert, Breadcrumb, Spinner } from 'react-bootstrap'
import { getCourseById } from '../../api/course'
import { useAuth } from '../../auth/AuthContext'
import type { CourseDetail } from '../../types/course'
import ResourcesSection from '../../components/resources/ResourcesSection'

export const CourseResourcesView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { role } = useAuth()
  const isStudent = role === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  useEffect(() => {
    if (!courseId) return
    let ignore = false

    getCourseById(courseId)
      .then((data) => {
        if (!ignore) setCourse(data)
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load course.')
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [courseId])

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  if (error || !course) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Course not found.'}</Alert>
        <Link to={base}>Back to course list</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: base }}
          style={{ color: 'var(--link-color)' }}
        >
          Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `${base}/${course.id}` }}
          style={{ color: 'var(--link-color)' }}
        >
          {course.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>
          Resources
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-semibold mb-0">Course Resources</h2>
      </div>

      <ResourcesSection courseId={course.id} title="Resources" />
    </Container>
  )
}

export default CourseResourcesView
