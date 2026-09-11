import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import {
  Book,
  BoxArrowLeft,
  JournalBookmark,
  JournalCheck,
  ListCheck,
  MortarboardFill,
  HouseGear,
  Speedometer,
} from 'react-bootstrap-icons'
import { ThemeSwitch } from './ThemeSwitch'
import { useAuth } from '../auth/AuthContext'

function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const base = isStudent ? '/student' : '/teacher'

  const pathSegments = location.pathname.split('/')
  const coursesIndex = pathSegments.indexOf('courses')
  const pathCourseId =
    coursesIndex !== -1 && pathSegments.length > coursesIndex + 1
      ? pathSegments[coursesIndex + 1]
      : null

  const searchParams = new URLSearchParams(location.search)
  const queryCourseId = searchParams.get('courseId')
  const activeCourseId = pathCourseId || queryCourseId

  const courseSections = activeCourseId
    ? [
        { label: 'Overview', to: `${base}/courses/${activeCourseId}` },
        { label: 'Modules', to: `${base}/courses/${activeCourseId}/modules` },
        { label: 'Assignments', to: `${base}/assignments?courseId=${activeCourseId}` },
        { label: 'Members', to: `${base}/courses/${activeCourseId}/members` },
      ]
    : []

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY

      if (expanded) {
        setIsVisible(true)
        return
      }

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, expanded])

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
      className={`p-3 app-navbar-responsive border-bottom ${!isVisible ? 'navbar-hidden' : ''} ${expanded ? 'expanded' : ''}`}
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
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
          className={`border-0 shadow-none bg-transparent p-0 d-sm-none custom-toggler ${
            expanded ? 'open' : ''
          }`}
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <div
        className={`custom-mobile-collapse d-sm-flex flex-column align-items-stretch w-100 mt-3`}
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
            className={`d-flex align-items-center gap-2 px-2 py-2 ${
              activeCourseId ? 'fw-bold' : ''
            }`}
          >
            <MortarboardFill /> Courses
          </Nav.Link>

          {activeCourseId && (
            <div className="ms-3 ps-2 border-start border-secondary d-flex flex-column my-1">
              {courseSections.map((section) => {
                const toPath = section.to.split('?')[0]
                const isAssignmentsSection = section.to.includes('assignments')
                const isActive = isAssignmentsSection
                  ? location.pathname.startsWith(toPath) && searchParams.get('courseId') === activeCourseId
                  : section.to === `${base}/courses/${activeCourseId}`
                  ? location.pathname === toPath && !location.search
                  : location.pathname.startsWith(toPath)

                return (
                  <Nav.Link
                    key={section.label}
                    as={Link}
                    to={section.to}
                    className={`py-1 small ${
                      isActive ? 'fw-bold text-decoration-underline' : 'text-muted'
                    }`}
                  >
                    {section.label}
                  </Nav.Link>
                )
              })}
            </div>
          )}

          <Nav.Link
            as={Link}
            to={modulesPath}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <JournalBookmark /> Modules
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

        <div className="mt-auto mb-4 mb-sm-0 w-100 pt-3">
          <Nav.Link
            as={Link}
            to={`/${role}/profile`}
            onClick={() => setExpanded(false)}
            className="d-flex align-items-center gap-2 px-2 py-2"
          >
            <HouseGear /> Profile
          </Nav.Link>
          {fullName && (
            <div className="mb-2 mt-2">
              <span className="text-truncate ms-2">{fullName}</span>
            </div>
          )}
          <div className="pt-3 border-top">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </Navbar>
  )
}

export default AppNavbar