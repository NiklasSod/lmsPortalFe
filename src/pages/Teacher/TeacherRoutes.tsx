import { Route, Routes } from 'react-router-dom'
import CurrentModulesView from '../CurrentModulesView'
import CoursesRoutes from './Courses/CoursesRoutes'
import CourseModulesView from '../CourseModulesView'
import CourseOverviewView from '../CourseOverviewView'

function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<p className="p-4">Teacher Dashboard</p>} />
      <Route path="courses/*" element={<CoursesRoutes />} />
      <Route path="courses/:courseId" element={<CourseOverviewView />} />
      <Route path="courses/:courseId/modules" element={<CourseModulesView />} />
      <Route path="modules" element={<CurrentModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default TeacherRoutes