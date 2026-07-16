import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

const AdminSidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'show' : ''}`}>
        
        {/* Brand */}
        <div className="sidebar-brand">
          <span className="brand-icon">👑</span>
          <span className="brand-text">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className={`sidebar-link ${isActive('/admin-dashboard')}`}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>

          <Link to="/admin-users" className={`sidebar-link ${isActive('/admin-users')}`}>
            <i className="fas fa-users"></i>
            <span>Users</span>
          </Link>

          <Link to="/admin-ideas" className={`sidebar-link ${isActive('/admin-ideas')}`}>
            <i className="fas fa-lightbulb"></i>
            <span>Ideas</span>
          </Link>

          <Link to="/admin-lecturers" className={`sidebar-link ${isActive('/admin-lecturers')}`}>
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Lecturers</span>
          </Link>

          <button className="sidebar-link logout" onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-version">v1.0.0</div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
    </>
  )
}

export default AdminSidebar