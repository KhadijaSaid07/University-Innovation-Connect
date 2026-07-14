import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', email: '', role: '', idNumber: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        setUser({ name: '', email: '', role: '', idNumber: '' })
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) navigate(`/dashboard?search=${query}`)
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars" />
      </button>

      <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search" onSubmit={handleSearch}>
        <div className="input-group">
          <input type="text" name="search" className="form-control bg-light border-0 small" placeholder="Search ideas..." />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              <i className="fas fa-search fa-sm" />
            </button>
          </div>
        </div>
      </form>

      <ul className="navbar-nav ml-auto">

        {/* Mobile Search */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" data-toggle="dropdown">
            <i className="fas fa-search fa-fw" />
          </a>
          <div className="dropdown-menu dropdown-menu-right p-3 shadow">
            <form className="form-inline mr-auto w-100 navbar-search">
              <div className="input-group">
                <input type="text" className="form-control bg-light border-0 small" placeholder="Search..." />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        <div className="topbar-divider d-none d-sm-block" />

        {/* User Dropdown */}
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" data-toggle="dropdown">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {loading ? 'Loading...' : user.name || 'Guest'}
            </span>
            <span className="img-profile rounded-circle d-flex align-items-center justify-content-center" style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#FFFFFF', fontSize: '14px', fontWeight: '700'
            }}>
              {initial}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-right shadow">
            <div className="dropdown-header">
              <div className="font-weight-bold">{user.name || 'User'}</div>
              <div className="small text-muted">{user.email || 'No email'}</div>
              <div className="small text-muted">
                <span className="badge badge-primary">{user.role || 'Role'}</span>
                {user.idNumber && <span className="badge badge-secondary ml-1">{user.idNumber}</span>}
              </div>
            </div>
            <div className="dropdown-divider" />
            <Link className="dropdown-item" to="/profile">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" /> Profile
            </Link>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" /> Logout
            </button>
          </div>
        </li>

      </ul>
    </nav>
  )
}

export default Header