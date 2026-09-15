import { useState } from 'react'
import { Alert, Card, ListGroup, Spinner } from 'react-bootstrap'
import { CheckCircleFill } from 'react-bootstrap-icons'
import type { FeedbackItem } from '../../types/dashboard'
import PaginationControls from '../PaginationControls'

interface LatestFeedbackCardProps {
  items: FeedbackItem[]
  loading: boolean
  error: string | null
}

const PAGE_SIZE = 4

const LatestFeedbackCard = ({
  items,
  loading,
  error,
}: LatestFeedbackCardProps) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const currentItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Card className="border-0 shadow-sm mt-4">
      <Card.Header as="h2" className="h5 mb-0">
        Latest Feedback
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
            {items.length === 0 && (
              <ListGroup.Item className="text-muted bg-transparent">
                No submissions have received feedback yet.
              </ListGroup.Item>
            )}
            {currentItems.map((feedbackItem, index) => (
              <ListGroup.Item
                key={feedbackItem.id}
                className={`bg-transparent${
                  index === currentItems.length - 1 ? ' border-bottom' : ''
                }`}
              >
                <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">
                      {feedbackItem.assignmentTitle}
                    </span>
                    {feedbackItem.status === 'approved' && (
                      <CheckCircleFill
                        className="text-success"
                        aria-label="Approved"
                      />
                    )}
                    {feedbackItem.status === 'revision' &&
                      feedbackItem.hasResubmission && (
                        <CheckCircleFill
                          className="text-secondary"
                          aria-label="Resubmitted"
                        />
                      )}
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
                  "{feedbackItem.feedback}"
                </blockquote>
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

export default LatestFeedbackCard
