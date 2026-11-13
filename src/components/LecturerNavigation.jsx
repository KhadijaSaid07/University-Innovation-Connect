import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './PortalLayout.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const LecturerNavigation = ({
  pageTitle = 'Lecturer Dashboard',
  pageSubtitle = 'Review student proposals and provide academic feedback',
  activeFilter = null,
  onSelectFilter = null
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarMenuRef = useRef(null)
  const topbarMenuRef = useRef(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarUserMenuOpen, setSidebarUserMenuOpen] = useState(false)
  const [topbarUserMenuOpen, setTopbarUserMenuOpen] = useState(false)
  const [lecturer, setLecturer] = useState({
    name: 'Lecturer',
    email: '',
    role: 'LECTURER'
  })
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    underReview: 0,
    approved: 0
  })

  const loadUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.name || 'Lecturer'
        setLecturer({
          name: fullName,
          email: parsed.email || '',
          role: parsed.role || 'LECTURER'
        })
      } catch {
        // ignore parse error
      }
    }
  }

  useEffect(() => {
    loadUser()
    setSidebarUserMenuOpen(false)
    setTopbarUserMenuOpen(false)
    setSidebarOpen(false)

    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const ideas = res.data || []
        setCounts({
          all: ideas.length,
          pending: ideas.filter(i => i.status === 'PENDING').length,
          underReview: ideas.filter(i => i.status === 'UNDER_REVIEW').length,
          approved: ideas.filter(i => i.status === 'APPROVED' || i.status === 'IMPLEMENTED').length
        })
      } catch {
        // ignore count fetch error
      }
    }
    fetchCounts()
  }, [location.pathname, location.search])

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

  const params = new URLSearchParams(location.search)
  const currentFilter = activeFilter || params.get('filter') || 'all'
  const onDashboard = location.pathname === '/lecturer-dashboard'

  const handleFilterClick = (filterVal, e) => {
    setSidebarOpen(false)
    if (onDashboard && typeof onSelectFilter === 'function') {
      e.preventDefault()
      onSelectFilter(filterVal)
    }
  }

  const initial = lecturer.name ? lecturer.name.charAt(0).toUpperCase() : 'L'

  return (
    <>
      <div
        className={`uic-sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`uic-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <Link to="/lecturer-dashboard" className="uic-sidebar-brand">
          <div className="uic-brand-mark">
            <i className="fas fa-graduation-cap" />
          </div>
          <div className="uic-brand-copy">
            <span className="uic-brand-title">UIC Platform</span>
            <span className="uic-brand-subtitle">Lecturer Portal</span>
          </div>
        </Link>

        <nav className="uic-sidebar-nav">
          <div className="uic-nav-section-label">Review Queue</div>

          <Link
            to="/lecturer-dashboard"
            onClick={(e) => handleFilterClick('all', e)}
            className={`uic-nav-item ${onDashboard && currentFilter === 'all' ? 'active' : ''}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-layer-group" />
              <span>All Submissions</span>
            </span>
            {counts.all > 0 && <span className="uic-nav-badge">{counts.all}</span>}
          </Link>

          <Link
            to="/lecturer-dashboard?filter=PENDING"
            onClick={(e) => handleFilterClick('PENDING', e)}
            className={`uic-nav-item ${onDashboard && currentFilter === 'PENDING' ? 'active' : ''}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-clock" />
              <span>Pending Review</span>
            </span>
            {counts.pending > 0 && <span className="uic-nav-badge">{counts.pending}</span>}
          </Link>

          <Link
            to="/lecturer-dashboard?filter=UNDER_REVIEW"
            onClick={(e) => handleFilterClick('UNDER_REVIEW', e)}
            className={`uic-nav-item ${onDashboard && currentFilter === 'UNDER_REVIEW' ? 'active' : ''}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-clipboard-check" />
              <span>Under Review</span>
            </span>
            {counts.underReview > 0 && <span className="uic-nav-badge">{counts.underReview}</span>}
          </Link>

          <Link
            to="/lecturer-dashboard?filter=APPROVED"
            onClick={(e) => handleFilterClick('APPROVED', e)}
            className={`uic-nav-item ${onDashboard && currentFilter === 'APPROVED' ? 'active' : ''}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-check-circle" />
              <span>Approved Ideas</span>
            </span>
            {counts.approved > 0 && <span className="uic-nav-badge">{counts.approved}</span>}
          </Link>

          <div className="uic-nav-section-label">Community</div>

          <Link
            to="/lecturer-leaderboard"
            className={`uic-nav-item ${location.pathname === '/lecturer-leaderboard' ? 'active' : ''}`}
          >
            <span className="uic-nav-item-left">
              <i className="fas fa-trophy" />
              <span>Leaderboard</span>
            </span>
          </Link>

          <div className="uic-nav-section-label">Account</div>

          <Link
            to="/lecturer-profile"
            className={`uic-nav-item ${location.pathname === '/lecturer-profile' ? 'active' : ''}`}
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
                <div className="uic-sidebar-menu-name">{lecturer.name}</div>
                {lecturer.email && <div className="uic-sidebar-menu-email">{lecturer.email}</div>}
              </div>

              <Link
                to="/lecturer-profile"
                className="uic-sidebar-menu-item"
                onClick={() => setSidebarUserMenuOpen(false)}
              >
                <i className="fas fa-user" />
                <span>Profile</span>
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
                <span className="uic-user-name">{lecturer.name}</span>
                <span className="uic-user-role">Faculty Lecturer</span>
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
            onClick={() => setSidebarOpen(prev => !prev)}
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
                <span className="uic-topbar-user-name">{lecturer.name}</span>
                <span className="uic-topbar-user-role">Lecturer</span>
              </div>
              <i className="fas fa-chevron-down uic-topbar-chevron" />
            </button>

            {topbarUserMenuOpen && (
              <div className="uic-topbar-dropdown">
                <div className="uic-dropdown-user-header">
                  <div className="uic-dropdown-user-name">{lecturer.name}</div>
                  {lecturer.email && <div className="uic-dropdown-user-email">{lecturer.email}</div>}
                  <span className="uic-dropdown-role-badge">{lecturer.role}</span>
                </div>

                <Link
                  to="/lecturer-profile"
                  className="uic-dropdown-item"
                  onClick={() => setTopbarUserMenuOpen(false)}
                >
                  <i className="fas fa-user" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/lecturer-dashboard"
                  className="uic-dropdown-item"
                  onClick={() => setTopbarUserMenuOpen(false)}
                >
                  <i className="fas fa-layer-group" />
                  <span>Review Queue</span>
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

export default LecturerNavigation

