import React, { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
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

      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1
            className="text-center fw-bold mb-4 fs-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Log In
          </h1>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Value"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label
                className="fw-normal mb-1 small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Value"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="d-flex justify-content-between align-items-center mt-2">
              <Link
                to="/forgot-password"
                className="text-decoration-underline small"
                style={{ color: 'var(--link-color)' }}
              >
                Forgot password?
              </Link>
              <Link
                to="/register"
                className="text-decoration-underline small"
                style={{ color: 'var(--link-color)' }}
              >
                Create Account
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  )
}
