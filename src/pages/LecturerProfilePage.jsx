import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LecturerProfilePage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LecturerProfilePage = () => {
  const navigate = useNavigate()
  
  // State
  const [lecturer, setLecturer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Get logged in user
  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getUser()
        const token = localStorage.getItem('token')
        
        if (user?.id) {
          const res = await fetch(`${API}/user/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (!res.ok) throw new Error('Failed to fetch')
          
          const data = await res.json()
          
          setLecturer({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || '',
            specialization: data.specialization || '',
            bio: data.bio || ''
          })
        } else {
          // Fallback to localStorage
          const localUser = getUser()
          if (localUser) {
            setLecturer({
              firstName: localUser.firstName || '',
              lastName: localUser.lastName || '',
              email: localUser.email || '',
              phone: localUser.phone || '',
              department: localUser.department || '',
              specialization: localUser.specialization || '',
              bio: localUser.bio || ''
            })
          }
        }
      } catch {
        setError('Could not load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setLecturer({ ...lecturer, [name]: value })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const user = getUser()
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${API}/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: lecturer.firstName,
          lastName: lecturer.lastName,
          department: lecturer.department,
          specialization: lecturer.specialization,
          bio: lecturer.bio
        })
      })
      
      if (!res.ok) throw new Error('Update failed')
      
      const data = await res.json()
      
      // Update localStorage
      const updatedUser = {
        ...user,
        firstName: data.firstName || lecturer.firstName,
        lastName: data.lastName || lecturer.lastName,
        department: data.department || lecturer.department,
        specialization: data.specialization || lecturer.specialization,
        bio: data.bio || lecturer.bio
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      setMessage('✅ Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      
    } catch {
      setError('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  // Go back
  const goBack = () => navigate('/lecturer-dashboard')

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Loading state
  if (loading) {
    return (
      <div className="lecturer-profile-loading">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    )
  }

  // Get full name
  const fullName = `${lecturer.firstName || ''} ${lecturer.lastName || ''}`.trim() || 'Lecturer'
  const initial = lecturer.firstName ? lecturer.firstName.charAt(0).toUpperCase() : 'L'

  return (
    <div className="lecturer-profile-page">
      
      {/* Header */}
      <header className="lecturer-profile-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Lecturer Profile</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="lecturer-profile-content">
        <div className="profile-container">
          
          <button onClick={goBack} className="btn-back">
            ← Back to Dashboard
          </button>

          <div className="profile-card">
            
            {/* Avatar */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">{initial}</div>
              <h2 className="profile-name">{fullName}</h2>
              <span className="profile-role">👨‍🏫 Lecturer</span>
            </div>

            {/* Messages */}
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`}>
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              
              <div className="form-group">
                <label>👤 First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={lecturer.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>👤 Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={lecturer.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={lecturer.email}
                  disabled
                  style={{ background: '#f8f9fa' }}
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              {/* ❌ ID NUMBER REMOVED */}

              <div className="form-group">
                <label>📞 Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={lecturer.phone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>🏛️ Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  placeholder="Enter department"
                  value={lecturer.department || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>🎯 Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  placeholder="e.g., AI & Machine Learning"
                  value={lecturer.specialization || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>📝 Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  value={lecturer.bio || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="reset"
                  className="btn-reset"
                  onClick={() => {
                    setLecturer({ ...lecturer })
                    setMessage('')
                    setError('')
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </form>

            {/* Account Info */}
            <div className="account-info">
              <h6 className="account-title">📋 Account Information</h6>
              <div className="account-details">
                <div><strong>Role:</strong> Lecturer</div>
                <div><strong>Status:</strong> Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lecturer-profile-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt" /> Dashboard
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
              <i className="fas fa-trophy" /> Leaderboard
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link active">
              <i className="fas fa-user" /> Profile
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </nav>
        </div>
      </aside>

    </div>
  )
}

export default LecturerProfilePage