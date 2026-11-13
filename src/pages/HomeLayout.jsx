import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../components/PortalLayout.css'

const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="uic-student-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="uic-student-main">
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="uic-student-body">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default HomeLayout
