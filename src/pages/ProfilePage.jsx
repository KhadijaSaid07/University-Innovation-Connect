import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ProfilePage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'
const AUTH_API = 'http://localhost:8081/api/auth'

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
        
        if (userData?.id) {
          console.log('📤 Fetching profile for user:', userData.id)
          const res = await axios.get(`${API}/user/${userData.id}`)
          console.log('✅ Profile data:', res.data)
          
          const data = res.data
          
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
      } catch (err) {
        console.error('Fetch error:', err)
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

  // Handle form submit - Using the auth/profile endpoint
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const userData = getUser()
      
      if (!userData?.id) {
        setError('User not found. Please login again.')
        setSaving(false)
        return
      }

      // Prepare update data
      const updateData = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim()
      }

      // Only include password if provided
      // Only include optional fields if they have values
      if (user.phone) updateData.phone = user.phone.trim()
      if (user.department) updateData.department = user.department.trim()
      if (user.bio) updateData.bio = user.bio.trim()

      console.log('📤 Updating profile:', updateData)

      // Use the auth/profile endpoint
      const res = await axios.put(`${AUTH_API}/profile/${userData.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('✅ Update response:', res.data)

      if (res.data) {
        // Update local storage
        const updatedUser = {
          ...userData,
          firstName: res.data.firstName || user.firstName,
          lastName: res.data.lastName || user.lastName,
          email: res.data.email || user.email,
          role: res.data.role || user.role
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setMessage('✅ Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }

    } catch (err) {
      console.error('❌ Update error:', err)
      console.error('Response:', err.response?.data)
      
      let errorMsg = 'Could not update profile'
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.response?.data) {
        errorMsg = err.response.data
      }
      setError(errorMsg)
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
                  required
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
                  required
                />
              </div>

              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Email can be changed</small>
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
                    // Reset to current values
                    const userData = getUser()
                    if (userData) {
                      setUser({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: userData.email || '',
                        role: userData.role || '',
                        phone: userData.phone || '',
                        department: userData.department || '',
                        bio: userData.bio || ''
                      })
                    }
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
                <div><strong>Role:</strong> {user.role || 'Student'}</div>
                <div><strong>Status:</strong> Active</div>
                <div><strong>ID:</strong> {getUser()?.id || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage