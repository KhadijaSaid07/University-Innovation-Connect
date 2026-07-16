import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    idNumber: ''
  })

  const [loading, setLoading] = useState(true)

  // Load user data from localStorage
  const loadUser = () => {
    const data = localStorage.getItem('user')

    if (data) {
      try {
        const parsed = JSON.parse(data)

        setUser({
          name: parsed.firstName || parsed.name || '',
          email: parsed.email || '',
          role: parsed.role || '',
          idNumber: parsed.idNumber || ''
        })
      } catch {
        setUser({
          name: '',
          email: '',
          role: '',
          idNumber: ''
        })
      }
    }

    setLoading(false)
  }

  // Load user on mount and when route changes (to catch profile updates)
  useEffect(() => {
    loadUser()
  }, [location.pathname]) // Re-run when URL changes

  // Also listen for storage changes (if profile updated in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : 'U'

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

      {/* Mobile Menu */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fas fa-bars"></i>
      </button>

      <div className="ml-auto">
        <ul className="navbar-nav">

          <li className="nav-item dropdown no-arrow">

            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              data-toggle="dropdown"
            >

              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                {loading ? 'Loading...' : user.name || 'Guest'}
              </span>

              <span
                className="img-profile rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
                  color: '#fff',
                  fontWeight: '700'
                }}
              >
                {initial}
              </span>

            </a>

            <div className="dropdown-menu dropdown-menu-right shadow">

              <div className="dropdown-header">
                <div className="font-weight-bold">
                  {user.name || 'User'}
                </div>

                <div className="small text-muted">
                  {user.email || 'No email'}
                </div>

                <div className="small text-muted mt-1">
                  <span className="badge badge-primary">
                    {user.role || 'Role'}
                  </span>

                  {user.idNumber && (
                    <span className="badge badge-secondary ml-1">
                      {user.idNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <Link className="dropdown-item" to="/profile">
                <i className="fas fa-user fa-sm fa-fw mr-2"></i>
                Profile
              </Link>

              <button
                className="dropdown-item"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2"></i>
                Logout
              </button>

            </div>

          </li>

        </ul>
      </div>

    </nav>
  )
}

export default Header