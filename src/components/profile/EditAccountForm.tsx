import { useState } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { updateAccount } from '../../api/user'
import type { UserDto } from '../../api/user'

interface EditAccountFormProps {
  user: UserDto
  onUpdated: (user: UserDto) => void
}

const inputStyle = {
  borderRadius: '6px',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--input-text)',
  borderColor: 'var(--input-border)',
}

function EditAccountForm({ user, onUpdated }: EditAccountFormProps) {
  // Prefill the inputs with the user's real account data
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [email, setEmail] = useState(user.email)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSaving(true)

    try {
      const request = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      }
      await updateAccount(request)
      onUpdated({ ...user, ...request })
      setSuccess(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Could not update your account.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Your account details have been updated.
        </Alert>
      )}

      <Row className="g-3 mb-3">
        <Col sm={6}>
          <Form.Group controlId="accountFirstName">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              First name
            </Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={inputStyle}
              required
            />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group controlId="accountLastName">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Last name
            </Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={inputStyle}
              required
            />
          </Form.Group>
        </Col>

        <Col sm={12}>
          <Form.Group controlId="accountEmail">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={inputStyle}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Button
        type="submit"
        variant="dark"
        disabled={isSaving}
        style={{
          backgroundColor: 'var(--btn-bg)',
          borderColor: 'var(--btn-bg)',
          color: 'var(--btn-text)',
          borderRadius: '6px',
        }}
      >
        {isSaving ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Saving...
          </>
        ) : (
          'Save changes'
        )}
      </Button>
    </Form>
  )
}

export default EditAccountForm
