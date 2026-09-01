import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginView from './pages/LoginView'
import CreateAccountView from './pages/CreateAccountView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<CreateAccountView />} />
      <Route path="/create-account" element={<CreateAccountView />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  )
}

export default App
