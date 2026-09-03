import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../../CourseMembersPage'
import CoursesPage from '../../CoursesPage'
import CreateCourseView from './CreateCourseView'

function CoursesRoutes() {
  return (
    <Routes>
      <Route index element={<CoursesPage />} />
      <Route path="create" element={<CreateCourseView />} />
      {/* Placeholder for the teacher course detail page */}
      <Route path=":courseId" />
      <Route path=":courseId/members" element={<CourseMembersPage />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default CoursesRoutes
