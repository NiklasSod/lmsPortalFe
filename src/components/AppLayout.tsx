import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'

function AppLayout() {
  return (
    <div className="app-layout d-flex">
      <AppNavbar />
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
