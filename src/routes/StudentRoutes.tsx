import { Route, Routes } from 'react-router-dom'
import CourseMembersView from '../views/courses/CourseMembersView'
import CoursesView from '../views/courses/CoursesView'
import ModulesView from '../views/modules/ModulesView'
import CourseOverviewView from '../views/courses/CourseOverviewView'
import CourseModulesView from '../views/courses/CourseModulesView'
import DashboardView from '../views/dashboard/DashboardView'

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardView />} />
      <Route path="courses" element={<CoursesView />} />
      <Route path="courses/:courseId" element={<CourseOverviewView />} />
      <Route path="courses/:courseId/members" element={<CourseMembersView />} />
      <Route path="courses/:courseId/modules" element={<CourseModulesView />} />
      <Route path="modules" element={<ModulesView />} />
    </Routes>
  )
}

export default StudentRoutes
