import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../../CourseMembersPage'
import CreateCourseView from './CreateCourseView'
import TeacherCourses from './TeacherCourses'

function CoursesRoutes() {
  return (
    <Routes>
      <Route index element={<TeacherCourses />} />
      <Route path="create" element={<CreateCourseView />} />
      {/* Placeholder for the teacher course detail page */}
      <Route path=":courseId" />
      <Route path=":courseId/members" element={<CourseMembersPage />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default CoursesRoutes
