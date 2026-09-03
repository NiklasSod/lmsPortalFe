import { Link, useNavigate } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import {
  Book,
  BoxArrowLeft,
  JournalBookmark,
  MortarboardFill,
  People,
  Speedometer,
} from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { getFullName, getRole, logout } from '../api/auth'

function AppNavbar() {
  const navigate = useNavigate()
  const role = getRole()
  const fullName = getFullName()
  const isStudent = role === 'student'

  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="flex-column align-items-stretch p-3"
      style={{ width: 220, minHeight: '100vh' }}
    >
      <Navbar.Brand
        as={Link}
        to="/"
        className="d-flex align-items-center gap-2 mb-3"
      >
        <span
          className="d-flex align-items-center justify-content-center bg-danger rounded"
          style={{ width: 28, height: 28 }}
        >
          <Book color="white" size={16} />
        </span>
        Lexicon
      </Navbar.Brand>
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 text-white"
        >
          <Speedometer /> Dashboard
        </Nav.Link>
        <Nav.Link
          as={Link}
          to={coursesPath}
          className="d-flex align-items-center gap-2 text-white"
        >
          <MortarboardFill /> Courses
        </Nav.Link>
        <Nav.Link
          as={Link}
          to={modulesPath}
          className="d-flex align-items-center gap-2 text-white"
        >
          <JournalBookmark />{' '}
          {isStudent ? 'Current Modules' : 'Modules Teaching'}
        </Nav.Link>
        {!isStudent && (
          <Nav.Link
            as={Link}
            to="/teacher/admin/users"
            className="d-flex align-items-center gap-2 text-white"
          >
            <People /> Users
          </Nav.Link>
        )}
        <Nav.Link
          as="button"
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 text-white border-0 bg-transparent"
        >
          <BoxArrowLeft /> Logout
        </Nav.Link>
      </Nav>
      <div className="mt-auto">
        {fullName && (
          <div className="text-white mb-2">
            <span className="text-truncate ms-2">{fullName}</span>
          </div>
        )}
        <div className="pt-3 border-top border-secondary">
          <ThemeSwitch />
        </div>
      </div>
    </Navbar>
  )
}

export default AppNavbar
