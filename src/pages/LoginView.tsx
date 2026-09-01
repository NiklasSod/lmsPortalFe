import React, { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = 'Invalid email or password.'
        try {
          const data = await response.json()
          if (typeof data === 'string') errorMessage = data
          else if (data?.message) errorMessage = data.message
        } catch {
          const text = await response.text()
          if (text) errorMessage = text
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      console.log('Login successful!', {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

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
            backgroundColor: '#ccc',
            border: '1px solid #aaa',
            borderRadius: '4px',
          }}
        />
        <span
          className="fw-bold fs-5 tracking-wide"
          style={{ letterSpacing: '0.5px' }}
        >
          LEXICON
        </span>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 className="text-center fw-bold mb-4 fs-3">Log In</h1>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label className="fw-normal text-secondary mb-1 small">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Value"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-3 shadow-none border-secondary-subtle"
                style={{ borderRadius: '6px' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label className="fw-normal text-secondary mb-1 small">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Value"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-3 shadow-none border-secondary-subtle"
                style={{ borderRadius: '6px' }}
                required
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              disabled={isLoading}
              className="w-100 py-2 mt-2 mb-3 fw-medium"
              style={{
                backgroundColor: '#2a2a2a',
                borderColor: '#2a2a2a',
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
                className="text-dark text-decoration-underline small"
              >
                Forgot password?
              </Link>
              <Link
                to="/create-account"
                className="text-dark text-decoration-underline small"
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
