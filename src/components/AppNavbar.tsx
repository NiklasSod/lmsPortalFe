import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { Book } from 'react-bootstrap-icons'
import { DomainIcon } from '../components/DomainIcon'
import { ThemeSwitch } from './ThemeSwitch'
import { useAuth } from '../auth/AuthContext'
import { useEditMode } from '../editMode/EditModeContext'
import { getCourseById } from '../api/course'
import { getCourseResources } from '../api/resource'

function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, fullName, logout } = useAuth()
  const { editMode } = useEditMode()
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [courseName, setCourseName] = useState('')
  const [resourceCount, setResourceCount] = useState<number>(0)
  const isStudent = role === 'student'

  const dashboardPath = isStudent ? '/student' : '/teacher'
  const coursesPath = isStudent ? '/student/courses' : '/teacher/courses'
  const modulesPath = isStudent ? '/student/modules' : '/teacher/modules'
  const activitiesPath = isStudent
    ? '/student/activities'
    : '/teacher/activities'
  const assignmentsPath = isStudent
    ? '/student/assignments'
    : '/teacher/assignments'
  const profilePath = `/${role}/profile`

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

  const isCoursesSection =
    location.pathname.includes('/courses') || Boolean(queryCourseId)

  useEffect(() => {
    if (!activeCourseId) {
      queueMicrotask(() => setResourceCount(0))
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

    getCourseResources(Number(activeCourseId))
      .then((res) => {
        if (isMounted) setResourceCount(res.length)
      })
      .catch(() => {
        if (isMounted) setResourceCount(0)
      })

    return () => {
      isMounted = false
    }
  }, [activeCourseId])

  const resourceLabel =
    resourceCount > 1 ? `Resources (${resourceCount})` : 'Resources'

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

  const isDashboardActive = location.pathname === dashboardPath
  const isCoursesActive =
    location.pathname.startsWith(coursesPath) || Boolean(queryCourseId)
  const isModulesActive = location.pathname.startsWith(modulesPath)
  const isActivitiesActive = location.pathname.startsWith(activitiesPath)
  const isAssignmentsActive =
    location.pathname.startsWith(assignmentsPath) && !queryCourseId
  const isProfileActive = location.pathname.startsWith(profilePath)

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
        <Nav className="flex-column w-100 gap-1" onClick={() => setExpanded(false)}>
          <Nav.Link
            as={Link}
            to={dashboardPath}
            onClick={() => setExpanded(false)}
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isDashboardActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="dashboard" className={isDashboardActive ? 'text-primary' : ''} /> Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={coursesPath}
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isCoursesActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="course" className={isCoursesActive ? 'text-primary' : ''} /> Courses
          </Nav.Link>

          {isCoursesSection && (activeCourseId || !isStudent) && (
            <div className="ms-3 ps-2 border-start border-secondary d-flex flex-column my-1">
              {activeCourseId ? (
                <>
                  <Nav.Link
                    as={Link}
                    to={`${base}/courses/${activeCourseId}`}
                    className={`py-1 small text-truncate ${
                      location.pathname === `${base}/courses/${activeCourseId}` && !location.search
                        ? 'fw-bold text-body'
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
                        location.pathname.startsWith(`${base}/courses/${activeCourseId}/modules`)
                          ? 'fw-bold text-body'
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
                      {resourceLabel}
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={`${base}/assignments?courseId=${activeCourseId}`}
                      className={`py-1 small ${
                        location.pathname.startsWith(`${base}/assignments`) &&
                        searchParams.get('courseId') === activeCourseId
                          ? 'fw-bold text-body'
                          : 'text-muted'
                      }`}
                    >
                      Assignments
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={`${base}/courses/${activeCourseId}/members`}
                      className={`py-1 small ${
                        location.pathname.startsWith(`${base}/courses/${activeCourseId}/members`)
                          ? 'fw-bold text-body'
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
                    isUsersRoute ? 'fw-bold text-body' : 'text-muted'
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
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isModulesActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="module" className={isModulesActive ? 'text-primary' : ''} /> Modules
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={activitiesPath}
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isActivitiesActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="activity" className={isActivitiesActive ? 'text-primary' : ''} /> Activities
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={assignmentsPath}
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isAssignmentsActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="assignment" className={isAssignmentsActive ? 'text-primary' : ''} /> Assignments
          </Nav.Link>
          <Nav.Link
            as="button"
            onClick={handleLogout}
            className="d-flex align-items-center gap-2 border-0 bg-transparent text-start px-2 py-2 mt-2 nav-link-stable"
          >
            <DomainIcon type="logout" /> Logout
          </Nav.Link>
        </Nav>

        <div className="mt-auto mb-4 mb-sm-0 w-100 pt-3">
          <Nav.Link
            as={Link}
            to={profilePath}
            onClick={() => setExpanded(false)}
            className={`d-flex align-items-center gap-2 px-2 py-2 nav-link-stable ${
              isProfileActive ? 'fw-bold' : ''
            }`}
          >
            <DomainIcon type="profile" size={16} className={isProfileActive ? 'text-primary' : ''} /> Profile
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
