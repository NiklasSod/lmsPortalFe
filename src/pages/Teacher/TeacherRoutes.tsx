import { Route, Routes } from 'react-router-dom'
import CoursesRoutes from './Courses/CoursesRoutes'

function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Teacher Dashboard</p>} />
      <Route path="courses/*" element={<CoursesRoutes />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default TeacherRoutes
