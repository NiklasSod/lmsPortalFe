import { Link } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { Book, JournalBookmark, MortarboardFill, Speedometer } from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { getRole } from '../api/auth/auth'

function AppNavbar() {
  const role = getRole()
  const isStudent = role === 'student'

  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'

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
          <JournalBookmark /> {isStudent ? 'Current Modules' : 'Modules Teaching'}
        </Nav.Link>
      </Nav>
      <div className="mt-auto pt-3 border-top border-secondary">
        <ThemeSwitch />
      </div>
    </Navbar>
  )
}

export default AppNavbar
