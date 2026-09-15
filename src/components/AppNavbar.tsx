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
import { useEditMode } from '../editMode/EditModeContext'
import { getCourseById } from '../api/course'

function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, fullName, logout } = useAuth()
  const { editMode } = useEditMode()
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [courseName, setCourseName] = useState('')
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

  const searchParams = new URLSearchParams(location.search)
  const queryCourseId = searchParams.get('courseId')

  const pathSegments = location.pathname.split('/')
  const coursesIndex = pathSegments.indexOf('courses')
  const nextSegment =
    coursesIndex !== -1 && pathSegments.length > coursesIndex + 1
      ? pathSegments[coursesIndex + 1]
      : null

  const isUsersRoute = nextSegment === 'users'
  const pathCourseId =
    !isUsersRoute && nextSegment !== 'create' ? nextSegment : null

  const activeCourseId = pathCourseId || queryCourseId

  // Keep the courses submenu open if we are in a course route OR viewing course-specific assignments
  const isCoursesSection =
    location.pathname.includes('/courses') || Boolean(queryCourseId)

  // Fetch course name dynamically using getCourseById
  useEffect(() => {
    if (!activeCourseId) {
      return
    }

    let isMounted = true
    getCourseById(activeCourseId)
      .then((data) => {
        if (isMounted && data && data.name) {
          setCourseName(data.name)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCourseName(`Course ${activeCourseId}`)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeCourseId])

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
              isCoursesSection ? 'fw-bold' : ''
            }`}
          >
            <MortarboardFill /> Courses
          </Nav.Link>

          {isCoursesSection && (
            <div className="ms-3 ps-2 border-start border-secondary d-flex flex-column my-1">
              {/* If inside a specific course */}
              {activeCourseId ? (
                <>
                  <Nav.Link
                    as={Link}
                    to={`${base}/courses/${activeCourseId}`}
                    className={`py-1 small fw-semibold text-truncate ${
                      location.pathname ===
                        `${base}/courses/${activeCourseId}` && !location.search
                        ? 'fw-bold text-decoration-underline text-white'
                        : 'text-muted'
                    }`}
                  >
                    {courseName || `Course ${activeCourseId}`}
                  </Nav.Link>

                  <div className="ms-3 ps-2 border-start border-secondary d-flex flex-column my-1">
                    <Nav.Link
                      as={Link}
                      to={`${base}/courses/${activeCourseId}/modules`}
                      className={`py-1 small ${
                        location.pathname.startsWith(
                          `${base}/courses/${activeCourseId}/modules`,
                        )
                          ? 'fw-bold text-decoration-underline'
                          : 'text-muted'
                      }`}
                    >
                      Modules
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={`${base}/courses/${activeCourseId}/resources`}
                      className={`py-1 small ${
                        location.pathname.startsWith(
                          `${base}/courses/${activeCourseId}/resources`,
                        )
                          ? 'fw-bold text-decoration-underline'
                          : 'text-muted'
                      }`}
                    >
                      Resources
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={`${base}/assignments?courseId=${activeCourseId}`}
                      className={`py-1 small ${
                        location.pathname.startsWith(`${base}/assignments`) &&
                        searchParams.get('courseId') === activeCourseId
                          ? 'fw-bold text-decoration-underline'
                          : 'text-muted'
                      }`}
                    >
                      Assignments
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={`${base}/courses/${activeCourseId}/members`}
                      className={`py-1 small ${
                        location.pathname.startsWith(
                          `${base}/courses/${activeCourseId}/members`,
                        )
                          ? 'fw-bold text-decoration-underline'
                          : 'text-muted'
                      }`}
                    >
                      Members
                    </Nav.Link>
                  </div>
                </>
              ) : null}

              {/* Edit Students is only shown in the submenu when edit mode is on */}
              {!isStudent && editMode && (
                <Nav.Link
                  as={Link}
                  to={`${base}/courses/users`}
                  className={`py-1 small ${
                    isUsersRoute
                      ? 'fw-bold text-decoration-underline'
                      : 'text-muted'
                  }`}
                >
                  Edit Students
                </Nav.Link>
              )}
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
