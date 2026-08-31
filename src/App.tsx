import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<p>Ello Worldi!</p>} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  )
}

export default App
