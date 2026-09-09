import { useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { changePassword } from '../../api/user'

const inputStyle = {
  borderRadius: '6px',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--input-text)',
  borderColor: 'var(--input-border)',
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const reset = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setIsSaving(true)

    try {
      await changePassword({ currentPassword, newPassword })
      reset()
      setSuccess(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Could not change your password.',
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
          Your password has been updated.
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="currentPassword">
        <Form.Label
          className="fw-normal mb-1 small"
          style={{ color: 'var(--text-secondary)' }}
        >
          Current password
        </Form.Label>
        <Form.Control
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="py-2 px-3 shadow-none"
          style={inputStyle}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="newPassword">
        <Form.Label
          className="fw-normal mb-1 small"
          style={{ color: 'var(--text-secondary)' }}
        >
          New password
        </Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="py-2 px-3 shadow-none"
          style={inputStyle}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmNewPassword">
        <Form.Label
          className="fw-normal mb-1 small"
          style={{ color: 'var(--text-secondary)' }}
        >
          Confirm new password
        </Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="py-2 px-3 shadow-none"
          style={inputStyle}
          required
        />
      </Form.Group>

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
            Changing...
          </>
        ) : (
          'Change password'
        )}
      </Button>
    </Form>
  )
}

export default ChangePasswordForm
