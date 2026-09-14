import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Alert,
  Breadcrumb,
  Row,
  Col,
  Spinner,
  Card,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import { BoxArrowUpRight, PlusLg } from 'react-bootstrap-icons'
import { getCourseById } from '../../api/course'
import {
  getCourseResources,
  createCourseResource,
  updateCourseResource,
  deleteCourseResource,
  formatResourceTitle,
} from '../../api/resource'
import type { CourseDetail } from '../../types/course'
import type { ModuleResource } from '../../types/resource'
import { useAuth } from '../../auth/AuthContext'

export function CourseResourcesView() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<CourseDetail | undefined>(undefined)
  const [resources, setResources] = useState<ModuleResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { role, userId } = useAuth()
  const isStudent = role === 'student'
  const isTeacher = role !== 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  const [resModalState, setResModalState] = useState<{
    show: boolean
    mode: 'add' | 'edit'
    resource?: ModuleResource
  }>({ show: false, mode: 'add' })

  const [resFormData, setResFormData] = useState({
    name: '',
    description: '',
    url: '',
  })

  const [savingRes, setSavingRes] = useState(false)
  const [resFormError, setResFormError] = useState<string | null>(null)
  const [deletingResId, setDeletingResId] = useState<number | null>(null)

  const loadResources = async () => {
    if (!courseId) return
    try {
      const data = await getCourseResources(Number(courseId))
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useEffect(() => {
    if (!courseId) return

    Promise.all([
      getCourseById(courseId),
      getCourseResources(Number(courseId)).catch(() => []),
    ])
      .then(([cData, rData]) => {
        setCourse(cData)
        setResources(Array.isArray(rData) ? rData : [])
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [courseId])

  const openAddResource = () => {
    setResFormData({ name: '', description: '', url: '' })
    setResFormError(null)
    setResModalState({ show: true, mode: 'add' })
  }

  const openEditResource = (res: ModuleResource) => {
    setResFormData({
      name: res.name || res.title || res.resourceName || '',
      description: res.description || '',
      url: res.url || '',
    })
    setResFormError(null)
    setResModalState({ show: true, mode: 'edit', resource: res })
  }

  const handleResourceSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setResFormError(null)

    if (!courseId) return

    try {
      setSavingRes(true)
      if (resModalState.mode === 'add') {
        await createCourseResource(
          Number(courseId),
          {
            name: resFormData.name.trim(),
            description: resFormData.description.trim(),
            url: resFormData.url.trim(),
          },
          userId,
        )
      } else if (resModalState.mode === 'edit' && resModalState.resource) {
        await updateCourseResource(
          resModalState.resource.id,
          Number(courseId),
          {
            name: resFormData.name.trim(),
            description: resFormData.description.trim(),
            url: resFormData.url.trim(),
          },
        )
      }

      setResModalState({ show: false, mode: 'add' })
      loadResources()
    } catch (err) {
      setResFormError(
        err instanceof Error ? err.message : 'Could not save resource.',
      )
    } finally {
      setSavingRes(false)
    }
  }

  const handleResourceDelete = async (id: number) => {
    if (!courseId) return
    try {
      setDeletingResId(id)
      await deleteCourseResource(id, Number(courseId))
      loadResources()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete resource.',
      )
    } finally {
      setDeletingResId(null)
    }
  }

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (error || !course) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Course not found.'}</Alert>
        <Link to={base}>Back to course list</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: base }}
          style={{ color: 'var(--link-color)' }}
        >
          Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `${base}/${course.id}` }}
          style={{ color: 'var(--link-color)' }}
        >
          {course.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>
          Resources
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 fw-bold mb-0">Course Resources</h1>
            <Button
              variant="outline-primary"
              size="sm"
              className="py-0.5 px-2 small rounded-2 d-inline-flex align-items-center gap-1"
              onClick={openAddResource}
            >
              <PlusLg size={11} /> Add
            </Button>
          </div>

          <Card className="border shadow-sm">
            <Card.Body>
              {resources.length === 0 ? (
                <div className="py-3 text-body-secondary small text-center">
                  No resources uploaded for this course yet.
                  <div className="mt-1">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-primary small fw-medium text-decoration-none"
                      onClick={openAddResource}
                    >
                      + Add resource
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {resources.map((res) => {
                    const title = formatResourceTitle(res)
                    const canEdit =
                      isTeacher ||
                      isStudent ||
                      !res.createdById ||
                      res.createdById === userId ||
                      res.createdById === 'current-student-id'

                    return (
                      <div
                        key={res.id}
                        className="py-2.5 border-bottom border-light-subtle d-flex justify-content-between align-items-start gap-2"
                      >
                        <div className="pe-2 flex-grow-1 min-w-0">
                          <div className="mb-1">
                            {res.url ? (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="fw-semibold text-body text-decoration-none d-inline-flex align-items-center gap-1"
                              >
                                {title} <BoxArrowUpRight size={11} />
                              </a>
                            ) : (
                              <span className="fw-semibold text-body">
                                {title}
                              </span>
                            )}
                          </div>
                          {res.description && (
                            <div className="text-body-secondary small">
                              {res.description}
                            </div>
                          )}
                        </div>

                        {canEdit && (
                          <div className="d-flex align-items-center gap-1.5 flex-shrink-0 pt-0.5">
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-body-secondary small text-decoration-none"
                              onClick={() => openEditResource(res)}
                            >
                              Edit
                            </Button>
                            <span className="text-body-secondary small">·</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-danger small text-decoration-none"
                              disabled={deletingResId === res.id}
                              onClick={() => handleResourceDelete(res.id)}
                            >
                              {deletingResId === res.id ? '…' : 'Delete'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Resource Add/Edit Modal */}
      <Modal
        show={resModalState.show}
        onHide={() => setResModalState({ show: false, mode: 'add' })}
        centered
      >
        <Form onSubmit={handleResourceSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="h5">
              {resModalState.mode === 'add'
                ? 'Add Resource'
                : 'Edit Resource'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resFormError && <Alert variant="danger">{resFormError}</Alert>}
            <Form.Group className="mb-3" controlId="tabCourseResName">
              <Form.Label>Resource Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Study guide, Cheat sheet, Link to docs"
                value={resFormData.name}
                onChange={(e) =>
                  setResFormData({ ...resFormData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="tabCourseResDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Brief description of the resource"
                value={resFormData.description}
                onChange={(e) =>
                  setResFormData({ ...resFormData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="tabCourseResUrl">
              <Form.Label>URL / Link (optional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={resFormData.url}
                onChange={(e) =>
                  setResFormData({ ...resFormData, url: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setResModalState({ show: false, mode: 'add' })}
              disabled={savingRes}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={savingRes}
            >
              {savingRes
                ? 'Saving…'
                : resModalState.mode === 'add'
                  ? 'Add Resource'
                  : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default CourseResourcesView
