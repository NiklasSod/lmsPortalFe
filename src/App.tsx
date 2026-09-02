import './App.css'
import CreateCourseView from './pages/CreateCourseView'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { getAccessToken, getRole } from './api/auth/auth'
import LoginView from './pages/Login/LoginView'
import CreateAccountView from './pages/Register/CreateAccountView'
import AppNavbar from './components/AppNavbar'
import TeacherCourses from './pages/Teacher/Courses/TeacherCourses'

function App() {
  useLocation()

  const isLoggedIn = Boolean(getAccessToken())
  const role = getRole()

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<CreateAccountView />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const isStudent = role === 'student'

  return (

    <div className="d-flex">
      <AppNavbar />
      <div className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              isStudent ? (
                <p className="p-4">Student dashboard</p>
              ) : (
                <p className="p-4">Teacher Dashboard</p>
              )
            }
          />

          {isStudent ? (
            <Route
              path="/student/courses"
              element={<p className="p-4">Student courses</p>}
            />
          ) : (
            <>
              <Route path="/teacher/courses" element={<TeacherCourses />} />
              <Route path="/teacher/courses/:id" />
              <Route path="/teacher/courses/create" element={<CreateCourseView />} />
            </>
          )}

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
