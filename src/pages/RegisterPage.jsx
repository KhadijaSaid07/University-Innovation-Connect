import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const API = 'http://localhost:8081/api/auth'

const RegisterPage = () => {
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('📤 Registering to:', `${API}/register`)
      console.log('📤 With:', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      })
      
      const res = await axios.post(`${API}/register`, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      })
      
      console.log('✅ Registration response:', res.data)
      
      setSuccess('✅ Registration successful! Redirecting to login...')
      
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      console.error('❌ Registration error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response data:', error.response?.data)
      
      let errorMsg = 'Registration failed. Please try again.'
      
      if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || 'Invalid data. Please check your input.'
      } else if (error.response?.status === 409) {
        errorMsg = 'Email already exists. Please use a different email.'
      } else if (error.response?.status === 403) {
        errorMsg = 'Registration not allowed.'
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.'
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.response?.data) {
        errorMsg = JSON.stringify(error.response.data)
      } else if (error.message) {
        errorMsg = error.message
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <div className="auth-logo">🌟</div>
        <h1>Create Account</h1>
        <p>Join the innovation community</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <div className="auth-password-wrapper">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️'}
            </button>
          </div>

          <div className="auth-password-wrapper">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              required
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️'}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage