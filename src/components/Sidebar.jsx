import React from 'react'
import { Link } from 'react-router-dom'



const Sidebar = () => {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-lightbulb" />
        </div>
        <div className="sidebar-brand-text mx-3">UIC</div>
      </Link>

     
      <hr className="sidebar-divider my-0" />

     
      <li className="nav-item active">
        <Link className="nav-link" to="/dashboard">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>

    
      <hr className="sidebar-divider" />

     
      <div className="sidebar-heading">
        Innovation
      </div>

     
      <li className="nav-item">
        <Link className="nav-link" to="post-idea">
          <i className="fas fa-fw fa-plus-circle" />
          <span>Post Idea</span>
        </Link>
      </li>

   
      <li className="nav-item">
        <Link className="nav-link" to="my-ideas">
          <i className="fas fa-fw fa-lightbulb" />
          <span>My Ideas</span>
        </Link>
      
      </li>
     
      <li className="nav-item">
        <Link className="nav-link" to="/idea-details">
          <i className="fas fa-fw fa-sign-out-alt" />
          <span>Idea Details</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

  
      <div className="sidebar-heading">
        Community
      </div>

      
      <li className="nav-item">
        <Link className="nav-link" to="/leaderboard">
          <i className="fas fa-fw fa-trophy" />
          <span>Leaderboard</span>
        </Link>
      </li>

      
      <li className="nav-item">
        <Link className="nav-link" to="/lecturers">
          <i className="fas fa-fw fa-chalkboard-teacher" />
          <span>Lecturers</span>
        </Link>
      </li>

    
      <hr className="sidebar-divider" />

    
      <div className="sidebar-heading">
        Account
      </div>

    
      <li className="nav-item">
        <Link className="nav-link" to="/profile">
          <i className="fas fa-fw fa-user" />
          <span>Profile</span>
        </Link>
      </li>

      
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          <i className="fas fa-fw fa-sign-out-alt" />
          <span>Logout</span>
        </Link>
      </li>

     
      <hr className="sidebar-divider d-none d-md-block" />

      
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" />
      </div>
     
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