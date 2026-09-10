import { Link, useNavigate } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import {
  Book,
  BoxArrowLeft,
  JournalBookmark,
  JournalCheck,
  ListCheck,
  MortarboardFill,
  Speedometer,
  HouseGear,
} from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { useAuth } from '../auth/AuthContext'

function AppNavbar() {
  const navigate = useNavigate()
  const { role, fullName, logout } = useAuth()
  const isStudent = role === 'student'

  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'
  const activitiesPath = isStudent
    ? '/student/activities'
    : '/teacher/activities'
  const assignmentsPath = isStudent
    ? '/student/assignments'
    : '/teacher/assignments'

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  // temp hardcoded
  const darkTheme = true

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

        <Nav.Link
          as={Link}
          to={activitiesPath}
          className="d-flex align-items-center gap-2 text-white"
        >
          <ListCheck /> Activities
        </Nav.Link>

        <Nav.Link
          as={Link}
          to={assignmentsPath}
          className="d-flex align-items-center gap-2 text-white"
        >
          <JournalCheck /> Assignments
        </Nav.Link>

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
          <div className="text-white ms-2 mb-2 d-flex flex-column gap-2">
            <div className="d-flex flex-row align-items-center gap-2">
              <HouseGear />
              <Link
                className={darkTheme ? 'link-light' : 'link-dark'}
                to={`/${role}/profile`}
                style={{ textDecoration: 'none' }}
              >
                Profile
              </Link>
            </div>
            <span className="text-truncate">{fullName}</span>
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
