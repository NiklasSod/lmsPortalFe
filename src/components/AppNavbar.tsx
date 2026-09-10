import { useState, useEffect } from 'react'
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
} from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { useAuth } from '../auth/AuthContext'

function AppNavbar() {
  const navigate = useNavigate()
  const { role, fullName, logout } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const isStudent = role === 'student'

  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'
  const activitiesPath = isStudent
    ? '/student/activities'
    : '/teacher/activities'
  const assignmentsPath = isStudent
    ? '/student/assignments'
    : '/teacher/assignments'

  // Effect 1: Handle scroll behavior
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY

      if (expanded || currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, expanded])

  // Effect 2: Lock body scroll when mobile menu is expanded
  useEffect(() => {
    if (expanded) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [expanded])

  async function handleLogout() {
    setExpanded(false)
    await logout()
    navigate('/login')
  }

  return (
    <Navbar
      expand="sm"
      expanded={expanded}
      onToggle={setExpanded}
      className={`p-3 app-navbar-responsive border-bottom ${!isVisible ? 'navbar-hidden' : ''}`}
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
          className="d-flex align-items-center gap-2 text-decoration-none m-0"
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
          className={`border-0 shadow-none bg-transparent p-0 d-sm-none custom-toggler ${
            expanded ? 'open' : ''
          }`}
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
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
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <Speedometer /> Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={coursesPath}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <MortarboardFill /> Courses
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={modulesPath}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <JournalBookmark />{' '}
            {isStudent ? 'Current Modules' : 'Modules Teaching'}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={activitiesPath}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <ListCheck /> Activities
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={assignmentsPath}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <JournalCheck /> Assignments
          </Nav.Link>
          <Nav.Link
            as="button"
            onClick={handleLogout}
            className="d-flex align-items-center gap-2 border-0 bg-transparent text-start px-2 py-2 mt-2"
          >
            <BoxArrowLeft /> Logout
          </Nav.Link>
        </Nav>

        <div className="mt-auto w-100 pt-3">
          {fullName && (
            <div className="mb-2">
              <span className="text-truncate ms-2">{fullName}</span>
            </div>
          )}
          <div className="pt-3 border-top">
            <ThemeSwitch />
          </div>
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default AppNavbar