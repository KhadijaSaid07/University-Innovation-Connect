import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ProfilePage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`
const AUTH_API = `${BASE_URL}/auth`

const ProfilePage = () => {
  const navigate = useNavigate()

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
        const userData = getUser()

        if (userData?.id) {
          const res = await axios.get(`${API}/user/${userData.id}`)
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
        setError('Could not load profile details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const userData = getUser()

      if (!userData?.id) {
        setError('User session not found. Please sign in again.')
        setSaving(false)
        return
      }

      const updateData = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone ? user.phone.trim() : '',
        department: user.department ? user.department.trim() : '',
        bio: user.bio ? user.bio.trim() : ''
      }

      const res = await axios.put(`${AUTH_API}/profile/${userData.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.data) {
        const updatedUser = {
          ...userData,
          firstName: res.data.firstName || user.firstName,
          lastName: res.data.lastName || user.lastName,
          email: res.data.email || user.email,
          role: res.data.role || user.role,
          phone: res.data.phone ?? user.phone,
          department: res.data.department ?? user.department,
          bio: res.data.bio ?? user.bio
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))

        setMessage('Profile updated successfully.')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      let errorMsg = 'Could not update profile'
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (typeof err.response?.data === 'string') {
        errorMsg = err.response.data
      }
      setError(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="uic-page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading your profile...</p>
      </div>
    )
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student'
  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'S'

  return (
    <div className="uic-centered-page">
      <div className="uic-form-card">
        <div className="uic-form-card-header">
          <div className="d-flex align-items-center gap-3">
            <div className="uic-profile-avatar-lg">{initial}</div>
            <div>
              <h2 className="uic-form-card-title mb-1">{fullName}</h2>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="uic-dropdown-role-badge m-0">{user.role || 'STUDENT'}</span>
                <span className="text-muted small">{user.email}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="uic-btn-secondary"
          >
            <i className="fas fa-arrow-left" />
            <span>Dashboard</span>
          </button>
        </div>

        {message && (
          <div className="uic-alert uic-alert-success">
            <i className="fas fa-check-circle" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="uic-alert uic-alert-error">
            <i className="fas fa-exclamation-circle" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="uic-proposal-form">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="uic-field-group">
                <label className="uic-field-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="uic-input"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="uic-field-group">
                <label className="uic-field-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="uic-input"
                  value={user.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="uic-field-group">
                <label className="uic-field-label">University Email</label>
                <input
                  type="email"
                  name="email"
                  className="uic-input"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="uic-field-group">
                <label className="uic-field-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="uic-input"
                  placeholder="e.g., +255 700 000 000"
                  value={user.phone || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="uic-field-group">
            <label className="uic-field-label">Academic Department / Faculty</label>
            <input
              type="text"
              name="department"
              className="uic-input"
              placeholder="e.g., Computer Science & Information Technology"
              value={user.department || ''}
              onChange={handleChange}
            />
          </div>

          <div className="uic-field-group">
            <label className="uic-field-label">Short Bio & Research Interests</label>
            <textarea
              name="bio"
              className="uic-textarea"
              rows="3"
              placeholder="Share your academic interests, skills, or innovation focus areas..."
              value={user.bio || ''}
              onChange={handleChange}
            />
          </div>

          <div className="uic-guidelines-box">
            <div className="d-flex justify-content-between flex-wrap gap-2 small text-muted">
              <span><strong>Account Role:</strong> {user.role || 'STUDENT'}</span>
              <span><strong>Account Status:</strong> Active</span>
              <span><strong>User ID:</strong> #{getUser()?.id || 'N/A'}</span>
            </div>
          </div>

          <div className="uic-form-actions">
            <button
              type="button"
              className="uic-btn-ghost"
              onClick={() => {
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
              Reset
            </button>

            <button type="submit" className="uic-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
