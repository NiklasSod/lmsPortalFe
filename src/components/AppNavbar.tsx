import { Link, useLocation } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { Book, MortarboardFill, Speedometer } from 'react-bootstrap-icons'

function AppNavbar() {
  const { pathname } = useLocation()
  const isTeacher = pathname.startsWith('/teacher')
  const coursesPath = isTeacher ? '/teacher/courses' : '/student/courses'

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
      </Nav>
    </Navbar>
  )
}

export default AppNavbar
