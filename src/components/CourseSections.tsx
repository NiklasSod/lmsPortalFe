import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

interface CourseSectionsProps {
  courseId: string
}

function CourseSections({ courseId }: CourseSectionsProps) {
  return (
    <>
      <h2 className="h6 border-bottom pb-2">Sections</h2>
      <Nav className="flex-column text-start">
        <Nav.Link
          as={Link}
          to={`/teacher/courses/${courseId}`}
          className="text-decoration-underline ps-0"
        >
          Overview
        </Nav.Link>
        <Nav.Link
          as={Link}
          to={`/teacher/courses/${courseId}/modules`}
          className="text-decoration-underline ps-0"
        >
          Modules
        </Nav.Link>
        <Nav.Link
          as={Link}
          to={`/teacher/courses/${courseId}/assignments`}
          className="text-decoration-underline ps-0"
        >
          Assignments
        </Nav.Link>
        <Nav.Link
          as={Link}
          to={`/teacher/courses/${courseId}/students`}
          className="fw-bold active text-decoration-underline ps-0"
        >
          Students
        </Nav.Link>
      </Nav>
    </>
  )
}

export default CourseSections
