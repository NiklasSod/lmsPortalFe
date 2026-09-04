import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../../CourseMembersPage'
import CoursesPage from '../../CoursesPage'
import CreateCourseView from './CreateCourseView'
import EditCourseView from './EditCourseView'

function CoursesRoutes() {
  return (
    <Routes>
      <Route index element={<CoursesPage />} />
      <Route path="create" element={<CreateCourseView />} />
      <Route path=":courseId/edit" element={<EditCourseView />} />
      {/* Placeholder for the teacher course detail page */}
      <Route path=":courseId" />
      <Route path=":courseId/members" element={<CourseMembersPage />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}


export default CoursesRoutes
