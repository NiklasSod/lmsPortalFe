import { Button, Card } from 'react-bootstrap'
import { getRole } from '../../api/auth'
import type { CourseModule } from '../../types/module'

interface ModuleCardProps {
  module: CourseModule
  onEdit?: (module: CourseModule) => void
  onDelete?: (module: CourseModule) => void
}

function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  const isTeacher = getRole() !== 'student'

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="position-relative">
        {isTeacher && (
          <Button
            variant="outline-primary"
            size="sm"
            style={{ position: 'absolute', top: 6, right: 6 }}
            onClick={() => onEdit?.(module)}
          >
            Edit
          </Button>
        )}
        <Card.Title className="h5 pe-5">{module.name}</Card.Title>
        <Card.Text className="text-muted small">{module.description}</Card.Text>
        <Card.Text className="text-muted small mb-0 pe-5">
          {new Date(module.startDate).toLocaleDateString()} -{' '}
          {new Date(module.endDate).toLocaleDateString()}
        </Card.Text>
        {isTeacher && (
          <Button
            variant="outline-danger"
            size="sm"
            style={{ position: 'absolute', bottom: 6, right: 6 }}
            onClick={() => onDelete?.(module)}
          >
            Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default ModuleCard
