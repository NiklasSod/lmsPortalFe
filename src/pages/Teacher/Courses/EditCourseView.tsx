import React, { useEffect, useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourseById, updateCourse } from '../../../api/course'

export default function EditCourseView() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return
      try {
        setIsFetching(true)
        setError(null)
        const course = await getCourseById(courseId)
        setName(course.name || '')
        setDescription(course.description || '')
        setStartDate(
          course.startDate ? course.startDate.split('T')[0] : '',
        )
        setEndDate(
          course.endDate ? course.endDate.split('T')[0] : '',
        )
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Could not load course details.')
        }
      } finally {
        setIsFetching(false)
      }
    }

    loadCourse()
  }, [courseId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!courseId) {
      setError('Course ID is missing.')
      return
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.')
      return
    }

    setIsLoading(true)

    try {
      await updateCourse(courseId, {
        name,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
      })

      setSuccess('Course updated successfully!')
      setTimeout(() => {
        navigate('/teacher/courses')
      }, 1200)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not update course.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" role="status" />
      </div>
    )
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-4">
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1
            className="text-center fw-bold mb-4 fs-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Edit Course
          </h1>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              onClose={() => setSuccess(null)}
              dismissible
            >
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="courseName">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Course Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2 px-3 shadow-none"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="courseDescription">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-2 px-3 shadow-none"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="courseStartDate">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Start Date
              </Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-2 px-3 shadow-none"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="courseEndDate">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                End Date
              </Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-2 px-3 shadow-none"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                }}
                required
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              disabled={isLoading}
              className="w-100 py-2 mt-2 mb-3 fw-medium"
              style={{
                backgroundColor: 'var(--btn-bg)',
                borderColor: 'var(--btn-bg)',
                color: 'var(--btn-text)',
                borderRadius: '6px',
              }}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/teacher/courses"
                className="text-decoration-underline small"
                style={{ color: 'var(--link-color)' }}
              >
                Back to Courses
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  )
}
