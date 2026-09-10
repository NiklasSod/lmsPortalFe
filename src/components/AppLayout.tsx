import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'

function AppLayout() {
  return (
    <div 
      className="app-layout d-flex"
      style={{ height: '100vh', overflow: 'hidden' }}>
      <AppNavbar />
      <main 
        className="flex-grow-1 p-4"
        style={{ height: '100vh', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
