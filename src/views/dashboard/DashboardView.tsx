import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Speedometer } from 'react-bootstrap-icons'
import { getCurrentAssignments } from '../../api/assignment'
import { getMyCourses } from '../../api/course'
import { getCurrentModules } from '../../api/module'
import { getMySubmissions } from '../../api/submission'
import { apiFetch } from '../../utils/apiFetch'
import type { Assignment } from '../../types/assignment'
import type { CourseSummary } from '../../types/course'
import type { CourseModule } from '../../types/module'
import type { Submission } from '../../types/submission'
import { useAuth } from '../../auth/AuthContext'
import { normalizeStatus } from '../../utils/submissionStatus'
import type { Deadline, FeedbackItem } from '../../types/dashboard'
import AssignmentDeadlinesCard from '../../components/dashboard/AssignmentDeadlinesCard'
import AtRiskAlerts from '../../components/dashboard/AtRiskAlerts'
import BackendNotificationsAlerts, { type UserNotification } from '../../components/dashboard/BackendNotificationsAlerts'
import CoursesCard from '../../components/dashboard/CoursesCard'
import LatestFeedbackCard from '../../components/dashboard/LatestFeedbackCard'
import ModulesCard from '../../components/dashboard/ModulesCard'

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

function buildFeedbackItems(
  submissions: Submission[],
  deadlines: Deadline[],
): FeedbackItem[] {
  const assignmentTitleById = new Map(
    deadlines.map((deadline) => [deadline.id, deadline.assignmentTitle]),
  )

  const latestIdByAssignment = new Map<number, number>()
  for (const submission of submissions) {
    if (submission.assignmentId == null) continue
    const current = latestIdByAssignment.get(submission.assignmentId)
    if (current === undefined || submission.id > current) {
      latestIdByAssignment.set(submission.assignmentId, submission.id)
    }
  }

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
      status: normalizeStatus(submission.status),
      hasResubmission:
        submission.assignmentId != null &&
        submission.id <
          (latestIdByAssignment.get(submission.assignmentId) ?? submission.id),
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

  // Backend notifications state
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [notifLoading, setNotifLoading] = useState(true)

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)

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

  // Fetch unread notifications from backend API
  useEffect(() => {
    if (role !== 'student') return

    apiFetch('/api/notifications?unreadOnly=true')
      .then(async (res: Response) => {
        if (!res.ok) throw new Error('Failed to fetch notifications.')
        const data = await res.json()
        setNotifications(data)
      })
      .catch(() => {})
      .finally(() => setNotifLoading(false))
  }, [role])

  // Handle notification dismissal via backend API
  const handleDismissNotification = async (userNotificationId: number) => {
    try {
      const res = await apiFetch(
        `/api/notifications/${userNotificationId}/seen`,
        {
          method: 'POST',
        },
      )
      if (res.ok) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== userNotificationId),
        )
      }
    } catch {
      // Handle error if needed
    }
  }

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
      .then((data) => setFeedbackItems(buildFeedbackItems(data, deadlines)))
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

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Speedometer size={28} className="text-body" />
        <h1 className="h2 mb-0">
          {role.charAt(0).toUpperCase() + role.slice(1)} dashboard
        </h1>
      </div>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
        
          <BackendNotificationsAlerts
            notifications={notifications}
            loading={notifLoading}
            role={role}
            onDismiss={handleDismissNotification}
          />
          
          <AtRiskAlerts
            deadlines={atRiskDeadlines}
            onDismiss={(id) => setDismissedIds((prev) => [...prev, id])}
          />

          <CoursesCard courses={courses} loading={loading} error={error} />

          <ModulesCard
            modules={modules}
            loading={modulesLoading}
            error={modulesError}
          />

          {role === 'student' && (
            <LatestFeedbackCard
              items={feedbackItems}
              loading={feedbackLoading}
              error={feedbackError}
            />
          )}
        </Col>

        {role === 'student' && (
          <Col lg={4}>
            <AssignmentDeadlinesCard
              deadlines={visibleDeadlines}
              loading={deadlinesLoading}
              error={deadlinesError}
            />
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default DashboardView
