import { useEffect, useState } from 'react'
import { Card, Container, Spinner, Alert } from 'react-bootstrap'
import { DomainIcon } from '../../components/DomainIcon'
import { getCurrentModules, getMineModules } from '../../api/module'
import type { CourseModule } from '../../types/module'
import ModuleGrid from '../../components/modules/ModuleGrid'

export const ModulesView: React.FC = () => {
  const [currentModules, setCurrentModules] = useState<CourseModule[]>([])
  const [mineModules, setMineModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchModules() {
      try {
        const dataCurrent = await getCurrentModules()
        const dataMine = await getMineModules()

        if (ignore) return
        const currentIds = new Set(dataCurrent.map((module) => module.id))
        const uniqueMineModules = dataMine.filter(
          (module) => !currentIds.has(module.id),
        )

        setCurrentModules(dataCurrent)
        setMineModules(uniqueMineModules)
      } catch (err) {
        if (!ignore) setError((err as Error).message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchModules()

    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = (deleted: CourseModule) => {
    setCurrentModules((prev) =>
      prev.filter((module) => module.id !== deleted.id),
    )
    setMineModules((prev) => prev.filter((module) => module.id !== deleted.id))
  }

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

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <DomainIcon type="module" size={28} className="text-primary" />
        <h1 className="h2 mb-0">Modules</h1>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header as="h2" className="h5 mb-0">
          {currentModules.length > 0 ? 'Current Modules' : 'No current Modules'}
        </Card.Header>
        <Card.Body>
          {currentModules.length === 0 ? (
            <Alert variant="info" className="mb-0">
              You have no active modules right now.
            </Alert>
          ) : (
            <ModuleGrid modules={currentModules} onDelete={handleDelete} />
          )}
        </Card.Body>
      </Card>

      {mineModules.length > 0 && (
        <Card className="border-0 shadow-sm mt-4">
          <Card.Header as="h2" className="h5 mb-0">
            My other Modules
          </Card.Header>
          <Card.Body>
            <ModuleGrid modules={mineModules} onDelete={handleDelete} />
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

export default ModulesView
