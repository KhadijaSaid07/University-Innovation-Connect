import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './PortalLayout.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const [user, setUser] = useState({
    id: null,
    name: 'Student',
    email: '',
    role: 'STUDENT'
  })
  const [counts, setCounts] = useState({ total: 0, approved: 0, mine: 0 })
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const loadUser = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.name || 'Student'
        setUser({
          id: parsed.id || null,
          name: fullName,
          email: parsed.email || '',
          role: parsed.role || 'STUDENT'
        })
        return parsed
      } catch {
        // ignore parse errors
      }
    }
    return null
  }

  useEffect(() => {
    const currentUser = loadUser()
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const ideas = res.data || []
        const approvedCount = ideas.filter(i => i.status === 'APPROVED' || i.status === 'IMPLEMENTED').length
        const myCount = currentUser?.id ? ideas.filter(i => i.userId === currentUser.id).length : 0
        setCounts({
          total: ideas.length,
          approved: approvedCount,
          mine: myCount
        })
      } catch {
        // ignore background count errors
      }
    }
    fetchCounts()
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserMenuOpen(false)
    navigate('/login')
  }

  const searchParams = new URLSearchParams(location.search)
  const currentStatusFilter = searchParams.get('status')

  const isDashboardAll = location.pathname === '/dashboard' && !currentStatusFilter
  const isDashboardApproved = location.pathname === '/dashboard' && currentStatusFilter === 'APPROVED'
  const isActive = (path) => location.pathname === path ? 'active' : ''

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'S'

  return (
    <>
      <div
        className={`uic-sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`uic-sidebar ${isOpen ? 'show' : ''}`}>
        <Link to="/dashboard" className="uic-sidebar-brand" onClick={onClose}>
          <div className="uic-brand-mark">
            <i className="fas fa-lightbulb" />
          </div>
          <div className="uic-brand-copy">
            <span className="uic-brand-title">UIC Platform</span>
            <span className="uic-brand-subtitle">Student Workspace</span>
          </div>
        </Link>

        <nav className="uic-sidebar-nav">
          <div className="uic-nav-section-label">Explore</div>

          <Link
            to="/dashboard"
            className={`uic-nav-item ${isDashboardAll ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-compass" />
              <span>All Ideas</span>
            </span>
            {counts.total > 0 && <span className="uic-nav-badge">{counts.total}</span>}
          </Link>

          <Link
            to="/dashboard?status=APPROVED"
            className={`uic-nav-item ${isDashboardApproved ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-check-circle" />
              <span>Approved Ideas</span>
            </span>
            {counts.approved > 0 && <span className="uic-nav-badge">{counts.approved}</span>}
          </Link>

          <Link
            to="/leaderboard"
            className={`uic-nav-item ${isActive('/leaderboard')}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-trophy" />
              <span>Leaderboard</span>
            </span>
          </Link>

          <div className="uic-nav-section-label">My Innovation</div>

          <Link
            to="/post-idea"
            className={`uic-nav-item ${isActive('/post-idea')}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-plus-circle" />
              <span>Submit New Idea</span>
            </span>
          </Link>

          <Link
            to="/my-ideas"
            className={`uic-nav-item ${isActive('/my-ideas')}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-folder-open" />
              <span>My Ideas</span>
            </span>
            {counts.mine > 0 && <span className="uic-nav-badge">{counts.mine}</span>}
          </Link>

          <div className="uic-nav-section-label">Account</div>

          <Link
            to="/profile"
            className={`uic-nav-item ${isActive('/profile')}`}
            onClick={onClose}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-user-cog" />
              <span>Profile Settings</span>
            </span>
          </Link>
        </nav>

        <div className="uic-sidebar-footer" ref={menuRef}>
          {userMenuOpen && (
            <div className="uic-sidebar-user-menu">
              <div className="uic-sidebar-menu-header">
                <div className="uic-sidebar-menu-name">{user.name}</div>
                {user.email && <div className="uic-sidebar-menu-email">{user.email}</div>}
              </div>

              <Link
                to="/profile"
                className="uic-sidebar-menu-item"
                onClick={() => {
                  setUserMenuOpen(false)
                  onClose()
                }}
              >
                <i className="fas fa-user" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/my-ideas"
                className="uic-sidebar-menu-item"
                onClick={() => {
                  setUserMenuOpen(false)
                  onClose()
                }}
              >
                <i className="fas fa-folder-open" />
                <span>My Ideas</span>
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
            className={`uic-sidebar-user-btn ${userMenuOpen ? 'open' : ''}`}
            onClick={() => setUserMenuOpen(prev => !prev)}
            title="Account menu"
          >
            <div className="uic-sidebar-user-info">
              <div className="uic-user-avatar">{initial}</div>
              <div className="uic-user-meta">
                <span className="uic-user-name">{user.name}</span>
                <span className="uic-user-role">Student Account</span>
              </div>
            </div>
            <i className="fas fa-chevron-up uic-sidebar-chevron" />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
