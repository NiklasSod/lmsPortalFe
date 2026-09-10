import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'

function AppLayout() {
  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <AppNavbar />
      <div
        className="flex-grow-1"
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
