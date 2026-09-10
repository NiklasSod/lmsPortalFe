import { useEffect, useState } from 'react'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'
import { JournalCheck } from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import { getMyAssignments } from '../../api/assignment'
import { getUsers } from '../../api/user'
import type { UserDto } from '../../api/user'
import type { Assignment } from '../../types/assignment'
import AssignmentCard from '../../components/assignments/AssignmentCard'

export const AssignmentsView: React.FC = () => {
  const { role } = useAuth()
  const isTeacher = role !== 'student'

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [usersById, setUsersById] = useState<Map<string, UserDto>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAssignments = async () => {
    try {
      const data = await getMyAssignments()
      setAssignments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyAssignments()
        setAssignments(Array.isArray(data) ? data : [])

        if (isTeacher) {
          try {
            const users = await getUsers()
            setUsersById(new Map(users.map((user) => [user.id, user])))
          } catch {
            // Student names are a nice-to-have, not required for the view.
          }
        }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [isTeacher])

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

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <JournalCheck size={28} className="text-primary" />
        <h1 className="h2 mb-0">Assignments</h1>
      </div>

      <p className="text-muted mb-4">
        {isTeacher
          ? 'Review the assignments in your modules and grade student submissions.'
          : 'Your assignments and the status of your submissions.'}
      </p>

      {assignments.length === 0 ? (
        <Alert variant="info">No assignments found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {assignments.map((assignment) => (
            <Col key={assignment.id}>
              <AssignmentCard
                assignment={assignment}
                usersById={isTeacher ? usersById : undefined}
                onSubmitted={loadAssignments}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default AssignmentsView
