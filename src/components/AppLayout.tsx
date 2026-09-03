import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'

function AppLayout() {
  return (
    <div className="d-flex">
      <AppNavbar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
