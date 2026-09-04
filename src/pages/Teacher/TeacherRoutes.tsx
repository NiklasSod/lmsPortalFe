import { Route, Routes } from 'react-router-dom'
import ModulesView from '../ModulesView'
import CoursesRoutes from './Courses/CoursesRoutes'
import UsersPage from './Admin/UsersPage'

function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Teacher Dashboard</p>} />
      <Route path="courses/*" element={<CoursesRoutes />} />
      <Route path="modules" element={<ModulesView />} />
      <Route path="admin/users" element={<UsersPage />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default TeacherRoutes
