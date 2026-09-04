import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import LoginView from './pages/Login/LoginView'
import CreateAccountView from './pages/Register/CreateAccountView'
import AppLayout from './components/AppLayout'
import StudentRoutes from './pages/Student/StudentRoutes'
import TeacherRoutes from './pages/Teacher/TeacherRoutes'

function App() {
  const { isLoggedIn, role } = useAuth()

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
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Navigate to={isStudent ? '/student' : '/teacher'} replace />
          }
        />
        <Route
          path="/student/*"
          element={isStudent ? <StudentRoutes /> : <Navigate to="/" replace />}
        />
        <Route
          path="/teacher/*"
          element={isStudent ? <Navigate to="/" replace /> : <TeacherRoutes />}
        />
        <Route path="*" element={<p className="p-4">Page not found.</p>} />
      </Route>
    </Routes>
  )
}

export default App
