import { Link, useLocation } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'

interface CourseSectionsProps {
  courseId: string
}

interface SectionLink {
  label: string
  to: string
}

function CourseSections({ courseId }: CourseSectionsProps) {
  const { role } = useAuth()
  const isStudent = role === 'student'
  const base = isStudent ? '/student' : '/teacher'
  const coursesPath = '/courses'
  const location = useLocation()

  const sections: SectionLink[] = [
    { label: 'Overview', to: `${base}${coursesPath}/${courseId}` },
    { label: 'Modules', to: `${base}${coursesPath}/${courseId}/modules` },
    { label: 'Assignments', to: `${base}/assignments?courseId=${courseId}` },
    { label: 'Members', to: `${base}${coursesPath}/${courseId}/members` },
  ]

  return (
    <>
      <h2 className="h6 border-bottom pb-2">Sections</h2>
      <Nav className="flex-column text-start">
        {sections.map((section) => {
          const toPath = section.to.split('?')[0]
          const isActive =
            section.to === `${base}${coursesPath}/${courseId}`
              ? location.pathname === toPath
              : location.pathname.startsWith(toPath)

          return (
            <Nav.Link
              key={section.label}
              as={Link}
              to={section.to}
              className={`${isActive ? 'fw-bold active ' : ''}text-decoration-underline ps-0`}
            >
              {section.label}
            </Nav.Link>
          )
        })}
      </Nav>
    </>
  )
}

export default CourseSections
