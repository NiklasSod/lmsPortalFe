import { Route, Routes } from 'react-router-dom'
import CreateCourseView from '../CreateCourseView'
import TeacherCourses from './Courses/TeacherCourses'

function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Teacher Dashboard</p>} />
      <Route path="courses" element={<TeacherCourses />} />
      <Route path="courses/create" element={<CreateCourseView />} />
      {/* Placeholder for the teacher course detail page */}
      <Route path="courses/:id" />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default TeacherRoutes
