import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import TeacherCourses from './pages/teachers/TeacherCourses'
import CourseStudentsPage from './pages/students/CourseStudentsPage'

function App() {
  return (
    <div className="d-flex">
      <AppNavbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<p className="p-4">Ello Worldi!</p>} />

          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/:id" />
          <Route
            path="/student/courses/:id/students"
            element={<CourseStudentsPage />}
          />

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
