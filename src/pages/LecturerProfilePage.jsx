import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './LecturerProfilePage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'
const AUTH_API = 'http://localhost:8081/api/auth'

const LecturerProfilePage = () => {
  const navigate = useNavigate()
  
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getUser()
        
        if (user?.id) {
          const res = await axios.get(`${API}/user/${user.id}`)
          const data = res.data
          
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
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Could not load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLecturer({ ...lecturer, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const user = getUser()
      
      if (!user?.id) {
        setError('User not found. Please login again.')
        setSaving(false)
        return
      }

      const updateData = {
        firstName: lecturer.firstName.trim(),
        lastName: lecturer.lastName.trim(),
        email: lecturer.email.trim()
      }

      if (lecturer.phone) updateData.phone = lecturer.phone.trim()
      if (lecturer.department) updateData.department = lecturer.department.trim()
      if (lecturer.specialization) updateData.specialization = lecturer.specialization.trim()
      if (lecturer.bio) updateData.bio = lecturer.bio.trim()

      const res = await axios.put(`${AUTH_API}/profile/${user.id}`, updateData)

      if (res.data) {
        const updatedUser = {
          ...user,
          firstName: res.data.firstName || lecturer.firstName,
          lastName: res.data.lastName || lecturer.lastName,
          email: res.data.email || lecturer.email,
          role: res.data.role || user.role
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setMessage('✅ Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('Update error:', err)
      setError(err.response?.data?.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  const goBack = () => navigate('/lecturer-dashboard')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  if (loading) {
    return (
      <div className="lecturer-profile-loading">
        <div className="spinner-border text-primary" />
        <p>Loading profile...</p>
      </div>
    )
  }

  const fullName = `${lecturer.firstName || ''} ${lecturer.lastName || ''}`.trim() || 'Lecturer'
  const initial = lecturer.firstName ? lecturer.firstName.charAt(0).toUpperCase() : 'L'

  return (
    <div className="lecturer-profile-page">
      
      {sidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} />}

      <aside className={`lecturer-profile-sidebar ${sidebarOpen ? 'show' : ''}`}>
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

      <header className="lecturer-profile-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
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

      <div className="lecturer-profile-content">
        <div className="profile-container">
          
          <button onClick={goBack} className="btn-back">
            ← Back to Dashboard
          </button>

          <div className="profile-card">
            
            <div className="profile-avatar-section">
              <div className="profile-avatar">{initial}</div>
              <h2 className="profile-name">{fullName}</h2>
              <span className="profile-role">👨‍🏫 Lecturer</span>
            </div>

            {message && (
              <div className="alert alert-success">{message}</div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              
              <div className="form-group">
                <label>👤 First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={lecturer.firstName}
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
                  value={lecturer.lastName}
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
                  value={lecturer.email}
                  onChange={handleChange}
                  required
                />
              </div>

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
                    const user = getUser()
                    if (user) {
                      setLecturer({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        department: user.department || '',
                        specialization: user.specialization || '',
                        bio: user.bio || ''
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

            <div className="account-info">
              <h6 className="account-title">📋 Account Information</h6>
              <div className="account-details">
                <div><strong>Role:</strong> Lecturer</div>
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

export default LecturerProfilePage