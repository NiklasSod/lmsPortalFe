import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import CourseStudentsPage from './pages/CourseStudentsPage'

function App() {
  return (
    <div className="d-flex">
      <AppNavbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<p>Ello Worldi!</p>} />
          <Route
            path="/courses/:courseId/students"
            element={<CourseStudentsPage />}
          />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
