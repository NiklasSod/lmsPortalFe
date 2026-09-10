import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import {
  Book,
  BoxArrowLeft,
  JournalBookmark,
  List,
  ListCheck,
  MortarboardFill,
  Speedometer,
  X,
} from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { useAuth } from '../auth/AuthContext'

function AppNavbar() {
  const navigate = useNavigate()
  const { role, fullName, logout } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const isStudent = role === 'student'

  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'
  const activitiesPath = isStudent
    ? '/student/activities'
    : '/teacher/activities'

  async function handleLogout() {
    setExpanded(false)
    await logout()
    navigate('/login')
  }

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="sm"
      expanded={expanded}
      onToggle={setExpanded}
      className="p-3 app-navbar-responsive"
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
          className="d-flex align-items-center gap-2 text-white text-decoration-none m-0"
        >
          <span
            className="d-flex align-items-center justify-content-center bg-danger rounded"
            style={{ width: 28, height: 28 }}
          >
            <Book color="white" size={16} />
          </span>
          Lexicon
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="border-0 text-white shadow-none bg-transparent p-0 d-sm-none"
        >
          {expanded ? <X size={28} /> : <List size={28} />}
        </Navbar.Toggle>
      </div>

      <Navbar.Collapse
        id="navbar-nav"
        className="flex-column align-items-stretch w-100 mt-3"
      >
        <Nav className="flex-column w-100" onClick={() => setExpanded(false)}>
          <Nav.Link
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2 text-white px-2 py-2"
          >
            <Speedometer /> Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={coursesPath}
            className="d-flex align-items-center gap-2 text-white px-2 py-2"
          >
            <MortarboardFill /> Courses
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={modulesPath}
            className="d-flex align-items-center gap-2 text-white px-2 py-2"
          >
            <JournalBookmark />{' '}
            {isStudent ? 'Current Modules' : 'Modules Teaching'}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={activitiesPath}
            className="d-flex align-items-center gap-2 text-white px-2 py-2"
          >
            <ListCheck /> Activities
          </Nav.Link>
          <Nav.Link
            as="button"
            onClick={handleLogout}
            className="d-flex align-items-center gap-2 text-white border-0 bg-transparent text-start px-2 py-2 mt-2"
          >
            <BoxArrowLeft /> Logout
          </Nav.Link>
        </Nav>

        <div className="mt-auto w-100 pt-3">
          {fullName && (
            <div className="text-white mb-2">
              <span className="text-truncate ms-2">{fullName}</span>
            </div>
          )}
          <div className="pt-3 border-top border-secondary">
            <ThemeSwitch />
          </div>
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default AppNavbar