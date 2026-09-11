import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExclamationTriangle,
} from 'react-bootstrap-icons'
import { getCurrentAssignments } from '../../api/assignment'
import { getMyCourses } from '../../api/course'
import { getCurrentModules } from '../../api/module'
import { getMySubmissions } from '../../api/submission'
import type { Assignment } from '../../types/assignment'
import type { CourseSummary } from '../../types/course'
import type { CourseModule } from '../../types/module'
import type { Submission } from '../../types/submission'
import { useAuth } from '../../auth/AuthContext'

type Deadline = {
  id: number
  moduleId: number
  assignmentTitle: string
  dueAt: Date
  status: string | null
}

type FeedbackItem = {
  id: number
  assignmentTitle: string
  feedback: string
  handinDate: Date
}

function mapToDeadline(assignment: Assignment): Deadline {
  return {
    id: assignment.id,
    moduleId: assignment.moduleId,
    assignmentTitle: assignment.name,
    dueAt: new Date(assignment.dueDate),
    status: assignment.latestSubmissionStatus,
  }
}

function hasFeedback(submission: Submission) {
  return submission.feedback.trim().length > 0
}

function isNotTurnedIn(deadline: Deadline) {
  return deadline.status == null || deadline.status === 'Unsent'
}

function getHoursUntilDue(deadline: Deadline) {
  return (deadline.dueAt.getTime() - Date.now()) / (60 * 60 * 1000)
}

function isDueSoon(deadline: Deadline) {
  const hoursUntilDue = getHoursUntilDue(deadline)
  return hoursUntilDue >= 0 && hoursUntilDue <= 48
}

function isAtRisk(deadline: Deadline) {
  return isNotTurnedIn(deadline) && isDueSoon(deadline)
}

