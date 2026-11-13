import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './PortalLayout.css'

const Header = ({ onToggleSidebar = () => {} }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const [user, setUser] = useState({
    name: 'Student',
    email: '',
    role: 'STUDENT'
  })
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const loadUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.name || 'Student'
        setUser({
          name: fullName,
          email: parsed.email || '',
          role: parsed.role || 'STUDENT'
        })
      } catch {
        setUser({ name: 'Student', email: '', role: 'STUDENT' })
      }
    }
  }

  useEffect(() => {
    loadUser()
    setDropdownOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') loadUser()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setDropdownOpen(false)
    navigate('/login')
  }

  const getPageMeta = () => {
    const params = new URLSearchParams(location.search)
    const status = params.get('status')
    switch (location.pathname) {
      case '/dashboard':
        return status === 'APPROVED'
          ? { title: 'Approved Ideas', subtitle: 'Ideas reviewed and approved by faculty' }
          : { title: 'Innovation Feed', subtitle: 'Browse, discuss, and vote on student proposals' }
      case '/post-idea':
        return { title: 'Submit New Idea', subtitle: 'Share a solution to a university or community challenge' }
      case '/my-ideas':
        return { title: 'My Ideas', subtitle: 'Manage your submitted proposals and track review status' }
      case '/leaderboard':
        return { title: 'Leaderboard', subtitle: 'Top-voted student innovations across SUZA' }
      case '/profile':
        return { title: 'Profile Settings', subtitle: 'Update your personal information and password' }
      default:
        return { title: 'University Innovation Connect', subtitle: 'Student Portal' }
    }
  }

  const pageMeta = getPageMeta()
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'S'

  return (
    <header className="uic-topbar uic-topbar-static">
      <div className="uic-topbar-left">
        <button
          type="button"
          className="uic-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" />
        </button>

        <div className="uic-page-title-group">
          <h1 className="uic-page-title">{pageMeta.title}</h1>
          <p className="uic-page-subtitle">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="uic-topbar-right">
        {location.pathname !== '/post-idea' && (
          <Link to="/post-idea" className="uic-quick-btn">
            <i className="fas fa-plus" />
            <span>Submit Idea</span>
          </Link>
        )}

        <div className="uic-topbar-user-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`uic-topbar-user-btn ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <div className="uic-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.82rem' }}>
              {initial}
            </div>
            <div className="uic-topbar-user-text">
              <span className="uic-topbar-user-name">{user.name}</span>
              <span className="uic-topbar-user-role">{user.role.toLowerCase()}</span>
            </div>
            <i className="fas fa-chevron-down uic-topbar-chevron" />
          </button>

          {dropdownOpen && (
            <div className="uic-topbar-dropdown">
              <div className="uic-dropdown-user-header">
                <div className="uic-dropdown-user-name">{user.name}</div>
                {user.email && <div className="uic-dropdown-user-email">{user.email}</div>}
                <span className="uic-dropdown-role-badge">{user.role}</span>
              </div>

              <Link
                to="/profile"
                className="uic-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-user" />
                <span>Profile</span>
              </Link>

              <Link
                to="/my-ideas"
                className="uic-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-folder-open" />
                <span>My Ideas</span>
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
  )
}

export default Header
