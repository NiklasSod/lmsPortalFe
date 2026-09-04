import { Link, useLocation } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { getRole } from '../api/auth'

interface CourseSectionsProps {
  courseId: string
}

interface SectionLink {
  label: string
  to: string
}

function CourseSections({ courseId }: CourseSectionsProps) {
  const isStudent = getRole() === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'
  const location = useLocation()

  const sections: SectionLink[] = [
    { label: 'Overview', to: `${base}/${courseId}` },
    { label: 'Modules', to: `${base}/${courseId}/modules` },
    { label: 'Assignments', to: `${base}/${courseId}/assignments` },
    { label: 'Members', to: `${base}/${courseId}/members` },
  ]

  return (
    <>
      <h2 className="h6 border-bottom pb-2">Sections</h2>
      <Nav className="flex-column text-start">
        {sections.map((section) => {
          const isActive =
            section.to === `${base}/${courseId}`
              ? location.pathname === section.to
              : location.pathname.startsWith(section.to)

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