import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './PublicNavbar.css'

const PublicNavbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/mission', label: 'Mission' },
    { path: '/terms', label: 'Terms' },
    { path: '/privacy-policy', label: 'Privacy' }
  ]

  return (
    <nav className="uic-public-nav">
      <div className="uic-public-nav-container">
        <Link to="/" className="uic-public-brand" onClick={() => setMenuOpen(false)}>
          <span className="uic-public-brand-icon">
            <i className="fas fa-lightbulb" />
          </span>
          <span className="uic-public-brand-text">UIC Platform</span>
        </Link>

        <button
          type="button"
          className="uic-public-menu-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>

        <div className={`uic-public-nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`uic-public-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="uic-public-auth-actions">
            <Link
              to="/login"
              className={`uic-public-signin ${location.pathname === '/login' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="uic-public-cta"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar

