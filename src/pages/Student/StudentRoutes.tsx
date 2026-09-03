import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../CourseMembersPage'
import CoursesPage from '../CoursesPage'
import CurrentModulesView from '../ModulesView'

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Student dashboard</p>} />
      <Route path="courses" element={<CoursesPage />} />
      <Route path="courses/:courseId/members" element={<CourseMembersPage />} />
      <Route path="modules" element={<CurrentModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default StudentRoutes
