import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'admin-sidebar-link active' : 'admin-sidebar-link'
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars" />
      </button>

      {isOpen && <div className="admin-sidebar-overlay" onClick={toggleSidebar} />}

      <div className={`admin-sidebar ${isOpen ? 'show' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-icon">🛡️</span>
          <span className="admin-sidebar-text">Admin</span>
          <button className="admin-sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times" />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <Link to="/admin-dashboard" className={isActive('/admin-dashboard')} onClick={() => setIsOpen(false)}>
            <i className="fas fa-tachometer-alt" />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin-users" className={isActive('/admin-users')} onClick={() => setIsOpen(false)}>
            <i className="fas fa-users" />
            <span>Users</span>
          </Link>

          <Link to="/admin-ideas" className={isActive('/admin-ideas')} onClick={() => setIsOpen(false)}>
            <i className="fas fa-lightbulb" />
            <span>Ideas</span>
          </Link>

          <Link to="/admin-lecturers" className={isActive('/admin-lecturers')} onClick={() => setIsOpen(false)}>
            <i className="fas fa-chalkboard-teacher" />
            <span>Lecturers</span>
          </Link>

          <button className="admin-sidebar-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  )
}

export default AdminSidebar