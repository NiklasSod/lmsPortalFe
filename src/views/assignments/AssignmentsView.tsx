import { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import { JournalCheck } from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import { getMyAssignments } from '../../api/assignment'
import { getUsers } from '../../api/user'
import { getMineModules } from '../../api/module'
import type { UserDto } from '../../api/user'
import type { Assignment } from '../../types/assignment'
import type { CourseModule } from '../../types/module'
import AssignmentCard from '../../components/assignments/AssignmentCard'
import { AssignmentFormModal } from '../../components/assignments/AssignmentFormModal'

export const AssignmentsView: React.FC = () => {
  const { role } = useAuth()
  const isTeacher = role !== 'student'

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [usersById, setUsersById] = useState<Map<string, UserDto>>(new Map())
  const [teacherModules, setTeacherModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

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
            const [users, modules] = await Promise.all([
              getUsers().catch(() => []),
              getMineModules().catch(() => []),
            ])
            setUsersById(new Map(users.map((user) => [user.id, user])))
            setTeacherModules(modules)
          } catch {
            // Nice to have items, do not block main view
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
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <JournalCheck size={28} className="text-primary" />
          <h1 className="h2 mb-0">Assignments</h1>
        </div>

        {isTeacher && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            Add assignment
          </Button>
        )}
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
                modules={teacherModules}
                onSubmitted={loadAssignments}
                onUpdated={loadAssignments}
                onDeleted={loadAssignments}
              />
            </Col>
          ))}
        </Row>
      )}

      {isTeacher && (
        <AssignmentFormModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSaved={loadAssignments}
          modules={teacherModules}
        />
      )}
    </Container>
  )
}

export default AssignmentsView
