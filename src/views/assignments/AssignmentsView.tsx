import { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import { ChevronDown, ChevronRight, JournalCheck } from 'react-bootstrap-icons'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getMyAssignments } from '../../api/assignment'
import { getModulesByCourse } from '../../api/module'
import { getUsers } from '../../api/user'
import { getMySubmissions } from '../../api/submission'
import type { UserDto } from '../../api/user'
import type { Assignment } from '../../types/assignment'
import type { Submission } from '../../types/submission'
import { normalizeStatus } from '../../utils/submissionStatus'
import AssignmentCard from '../../components/assignments/AssignmentCard'

export const AssignmentsView: React.FC = () => {
  const { role } = useAuth()
  const isTeacher = role !== 'student'
  const [searchParams] = useSearchParams()
  const courseIdParam = searchParams.get('courseId')
  const courseId = courseIdParam ? Number(courseIdParam) : null
  const hasCourseFilter = courseId !== null && Number.isInteger(courseId)

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [courseModuleIds, setCourseModuleIds] = useState<Set<number> | null>(
    null,
  )
  const [usersById, setUsersById] = useState<Map<string, UserDto>>(new Map())
  const [submissionsById, setSubmissionsById] = useState<
    Map<number, Submission>
  >(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHandedIn, setShowHandedIn] = useState(false)
  const [showApproved, setShowApproved] = useState(false)

  const loadAssignments = async () => {
    try {
      const data = await getMyAssignments()
      setAssignments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError((err as Error).message)
    }

    if (!isTeacher) {
      try {
        const subs = await getMySubmissions()
        const list = Array.isArray(subs) ? subs : []
        setSubmissionsById(new Map(list.map((sub) => [sub.id, sub])))
      } catch {
        // Resubmit deadline is a nice-to-have, not required for the view.
      }
    }
  }

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyAssignments()
        setAssignments(Array.isArray(data) ? data : [])

        if (courseId !== null && Number.isInteger(courseId)) {
          try {
            const modules = await getModulesByCourse(courseId)
            setCourseModuleIds(
              new Set(
                (Array.isArray(modules) ? modules : []).map((m) => m.id),
              ),
            )
          } catch {
            // If the course can't be loaded, show no assignments for it.
            setCourseModuleIds(new Set())
          }
        } else {
          setCourseModuleIds(null)
        }

        if (isTeacher) {
          try {
            const users = await getUsers()
            setUsersById(new Map(users.map((user) => [user.id, user])))
          } catch {
            // Student names are a nice-to-have, not required for the view.
          }
        } else {
          try {
            const subs = await getMySubmissions()
            const list = Array.isArray(subs) ? subs : []
            setSubmissionsById(new Map(list.map((sub) => [sub.id, sub])))
          } catch {
            // Resubmit deadline is a nice-to-have, not required for the view.
          }
        }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [isTeacher, courseId])

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

  const filteredAssignments =
    hasCourseFilter && courseModuleIds
      ? assignments.filter((a) => courseModuleIds.has(a.moduleId))
      : assignments

  const activeAssignments = isTeacher
    ? filteredAssignments
    : filteredAssignments.filter(
        (a) =>
          normalizeStatus(a.latestSubmissionStatus) !== 'handedIn' &&
          normalizeStatus(a.latestSubmissionStatus) !== 'approved',
      )
  const handedInAssignments = isTeacher
    ? []
    : filteredAssignments.filter(
        (a) => normalizeStatus(a.latestSubmissionStatus) === 'handedIn',
      )
  const approvedAssignments = isTeacher
    ? []
    : filteredAssignments.filter(
        (a) => normalizeStatus(a.latestSubmissionStatus) === 'approved',
      )

  const renderAssignments = (list: Assignment[], className = 'g-4') => (
    <Row xs={1} md={2} lg={3} className={className}>
      {list.map((assignment) => (
        <Col key={assignment.id}>
          <AssignmentCard
            assignment={assignment}
            usersById={isTeacher ? usersById : undefined}
            submissionsById={isTeacher ? undefined : submissionsById}
            onSubmitted={loadAssignments}
          />
        </Col>
      ))}
    </Row>
  )

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
        <>
          {activeAssignments.length > 0 ? (
            renderAssignments(activeAssignments)
          ) : (
            <p className="text-muted mb-0">No open assignments.</p>
          )}

          {handedInAssignments.length > 0 && (
            <div className="mt-4">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none d-flex align-items-center gap-1"
                onClick={() => setShowHandedIn((prev) => !prev)}
                aria-expanded={showHandedIn}
              >
                {showHandedIn ? <ChevronDown /> : <ChevronRight />}
                Handed in ({handedInAssignments.length})
              </Button>

              {showHandedIn && (
                <div className="mt-2">
                  {renderAssignments(handedInAssignments)}
                </div>
              )}
            </div>
          )}

          {approvedAssignments.length > 0 && (
            <div className="mt-4">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none d-flex align-items-center gap-1"
                onClick={() => setShowApproved((prev) => !prev)}
                aria-expanded={showApproved}
              >
                {showApproved ? <ChevronDown /> : <ChevronRight />}
                Approved ({approvedAssignments.length})
              </Button>

              {showApproved && (
                <div className="mt-2">
                  {renderAssignments(approvedAssignments)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Container>
  )
}

export default AssignmentsView
