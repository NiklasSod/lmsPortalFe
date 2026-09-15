import { useState } from 'react'
import { Alert, Badge, Card, ListGroup, Spinner } from 'react-bootstrap'
import { Clock } from 'react-bootstrap-icons'
import type { Deadline } from '../../types/dashboard'
import PaginationControls from '../PaginationControls'

interface AssignmentDeadlinesCardProps {
  deadlines: Deadline[]
  loading: boolean
  error: string | null
}

const PAGE_SIZE = 5

function formatDueDate(deadline: Deadline) {
  return deadline.dueAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function isNotTurnedIn(deadline: Deadline) {
  return deadline.status == null || deadline.status === 'Unsent'
}

const AssignmentDeadlinesCard = ({
  deadlines,
  loading,
  error,
}: AssignmentDeadlinesCardProps) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(deadlines.length / PAGE_SIZE))
  const currentDeadlines = deadlines.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  return (
    <Card className="shadow-sm">
      <Card.Header as="h2" className="h5 mb-0">
        Assignment deadlines
      </Card.Header>
      {loading && (
        <Card.Body>
          <Spinner animation="border" size="sm" />
        </Card.Body>
      )}
      {error && (
        <Card.Body>
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        </Card.Body>
      )}
      {!loading && !error && (
        <>
          <ListGroup variant="flush">
            {deadlines.length === 0 && (
              <ListGroup.Item className="text-muted">
                No upcoming assignments.
              </ListGroup.Item>
            )}
            {currentDeadlines.map((deadline) => (
              <ListGroup.Item key={deadline.id} className="py-3">
                <div className="fw-semibold">{deadline.assignmentTitle}</div>
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
          <div className="px-3 pb-3">
            <PaginationControls
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </Card>
  )
}

export default AssignmentDeadlinesCard