function formatDueDate(deadline: Deadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function buildFeedbackItems(
  submissions: Submission[],
  deadlines: Deadline[],
): FeedbackItem[] {
  const assignmentTitleById = new Map(
    deadlines.map((deadline) => [deadline.id, deadline.assignmentTitle]),
  )

  return submissions
    .filter(hasFeedback)
    .map((submission) => ({
      id: submission.id,
      assignmentTitle:
        (submission.assignmentId != null
          ? assignmentTitleById.get(submission.assignmentId)
          : undefined) ?? `Submission #${submission.id}`,
      feedback: submission.feedback,
      handinDate: submission.handinDate
        ? new Date(submission.handinDate)
        : new Date(0),
    }))
    .sort((a, b) => b.handinDate.getTime() - a.handinDate.getTime())
}

function DashboardView() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modules, setModules] = useState<CourseModule[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [modulesError, setModulesError] = useState<string | null>(null)

  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [deadlinesLoading, setDeadlinesLoading] = useState(true)
  const [deadlinesError, setDeadlinesError] = useState<string | null>(null)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [feedbackPage, setFeedbackPage] = useState(1)

  const { role } = useAuth()

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getCurrentModules()
      .then(setModules)
      .catch((err: Error) => setModulesError(err.message))
      .finally(() => setModulesLoading(false))
  }, [])

  useEffect(() => {
    if (role !== 'student') return

    getCurrentAssignments()
      .then((data) => setDeadlines(data.map(mapToDeadline)))
      .catch((err: Error) => setDeadlinesError(err.message))
      .finally(() => setDeadlinesLoading(false))
  }, [role])

  useEffect(() => {
    if (role !== 'student') return

    getMySubmissions()
      .then((data) =>
        setFeedbackItems(buildFeedbackItems(data, deadlines).slice(0, 5)),
      )
      .catch((err: Error) => setFeedbackError(err.message))
      .finally(() => setFeedbackLoading(false))
  }, [role, deadlines])

  if (role === null) return

  const visibleDeadlines = deadlines.filter(
    (deadline) => deadline.status !== 'approved',
  )
  const atRiskDeadlines = visibleDeadlines.filter(
    (deadline) => isAtRisk(deadline) && !dismissedIds.includes(deadline.id),
  )

  const feedbackPageSize = 4
  const feedbackPageCount = Math.max(
    1,
    Math.ceil(feedbackItems.length / feedbackPageSize),
  )
  const currentFeedbackItems = feedbackItems.slice(
    (feedbackPage - 1) * feedbackPageSize,
    feedbackPage * feedbackPageSize,
  )

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">
        {role.charAt(0).toUpperCase() + role.slice(1)} dashboard
      </h1>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
          {atRiskDeadlines.map((deadline) => (
            <Alert
              key={deadline.id}
              variant="warning"
              dismissible
              onClose={() => setDismissedIds((prev) => [...prev, deadline.id])}
            >
              <div className="d-flex gap-3">
                <ExclamationTriangle
                  className="flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <Alert.Heading className="h5">
                    Assignment due soon
                  </Alert.Heading>
                  <p className="mb-2">
                    <strong>{deadline.assignmentTitle}</strong>
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <Clock aria-hidden="true" />
                    <span>Due {formatDueDate(deadline)}</span>
                  </div>
                </div>
              </div>
            </Alert>
          ))}

          <Card className="border-0 shadow-sm">
            <Card.Header as="h2" className="h5 mb-0">
              My courses
            </Card.Header>
            <Card.Body>
              {loading && <Spinner animation="border" size="sm" />}
              {error && <Alert variant="danger">{error}</Alert>}
              {!loading && !error && courses.length === 0 && (
                <p className="text-muted mb-0">
                  You are not enrolled in any courses yet.
                </p>
              )}
              {!loading && !error && courses.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {courses.map((course) => (
                    <Col key={course.id}>
                      <Card className="h-100 border shadow-sm">
                        <Card.Body>
                          <Card.Title className="h6 mb-2">
                            {course.name}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-2">
                            {course.description}
                          </Card.Text>
                          <Card.Text className="text-muted small mb-0">
                            {new Date(course.startDate).toLocaleDateString()} -{' '}
                            {new Date(course.endDate).toLocaleDateString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-4">
            <Card.Header as="h2" className="h5 mb-0">
              Current modules
            </Card.Header>
            <Card.Body>
              {modulesLoading && <Spinner animation="border" size="sm" />}
              {modulesError && <Alert variant="danger">{modulesError}</Alert>}
              {!modulesLoading && !modulesError && modules.length === 0 && (
                <p className="text-muted mb-0">You have no current modules.</p>
              )}
              {!modulesLoading && !modulesError && modules.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {modules.map((module) => (
                    <Col key={module.id}>
                      <Card className="h-100 border shadow-sm">
                        <Card.Body>
                          <Card.Title className="h6 mb-2">
                            {module.name}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-2">
                            {module.description}
                          </Card.Text>
                          <Card.Text className="text-muted small mb-0">
                            {new Date(module.startDate).toLocaleDateString()} -{' '}
                            {new Date(module.endDate).toLocaleDateString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          {role === 'student' && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header as="h2" className="h5 mb-0">
                Latest Feedback
              </Card.Header>
              {feedbackLoading && (
                <Card.Body>
                  <Spinner animation="border" size="sm" />
                </Card.Body>
              )}
              {feedbackError && (
                <Card.Body>
                  <Alert variant="danger" className="mb-0">
                    {feedbackError}
                  </Alert>
                </Card.Body>
              )}
              {!feedbackLoading && !feedbackError && (
                <ListGroup variant="flush">
                  {feedbackItems.length === 0 && (
                    <ListGroup.Item className="text-muted bg-transparent">
                      No submissions have received feedback yet.
                    </ListGroup.Item>
                  )}
                  {currentFeedbackItems.map((feedbackItem, index) => (
                    <ListGroup.Item
                      key={feedbackItem.id}
                      className={`bg-transparent${
                        index === currentFeedbackItems.length - 1
                          ? ' border-bottom'
                          : ''
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                        <div className="fw-semibold">
                          {feedbackItem.assignmentTitle}
                        </div>
                        <small className="text-muted">
                          Submitted:{' '}
                          {new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }).format(feedbackItem.handinDate)}
                        </small>
                      </div>
                      <blockquote className="border-start border-3 ps-3 mb-0 text-muted small">
                        “{feedbackItem.feedback}”
                      </blockquote>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          )}

          {role === 'student' &&
            !feedbackLoading &&
            !feedbackError &&
            feedbackItems.length > 0 && (
              <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-body border-secondary"
                  onClick={() =>
                    setFeedbackPage((page) => Math.max(1, page - 1))
                  }
                  disabled={feedbackPage === 1}
                  aria-label="Previous page"
                >
                  <ArrowLeft size={14} />
                </button>

                {Array.from(
                  { length: feedbackPageCount },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`btn btn-sm ${
                      pageNumber === feedbackPage
                        ? 'btn-secondary text-white'
                        : 'btn-outline-secondary text-body border-secondary'
                    }`}
                    onClick={() => setFeedbackPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-body border-secondary"
                  onClick={() =>
                    setFeedbackPage((page) =>
                      Math.min(feedbackPageCount, page + 1),
                    )
                  }
                  disabled={feedbackPage === feedbackPageCount}
                  aria-label="Next page"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
        </Col>

        {role === 'student' && (
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header as="h2" className="h5 mb-0">
                Assignment deadlines
              </Card.Header>
              {deadlinesLoading && (
                <Card.Body>
                  <Spinner animation="border" size="sm" />
                </Card.Body>
              )}
              {deadlinesError && (
                <Card.Body>
                  <Alert variant="danger" className="mb-0">
                    {deadlinesError}
                  </Alert>
                </Card.Body>
              )}
              {!deadlinesLoading && !deadlinesError && (
                <ListGroup variant="flush">
                  {visibleDeadlines.length === 0 && (
                    <ListGroup.Item className="text-muted">
                      No upcoming assignments.
                    </ListGroup.Item>
                  )}
                  {visibleDeadlines.map((deadline) => (
                    <ListGroup.Item key={deadline.id} className="py-3">
                      <div className="fw-semibold">
                        {deadline.assignmentTitle}
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2 text-muted">
                        <Clock aria-hidden="true" />
                        <span>Due {formatDueDate(deadline)}</span>
                      </div>
                      <div className="mt-1">
                        <Badge
                          bg={
                            isNotTurnedIn(deadline)
                              ? 'secondary'
                              : deadline.status === 'Revision'
                                ? 'danger'
                                : 'success'
                          }
                        >
                          {isNotTurnedIn(deadline)
                            ? 'Not turned in'
                            : deadline.status === 'Revision'
                              ? 'Rejected'
                              : 'Turned in'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default DashboardView