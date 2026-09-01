import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginView from './pages/LoginView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  )
}

export default App
