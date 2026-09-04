import { Route, Routes } from 'react-router-dom'
import CourseMembersPage from '../../CourseMembersPage'
import CoursesPage from '../../CoursesPage'
import CreateCourseView from './CreateCourseView'
import CourseOverviewView from '../../CourseOverviewView'
import CourseModulesView from '../../CourseModulesView'

function CoursesRoutes() {
  return (
    <Routes>
      <Route index element={<CoursesPage />} />
      <Route path="create" element={<CreateCourseView />} />
      <Route path=":courseId" element={<CourseOverviewView />} />
      <Route path=":courseId/members" element={<CourseMembersPage />} />
      <Route path=":courseId/modules" element={<CourseModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default CoursesRoutes
