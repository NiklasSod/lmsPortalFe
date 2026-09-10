import { Route, Routes } from 'react-router-dom'
import ProfileView from '../views/profile/ProfileView'
import CourseMembersView from '../views/courses/CourseMembersView'
import CoursesView from '../views/courses/CoursesView'
import ModulesView from '../views/modules/ModulesView'
import CourseOverviewView from '../views/courses/CourseOverviewView'
import CourseModulesView from '../views/courses/CourseModulesView'
import DashboardView from '../views/dashboard/DashboardView'
import ActivitiesView from '../views/activities/ActivitiesView'
import AssignmentsView from '../views/assignments/AssignmentsView'

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardView />} />
      <Route path="profile" element={<ProfileView />} />
      <Route path="courses" element={<CoursesView />} />
      <Route path="courses/:courseId" element={<CourseOverviewView />} />
      <Route path="courses/:courseId/members" element={<CourseMembersView />} />
      <Route path="courses/:courseId/modules" element={<CourseModulesView />} />
      <Route path="modules" element={<ModulesView />} />
      <Route path="activities" element={<ActivitiesView />} />
      <Route path="assignments" element={<AssignmentsView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default StudentRoutes
