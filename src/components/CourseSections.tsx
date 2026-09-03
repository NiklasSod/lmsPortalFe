import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { getRole } from '../api/auth'

interface CourseSectionsProps {
  courseId: string
}

interface SectionLink {
  label: string
  to: string
  active: boolean
}

function CourseSections({ courseId }: CourseSectionsProps) {
  const isStudent = getRole() === 'student'
  const base = isStudent ? '/student/courses' : '/teacher/courses'

  const sections: SectionLink[] = [
    { label: 'Overview', to: `${base}/${courseId}`, active: false },
    { label: 'Modules', to: `${base}/${courseId}/modules`, active: false },
    {
      label: 'Assignments',
      to: `${base}/${courseId}/assignments`,
      active: false,
    },
    { label: 'Students', to: `${base}/${courseId}/students`, active: true },
  ]

  return (
    <>
      <h2 className="h6 border-bottom pb-2">Sections</h2>
      <Nav className="flex-column text-start">
        {sections.map((section) => (
          <Nav.Link
            key={section.label}
            as={Link}
            to={section.to}
            className={`${section.active ? 'fw-bold active ' : ''}text-decoration-underline ps-0`}
          >
            {section.label}
          </Nav.Link>
        ))}
      </Nav>
    </>
  )
}

export default CourseSections
