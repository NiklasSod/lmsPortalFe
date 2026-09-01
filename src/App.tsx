import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import TeacherCourses from './pages/teachers/TeacherCourses'
import TestLogin from './pages/TestLogin'

function App() {
  return (
    <div className="d-flex">
      <AppNavbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<p className="p-4">Ello Worldi!</p>} />
          <Route path="/login" element={<TestLogin />} />

          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/:id" />

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
