import React, { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

export default function CreateCourseView() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.')
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          description,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Could not create course.'
        const text = await response.text()
        if (text) {
          try {
            const data = JSON.parse(text)
            if (typeof data === 'string') errorMessage = data
            else if (data?.message) errorMessage = data.message
            else if (data?.title) errorMessage = data.title
          } catch {
            errorMessage = text
          }
        }
        throw new Error(errorMessage)
      }

      setSuccess('Course created successfully!')
      setName('')
      setDescription('')
      setStartDate('')
      setEndDate('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not connect to server.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <header className="p-4 d-flex align-items-center gap-2">
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--logo-bg)',
            border: '1px solid var(--logo-border)',
            borderRadius: '4px',
          }}
        />
        <span
          className="fw-bold fs-5 tracking-wide"
          style={{ letterSpacing: '0.5px', color: 'var(--text-primary)' }}
        >
          LEXICON
        </span>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-4">
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1
            className="text-center fw-bold mb-4 fs-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Create Course
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
                  Creating course...
                </>
              ) : (
                'Create Course'
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-decoration-underline small"
                style={{ color: 'var(--link-color)' }}
              >
                Back to Login
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  )
}
