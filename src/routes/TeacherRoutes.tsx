import { Route, Routes } from 'react-router-dom'
import ProfileView from '../views/profile/ProfileView'
import DashboardView from '../views/dashboard/DashboardView'
import CoursesView from '../views/courses/CoursesView'
import CreateCourseView from '../views/courses/CreateCourseView'
import EditCourseView from '../views/courses/EditCourseView'
import CourseOverviewView from '../views/courses/CourseOverviewView'
import CourseModulesView from '../views/courses/CourseModulesView'
import CourseMembersView from '../views/courses/CourseMembersView'
import EditUsersView from '../views/courses/EditUsersView'
import ModulesView from '../views/modules/ModulesView'

function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardView />} />
      <Route path="profile" element={<ProfileView />} />
      <Route path="courses" element={<CoursesView />} />
      <Route path="courses/create" element={<CreateCourseView />} />
      <Route path="courses/:courseId/edit" element={<EditCourseView />} />
      <Route path="courses/:courseId" element={<CourseOverviewView />} />
      <Route path="courses/:courseId/modules" element={<CourseModulesView />} />
      <Route path="courses/:courseId/members" element={<CourseMembersView />} />
      <Route path="courses/users" element={<EditUsersView />} />
      <Route path="modules" element={<ModulesView />} />
      <Route path="*" element={<p className="p-4">Page not found.</p>} />
    </Routes>
  )
}

export default TeacherRoutes
