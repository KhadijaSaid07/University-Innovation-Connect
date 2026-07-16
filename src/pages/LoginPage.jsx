import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const API = 'http://localhost:8081/api/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('📤 Logging in to:', `${API}/login`)
      console.log('📤 With:', { email, password })
      
      const res = await axios.post(`${API}/login`, {
        email: email,
        password: password
      })
      
      console.log('✅ Login response:', res.data)
      
      const user = res.data
      
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }))
      
      const role = user.role?.toUpperCase()
      
      if (role === 'ADMIN') {
        navigate('/admin-dashboard')
      } else if (role === 'LECTURER') {
        navigate('/lecturer-dashboard')
      } else {
        navigate('/dashboard')
      }
      
    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response data:', error.response?.data)
      
      let errorMsg = 'Invalid email or password'
      
      if (error.response?.status === 401) {
        errorMsg = 'Invalid email or password'
      } else if (error.response?.status === 403) {
        errorMsg = 'Access denied. Please check your credentials.'
      } else if (error.response?.status === 404) {
        errorMsg = 'Server not found. Please check if backend is running on port 8081'
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
        
        <div className="auth-logo">🌊</div>
        <h1>Welcome Back</h1>
        <p>Sign in to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          
          <div className="auth-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage