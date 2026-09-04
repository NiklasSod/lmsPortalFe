import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../CourseMembersPage'
import CoursesPage from '../CoursesPage'
import ModulesView from '../ModulesView'
import CourseOverviewView from '../CourseOverviewView'
import CourseModulesView from '../CourseModulesView'

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Student dashboard</p>} />
      <Route path="courses" element={<CoursesPage />} />
      <Route path="courses/:courseId" element={<CourseOverviewView />} />
      <Route path="courses/:courseId/members" element={<CourseMembersPage />} />
      <Route path="courses/:courseId/modules" element={<CourseModulesView />} />
      <Route path="modules" element={<ModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default StudentRoutes
