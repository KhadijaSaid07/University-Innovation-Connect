import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../components/PortalLayout.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const AdminSidebar = ({
  pageTitle = 'Admin Console',
  pageSubtitle = 'Manage users, lecturers, student ideas, and system activity'
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarMenuRef = useRef(null)
  const topbarMenuRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [sidebarUserMenuOpen, setSidebarUserMenuOpen] = useState(false)
  const [topbarUserMenuOpen, setTopbarUserMenuOpen] = useState(false)
  const [admin, setAdmin] = useState({
    name: 'System Admin',
    email: 'admin@uic.com',
    role: 'ADMIN'
  })
  const [counts, setCounts] = useState({
    users: 0,
    lecturers: 0,
    ideas: 0,
    pendingIdeas: 0
  })

  const loadAdmin = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.name || 'System Admin'
        setAdmin({
          name: fullName,
          email: parsed.email || 'admin@uic.com',
          role: parsed.role || 'ADMIN'
        })
      } catch {
        // ignore parse errors
      }
    }
  }

  useEffect(() => {
    loadAdmin()
    setIsOpen(false)
    setSidebarUserMenuOpen(false)
    setTopbarUserMenuOpen(false)

    const fetchCounts = async () => {
      try {
        const cachedRaw = sessionStorage.getItem('uic_admin_counts_cache')
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw)
          if (Date.now() - cached.ts < 30000 && cached.data) {
            setCounts(cached.data)
            return
          }
        }
        const [usersRes, ideasRes] = await Promise.all([
          axios.get(`${API}/user`),
          axios.get(`${API}/idea`)
        ])
        const users = usersRes.data || []
        const ideas = ideasRes.data || []
        const nextCounts = {
          users: users.length,
          lecturers: users.filter(u => u.role === 'LECTURER').length,
          ideas: ideas.length,
          pendingIdeas: ideas.filter(i => i.status === 'PENDING').length
        }
        setCounts(nextCounts)
        sessionStorage.setItem('uic_admin_counts_cache', JSON.stringify({ ts: Date.now(), data: nextCounts }))
      } catch {
        // ignore background count error
      }
    }
    fetchCounts()
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(e.target)) {
        setSidebarUserMenuOpen(false)
      }
      if (topbarMenuRef.current && !topbarMenuRef.current.contains(e.target)) {
        setTopbarUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''
  const initial = admin.name ? admin.name.charAt(0).toUpperCase() : 'A'

  return (
    <>
      <div
        className={`uic-sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`uic-sidebar ${isOpen ? 'show' : ''}`}>
        <Link to="/admin-dashboard" className="uic-sidebar-brand">
          <div className="uic-brand-mark">
            <i className="fas fa-shield-alt" />
          </div>
          <div className="uic-brand-copy">
            <span className="uic-brand-title">UIC Platform</span>
            <span className="uic-brand-subtitle">Administration</span>
          </div>
        </Link>

        <nav className="uic-sidebar-nav">
          <div className="uic-nav-section-label">Overview</div>

          <Link
            to="/admin-dashboard"
            className={`uic-nav-item ${isActive('/admin-dashboard')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-chart-pie" />
              <span>Dashboard</span>
            </span>
          </Link>

          <Link
            to="/admin-activity-logs"
            className={`uic-nav-item ${isActive('/admin-activity-logs')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-stream" />
              <span>Activity Log</span>
            </span>
          </Link>

          <div className="uic-nav-section-label">Management</div>

          <Link
            to="/admin-ideas"
            className={`uic-nav-item ${isActive('/admin-ideas')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-lightbulb" />
              <span>Ideas</span>
            </span>
            {counts.ideas > 0 && <span className="uic-nav-badge">{counts.ideas}</span>}
          </Link>

          <Link
            to="/admin-users"
            className={`uic-nav-item ${isActive('/admin-users')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-users" />
              <span>Users</span>
            </span>
            {counts.users > 0 && <span className="uic-nav-badge">{counts.users}</span>}
          </Link>

          <Link
            to="/admin-lecturers"
            className={`uic-nav-item ${isActive('/admin-lecturers')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-user-tie" />
              <span>Lecturers</span>
            </span>
            {counts.lecturers > 0 && <span className="uic-nav-badge">{counts.lecturers}</span>}
          </Link>

          <div className="uic-nav-section-label">Account</div>

          <Link
            to="/admin-profile"
            className={`uic-nav-item ${isActive('/admin-profile')}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-user-cog" />
              <span>Profile Settings</span>
            </span>
          </Link>
        </nav>

        <div className="uic-sidebar-footer" ref={sidebarMenuRef}>
          {sidebarUserMenuOpen && (
            <div className="uic-sidebar-user-menu">
              <div className="uic-sidebar-menu-header">
                <div className="uic-sidebar-menu-name">{admin.name}</div>
                {admin.email && <div className="uic-sidebar-menu-email">{admin.email}</div>}
              </div>

              <Link
                to="/admin-profile"
                className="uic-sidebar-menu-item"
                onClick={() => setSidebarUserMenuOpen(false)}
              >
                <i className="fas fa-user" />
                <span>Profile</span>
              </Link>

              <Link
                to="/admin-activity-logs"
                className="uic-sidebar-menu-item"
                onClick={() => setSidebarUserMenuOpen(false)}
              >
                <i className="fas fa-stream" />
                <span>Activity Log</span>
              </Link>

              <button
                type="button"
                className="uic-sidebar-menu-item danger"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className={`uic-sidebar-user-btn ${sidebarUserMenuOpen ? 'open' : ''}`}
            onClick={() => setSidebarUserMenuOpen(prev => !prev)}
          >
            <div className="uic-sidebar-user-info">
              <div className="uic-user-avatar">{initial}</div>
              <div className="uic-user-meta">
                <span className="uic-user-name">{admin.name}</span>
                <span className="uic-user-role">Administrator</span>
              </div>
            </div>
            <i className="fas fa-chevron-up uic-sidebar-chevron" />
          </button>
        </div>
      </aside>

      <header className="uic-topbar">
        <div className="uic-topbar-left">
          <button
            type="button"
            className="uic-mobile-toggle"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars" />
          </button>

          <div className="uic-page-title-group">
            <h1 className="uic-page-title">{pageTitle}</h1>
            {pageSubtitle && <p className="uic-page-subtitle">{pageSubtitle}</p>}
          </div>
        </div>

        <div className="uic-topbar-right">
          <div className="uic-topbar-user-wrapper" ref={topbarMenuRef}>
            <button
              type="button"
              className={`uic-topbar-user-btn ${topbarUserMenuOpen ? 'open' : ''}`}
              onClick={() => setTopbarUserMenuOpen(prev => !prev)}
            >
              <div className="uic-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.82rem' }}>
                {initial}
              </div>
              <div className="uic-topbar-user-text">
                <span className="uic-topbar-user-name">{admin.name}</span>
                <span className="uic-topbar-user-role">Administrator</span>
              </div>
              <i className="fas fa-chevron-down uic-topbar-chevron" />
            </button>

            {topbarUserMenuOpen && (
              <div className="uic-topbar-dropdown">
                <div className="uic-dropdown-user-header">
                  <div className="uic-dropdown-user-name">{admin.name}</div>
                  {admin.email && <div className="uic-dropdown-user-email">{admin.email}</div>}
                  <span className="uic-dropdown-role-badge">{admin.role}</span>
                </div>

                <Link
                  to="/admin-profile"
                  className="uic-dropdown-item"
                  onClick={() => setTopbarUserMenuOpen(false)}
                >
                  <i className="fas fa-user" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/admin-activity-logs"
                  className="uic-dropdown-item"
                  onClick={() => setTopbarUserMenuOpen(false)}
                >
                  <i className="fas fa-stream" />
                  <span>Activity Log</span>
                </Link>

                <div className="uic-dropdown-divider" />

                <button
                  type="button"
                  className="uic-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default AdminSidebar
