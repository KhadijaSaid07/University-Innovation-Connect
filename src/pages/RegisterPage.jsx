import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../api/api'
import './Auth.css'

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

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await auth.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      })
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Registration failed. Email may already exist.')
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
              placeholder="Password"
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
              👁️
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
              👁️
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