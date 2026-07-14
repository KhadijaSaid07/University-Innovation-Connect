import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const ProfilePage = () => {
  const navigate = useNavigate()
  
  // State
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    department: '',
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
        const userData = getUser()
        const token = localStorage.getItem('token')
        
        if (userData?.id) {
          const res = await fetch(`${API}/user/${userData.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (!res.ok) throw new Error('Failed to fetch')
          
          const data = await res.json()
          
          setUser({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            role: data.role || '',
            phone: data.phone || '',
            department: data.department || '',
            bio: data.bio || ''
          })
        } else {
          const localUser = getUser()
          if (localUser) {
            setUser({
              firstName: localUser.firstName || '',
              lastName: localUser.lastName || '',
              email: localUser.email || '',
              role: localUser.role || '',
              phone: localUser.phone || '',
              department: localUser.department || '',
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
    setUser({ ...user, [name]: value })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const userData = getUser()
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${API}/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          department: user.department,
          bio: user.bio
        })
      })
      
      if (!res.ok) throw new Error('Update failed')
      
      const data = await res.json()
      
      const updatedUser = {
        ...userData,
        firstName: data.firstName || user.firstName,
        lastName: data.lastName || user.lastName,
        department: data.department || user.department,
        bio: data.bio || user.bio
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
  const goBack = () => navigate('/dashboard')

  // Loading state
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    )
  }

  // Get full name
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="profile-page">
      
      {/* Header */}
      <div className="profile-header">
        <div className="header-container">
          <h1 className="h3 mb-0">👤 My Profile</h1>
          <button onClick={goBack} className="btn btn-secondary btn-sm">
            ← Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        <div className="profile-container">
          
          {/* Profile Card */}
          <div className="profile-card">
            
            {/* Avatar */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">{initial}</div>
              <h4 className="profile-name">{fullName}</h4>
              <p className="profile-role">
                <span className="badge-role">{user.role || 'Student'}</span>
              </p>
            </div>

            {/* Messages */}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              
              <div className="form-group">
                <label>👤 First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>👤 Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                  style={{ background: '#f8f9fa' }}
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

            

              <div className="form-group">
                <label>📞 Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={user.phone || ''}
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
                  value={user.department || ''}
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
                  value={user.bio || ''}
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
                    setUser({ ...user })
                    setMessage('')
                    setError('')
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </form>

          
            <div className="account-info">
              <h6 className="account-title">📋 Account Information</h6>
              <div className="account-details">
                <div><strong>Role:</strong> {user.role || 'Student'}</div>
                <div><strong>Status:</strong> Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage