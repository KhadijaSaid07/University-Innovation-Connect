import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const [userRole, setUserRole] = useState('Student')

  // ----- GET USER ROLE -----
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserRole(user.role || 'Student')
      } catch (e) {
        setUserRole('Student')
      }
    }
  }, [])

  // ----- CHECK ACTIVE PATH -----
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
      {/* ===== BRAND ===== */}
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-lightbulb" />
        </div>
        <div className="sidebar-brand-text mx-3">UIC</div>
      </Link>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* ===== DASHBOARD ===== */}
      <li className={`nav-item ${isActive('/dashboard')}`}>
        <Link className="nav-link" to="/dashboard">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* ===== INNOVATION HEADING ===== */}
      <div className="sidebar-heading">
        Innovation
      </div>

      {/* Post Idea */}
      <li className={`nav-item ${isActive('/post-idea')}`}>
        <Link className="nav-link" to="/post-idea">
          <i className="fas fa-fw fa-plus-circle" />
          <span>Post Idea</span>
        </Link>
      </li>

      {/* My Ideas */}
      <li className={`nav-item ${isActive('/my-ideas')}`}>
        <Link className="nav-link" to="/my-ideas">
          <i className="fas fa-fw fa-lightbulb" />
          <span>My Ideas</span>
        </Link>
      </li>

      {/* Idea Details */}
      <li className={`nav-item ${isActive('/idea-details')}`}>
        <Link className="nav-link" to="/idea-details">
          <i className="fas fa-fw fa-sign-out-alt" />
          <span>Idea Details</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* ===== COMMUNITY HEADING ===== */}
      <div className="sidebar-heading">
        Community
      </div>

      {/* Leaderboard */}
      <li className={`nav-item ${isActive('/leaderboard')}`}>
        <Link className="nav-link" to="/leaderboard">
          <i className="fas fa-fw fa-trophy" />
          <span>Leaderboard</span>
        </Link>
      </li>

      {/* ===== LECTURERS - ONLY VISIBLE TO LECTURERS ===== */}
      {userRole === 'Lecturer' && (
        <li className={`nav-item ${isActive('/lecturers')}`}>
          <Link className="nav-link" to="/lecturers">
            <i className="fas fa-fw fa-chalkboard-teacher" />
            <span>Lecturers</span>
          </Link>
        </li>
      )}

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* ===== ACCOUNT HEADING ===== */}
      <div className="sidebar-heading">
        Account
      </div>

      {/* Profile */}
      <li className={`nav-item ${isActive('/profile')}`}>
        <Link className="nav-link" to="/profile">
          <i className="fas fa-fw fa-user" />
          <span>Profile</span>
        </Link>
      </li>

      {/* Logout */}
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          <i className="fas fa-fw fa-sign-out-alt" />
          <span>Logout</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />

      {/* Sidebar Toggle */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" />
      </div>

      {/* Sidebar Card */}
      <div className="sidebar-card d-none d-lg-flex">
        <div className="sidebar-card-icon">🌊</div>
        <p className="text-center mb-2"><strong>University Innovation Connect</strong></p>
        <p className="text-center small mb-2">SUZA</p>
        <Link className="btn btn-success btn-sm" to="/post-idea">Share Your Idea!</Link>
      </div>
    </ul>
  )
}

export default Sidebar