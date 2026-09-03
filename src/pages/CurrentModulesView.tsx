import { useEffect, useState } from 'react'
import { Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import { getCurrentModules } from '../api/module'
import type { CourseModule } from '../types/module'

export const CurrentModulesView: React.FC = () => {
    const [modules, setModules] = useState<CourseModule[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchModules() {
            try {
                setLoading(true)
                const data = await getCurrentModules()
                setModules(data)
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
            <h1 className="h2 mb-4">Current Modules</h1>
            {modules.length === 0 ? (
                <Alert variant="info">You have no active modules right now.</Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {modules.map((module) => (
                        <Col key={module.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h5">{module.name}</Card.Title>
                                    <Card.Text className="text-muted small">
                                        {module.description}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mb-0">
                                        {new Date(module.startDate).toLocaleDateString()} - {new Date(module.endDate).toLocaleDateString()}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default CurrentModulesView