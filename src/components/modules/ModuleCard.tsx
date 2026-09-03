import { Button, Card } from 'react-bootstrap'
import type { CourseModuleSummary } from '../../types/module'

interface ModuleCardProps {
  module: CourseModuleSummary
  onEdit?: (module: CourseModuleSummary) => void
  onDelete?: (module: CourseModuleSummary) => void
}

function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="h5">{module.name}</Card.Title>
        <Card.Text className="text-muted small">{module.description}</Card.Text>
        <Card.Text className="text-muted small mb-0">
          {new Date(module.startDate).toLocaleDateString()} -{' '}
          {new Date(module.endDate).toLocaleDateString()}
        </Card.Text>
        {(onEdit || onDelete) && (
          <div className="mt-3 d-flex gap-2">
            {onEdit && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(module)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(module)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ModuleCard
