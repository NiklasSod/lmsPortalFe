import { useState } from 'react'
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap'
import type { CourseModule } from '../../types/module'
import ClampedText from '../ClampedText'
import PaginationControls from '../PaginationControls'

interface ModulesCardProps {
  modules: CourseModule[]
  loading: boolean
  error: string | null
}

const PAGE_SIZE = 3

const ModulesCard = ({ modules, loading, error }: ModulesCardProps) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(modules.length / PAGE_SIZE))
  const currentModules = modules.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Card className="border-0 shadow-sm mt-4">
      <Card.Header as="h2" className="h5 mb-0">
        Current modules
      </Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" size="sm" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && modules.length === 0 && (
          <p className="text-muted mb-0">You have no current modules.</p>
        )}
        {!loading && !error && modules.length > 0 && (
          <>
            <Row xs={1} md={2} lg={3} className="g-3">
              {currentModules.map((module) => (
                <Col key={module.id}>
                  <Card className="h-100 border shadow-sm">
                    <Card.Body>
                      <Card.Title className="h6 mb-2">{module.name}</Card.Title>
                      <ClampedText
                        text={module.description}
                        className="text-muted small mb-2"
                      />
                      <Card.Text className="text-muted small mb-0">
                        {new Date(module.startDate).toLocaleDateString()} -{' '}
                        {new Date(module.endDate).toLocaleDateString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <PaginationControls
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default ModulesCard
