import { useEffect, useState } from 'react'
import { Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import { getCurrentModules, getMineModules } from '../api/module'
import type { CourseModule } from '../types/module'
import ModuleCard from '../components/modules/ModuleCard'

export const ModulesView: React.FC = () => {
  const [currentModules, setCurrentModules] = useState<CourseModule[]>([])
  const [mineModules, setMineModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchModules() {
      try {
        setLoading(true)
        const dataCurrent = await getCurrentModules()
        const dataMine = await getMineModules()

        const currentIds = new Set(dataCurrent.map((module) => module.id))
        const uniqueMineModules = dataMine.filter(
          (module) => !currentIds.has(module.id),
        )

        setCurrentModules(dataCurrent)
        setMineModules(uniqueMineModules)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchModules()
  }, [])

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
      {currentModules.length > 0 ? (
        <h2 className="h2 mb-4">Current Modules</h2>
      ) : (
        <h2>No current Modules</h2>
      )}
      {currentModules.length === 0 ? (
        <Alert variant="info">You have no active modules right now.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {currentModules.map((currentModule) => (
            <Col key={currentModule.id}>
              <ModuleCard module={currentModule} />
            </Col>
          ))}
        </Row>
      )}
      {mineModules.length > 0 && <h2 className="h2 my-4">My other Modules</h2>}
      {mineModules.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {mineModules.map((mineModule) => (
            <Col key={mineModule.id}>
              <ModuleCard module={mineModule} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default ModulesView
