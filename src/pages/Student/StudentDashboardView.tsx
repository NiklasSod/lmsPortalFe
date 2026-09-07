import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
} from 'react-bootstrap'
import { CheckCircle, Clock, ExclamationTriangle } from 'react-bootstrap-icons'

type MockDeadline = {
  courseName: string
  assignmentTitle: string
  dueAt: Date
  turnedIn: boolean
}

const mockDeadlines: MockDeadline[] = [
  {
    courseName: 'Web Development',
    assignmentTitle: 'Build a responsive portfolio page',
    dueAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
    turnedIn: false,
  },
  {
    courseName: 'Database Design',
    assignmentTitle: 'Normalize the library database',
    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    turnedIn: false,
  },
  {
    courseName: 'JavaScript Fundamentals',
    assignmentTitle: 'Complete the async programming exercises',
    dueAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    turnedIn: true,
  },
]

function isDueSoon(deadline: MockDeadline) {
  const hoursUntilDue =
    (deadline.dueAt.getTime() - Date.now()) / (60 * 60 * 1000)
  return !deadline.turnedIn && hoursUntilDue >= 24 && hoursUntilDue <= 48
}

function formatDueDate(deadline: MockDeadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function StudentDashboardView() {
  const upcomingDeadlines = mockDeadlines.filter(isDueSoon)

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Student dashboard</h1>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
          {upcomingDeadlines.map((deadline) => (
            <Alert
              key={`${deadline.courseName}-${deadline.assignmentTitle}`}
              variant="warning"
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
                    <strong>{deadline.assignmentTitle}</strong> for{' '}
                    {deadline.courseName}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <Clock aria-hidden="true" />
                    <span>Due {formatDueDate(deadline)}</span>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="h5 mb-0">
              Assignment deadlines
            </Card.Header>
            <ListGroup variant="flush">
              {mockDeadlines.map((deadline) => (
                <ListGroup.Item
                  key={`${deadline.courseName}-${deadline.assignmentTitle}`}
                  className="py-3"
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-semibold">
                        {deadline.assignmentTitle}
                      </div>
                      <div className="text-muted">{deadline.courseName}</div>
                      <div className="d-flex align-items-center gap-2 mt-2 text-muted">
                        <Clock aria-hidden="true" />
                        <span>Due {formatDueDate(deadline)}</span>
                      </div>
                    </div>
                    <Badge bg={deadline.turnedIn ? 'success' : 'secondary'}>
                      {deadline.turnedIn ? (
                        <>
                          <CheckCircle className="me-1" aria-hidden="true" />
                          Turned in
                        </>
                      ) : (
                        'Not turned in'
                      )}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StudentDashboardView
