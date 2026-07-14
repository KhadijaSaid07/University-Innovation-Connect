import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const AdminProfilePage = () => {
  const navigate = useNavigate()
  
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    role: '',
    idNumber: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      navigate('/login')
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.role !== 'Admin') {
        navigate('/login')
        return
      }
      setAdmin({
        name: user.name || 'Admin',
        email: user.email || '',
        role: user.role || 'Admin',
        idNumber: user.idNumber || 'ADMIN-001'
      })
      setLoading(false)
    } catch (e) {
      navigate('/login')
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-loading">
            <div className="admin-spinner-large" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="admin-main">
        
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>👤 Profile</h1>
            <p>Admin account information</p>
          </div>
        </header>

        <div className="admin-profile-card">
          
          <div className="admin-profile-avatar">
            <div className="admin-avatar-large">
              {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <h2>{admin.name}</h2>
            <span className="admin-role-badge">🛡️ {admin.role}</span>
          </div>

          <div className="admin-profile-info">
            <div className="admin-profile-item">
              <label>Full Name</label>
              <p>{admin.name}</p>
            </div>
            <div className="admin-profile-item">
              <label>Email Address</label>
              <p>{admin.email}</p>
            </div>
            <div className="admin-profile-item">
              <label>Role</label>
              <p><span className="admin-badge">{admin.role}</span></p>
            </div>
            <div className="admin-profile-item">
              <label>ID Number</label>
              <p>{admin.idNumber}</p>
            </div>
            <div className="admin-profile-item">
              <label>Status</label>
              <p><span className="admin-status-active">✅ Active</span></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminProfilePage