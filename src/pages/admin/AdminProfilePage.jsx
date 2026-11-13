import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`
const AUTH_API = `${BASE_URL}/auth`

const AdminProfilePage = () => {
  const navigate = useNavigate()

  const [admin, setAdmin] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN',
    phone: '',
    department: '',
    bio: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      navigate('/login')
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.role?.toUpperCase() !== 'ADMIN') {
        navigate('/login')
        return
      }

      const fetchProfile = async () => {
        try {
          if (user.id) {
            const res = await axios.get(`${API}/user/${user.id}`)
            const data = res.data
            setAdmin({
              id: data.id || user.id,
              firstName: data.firstName || user.firstName || '',
              lastName: data.lastName || user.lastName || '',
              email: data.email || user.email || '',
              password: '',
              role: data.role || user.role || 'ADMIN',
              phone: data.phone || '',
              department: data.department || '',
              bio: data.bio || ''
            })
          } else {
            setAdmin({
              id: user.id,
              firstName: user.firstName || 'System',
              lastName: user.lastName || 'Admin',
              email: user.email || '',
              password: '',
              role: user.role || 'ADMIN',
              phone: user.phone || '',
              department: user.department || '',
              bio: user.bio || ''
            })
          }
        } catch {
          setAdmin({
            id: user.id,
            firstName: user.firstName || 'System',
            lastName: user.lastName || 'Admin',
            email: user.email || '',
            password: '',
            role: user.role || 'ADMIN',
            phone: user.phone || '',
            department: user.department || '',
            bio: user.bio || ''
          })
        } finally {
          setLoading(false)
        }
      }
      fetchProfile()
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!admin.id) return

    if (admin.password && admin.password.length < 6) {
      setMessage('New password must be at least 6 characters long.')
      setMessageType('error')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const updateData = {
        firstName: admin.firstName.trim(),
        lastName: admin.lastName.trim(),
        email: admin.email.trim(),
        phone: admin.phone || '',
        department: admin.department || '',
        bio: admin.bio || ''
      }

      if (admin.password && admin.password.trim()) {
        updateData.password = admin.password
      }

      const res = await axios.put(`${AUTH_API}/profile/${admin.id}`, updateData)
      if (res.data) {
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({
          ...stored,
          firstName: res.data.firstName || admin.firstName,
          lastName: res.data.lastName || admin.lastName,
          email: res.data.email || admin.email,
          role: res.data.role || admin.role
        }))
        setAdmin(prev => ({ ...prev, password: '' }))
        setMessage('Administrator profile updated successfully.')
        setMessageType('success')
        setTimeout(() => setMessage(''), 3500)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Admin'

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="Administrator Profile"
          pageSubtitle="Manage your administrator account details"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="Administrator Profile"
        pageSubtitle="Manage your administrator account details and security credentials"
      />

      <div className="admin-content">
        <div className="content-container" style={{ maxWidth: '780px' }}>
          <div className="page-header uic-responsive-header">
            <div className="page-header-left">
              <h1>Administrator Profile</h1>
              <p>Update your personal details or change your administrator password</p>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="recent-card" style={{ padding: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#4F46E5',
                  color: '#fff',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                {fullName.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '1.35rem' }}>{fullName}</h2>
              <span className="admin-badge badge-danger">{admin.role}</span>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>First Name <span className="uic-required">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className="admin-form-control"
                    value={admin.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Last Name <span className="uic-required">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    className="admin-form-control"
                    value={admin.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Email Address <span className="uic-required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="admin-form-control"
                    value={admin.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="admin-form-control"
                    placeholder="Enter phone number"
                    value={admin.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    className="admin-form-control"
                    placeholder="Enter department"
                    value={admin.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Password (optional)</label>
                  <div className="uic-password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="admin-form-control uic-password-input"
                      placeholder="Leave blank to keep current"
                      value={admin.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="uic-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="admin-form-control"
                  placeholder="Administrator bio..."
                  value={admin.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage
