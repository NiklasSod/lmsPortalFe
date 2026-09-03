import { Route, Routes } from 'react-router-dom'
import CurrentModulesView from '../CurrentModulesView'
import CourseMembersPage from '../CourseMembersPage'

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Student dashboard</p>} />
      <Route path="courses" element={<p className="p-4">Student courses</p>} />
      <Route
        path="courses/:courseId/members"
        element={<CourseMembersPage />}
      />
      <Route path="modules" element={<CurrentModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default StudentRoutes
