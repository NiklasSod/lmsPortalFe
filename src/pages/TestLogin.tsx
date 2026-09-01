import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

const DEMO_PASSWORD = 'Passw0rd1'

const TEST_ACCOUNTS = [
  {
    label: 'Alan Turing (teacher)',
    email: 'alan.turing@example.com',
    role: 'teacher' as const,
  },
  {
    label: 'Alice Johnson (student)',
    email: 'alice.johnson@example.com',
    role: 'student' as const,
  },
]

function TestLogin() {
  const [status, setStatus] = useState<string | null>(null)
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleLogin(account: (typeof TEST_ACCOUNTS)[number]) {
    try {
      setLoadingEmail(account.email)
      setStatus(null)
      await login(account.email, DEMO_PASSWORD)
      navigate(
        account.role === 'teacher' ? '/teacher/courses' : '/student/courses',
      )
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoadingEmail(null)
    }
  }

  return (
    <div className="p-4">
      <h1 className="h3">Test login</h1>
      {status && <div className="alert alert-danger">{status}</div>}

      <div className="d-flex flex-wrap gap-2">
        {TEST_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            className={
              account.role === 'teacher'
                ? 'btn btn-primary'
                : 'btn btn-outline-secondary'
            }
            disabled={loadingEmail === account.email}
            onClick={() => handleLogin(account)}
          >
            {loadingEmail === account.email ? 'Logging in…' : account.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TestLogin
