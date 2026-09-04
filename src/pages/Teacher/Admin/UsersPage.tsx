import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Modal,
  Spinner,
  Table,
} from 'react-bootstrap'
import { Pencil } from 'react-bootstrap-icons'
import { getCourseById, getMyCourses } from '../../../api/course'
import { updateUser } from '../../../api/user'
import type { CourseEnrollment, CourseSummary } from '../../../types/course'

interface UserWithCourses extends CourseEnrollment {
  courses: string[]
}

function UsersPage() {
  const [users, setUsers] = useState<UserWithCourses[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<UserWithCourses | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadUsers() {
      try {
        const courses = await getMyCourses()
        const details = await Promise.all(
          courses.map((course: CourseSummary) =>
            getCourseById(String(course.id)),
          ),
        )
        const usersById = new Map<string, UserWithCourses>()

        details.forEach((course) => {
          course.enrollments.forEach((enrollment) => {
            const existing = usersById.get(enrollment.userId)
            if (existing) {
              if (!existing.courses.includes(course.name)) {
                existing.courses.push(course.name)
              }
              return
            }

            usersById.set(enrollment.userId, {
              ...enrollment,
              courses: [course.name],
            })
          })
        })

        setUsers(Array.from(usersById.values()))
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Could not load users.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) =>
      [user.firstName, user.lastName, user.email, ...user.courses]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [search, users])

  function openEditUser(user: UserWithCourses) {
    setEditingUser(user)
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEmail(user.email)
    setError(null)
  }

  function closeEditUser() {
    if (!isSaving) setEditingUser(null)
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingUser) return

    setError(null)
    setIsSaving(true)

    try {
      await updateUser(editingUser.userId, {
        firstName,
        lastName,
        email,
      })
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.userId === editingUser.userId
            ? {
                ...user,
                firstName,
                lastName,
                email,
              }
            : user,
        ),
      )
      setEditingUser(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not update user.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-muted mb-1">Administration</p>
          <h1 className="mb-1">Users</h1>
          <p className="text-muted mb-0">
            Users enrolled in the courses you teach.
          </p>
        </div>
        <Form.Control
          type="search"
          aria-label="Search users"
          placeholder="Search users or courses"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 280 }}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Alert variant="secondary">
          {users.length === 0
            ? 'No users are enrolled in your courses.'
            : 'No users match your search.'}
        </Alert>
      ) : (
        <Table responsive hover bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Courses</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td className="fw-semibold">
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'Teacher' ? 'primary' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td>{user.courses.join(', ')}</td>
                <td className="text-end">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    title={`Edit ${user.firstName} ${user.lastName}`}
                    aria-label={`Edit ${user.firstName} ${user.lastName}`}
                    onClick={() => openEditUser(user)}
                  >
                    <Pencil />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={editingUser !== null} onHide={closeEditUser} centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editUserFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="editUserLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mt-3" controlId="editUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeEditUser}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default UsersPage
