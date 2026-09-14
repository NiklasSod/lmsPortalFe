import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import type { CourseModule } from '../../types/module'
import ModuleCard from './ModuleCard'
import PaginationControls from '../PaginationControls'

interface ModuleGridProps {
  modules: CourseModule[]
  onDelete: (module: CourseModule) => void
}

const PAGE_SIZE = 3

const ModuleGrid = ({ modules, onDelete }: ModuleGridProps) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(modules.length / PAGE_SIZE))
  const visibleModules = modules.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <Row xs={1} md={2} lg={3} className="g-4">
        {visibleModules.map((module) => (
          <Col key={module.id}>
            <ModuleCard module={module} onDelete={onDelete} />
          </Col>
        ))}
      </Row>
      <PaginationControls
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </>
  )
}

export default ModuleGrid
