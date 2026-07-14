import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../api/api'
import './Auth.css'

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
      const user = await auth.login({ email, password })
      
      localStorage.setItem('user', JSON.stringify(user))
      
      const role = user.role?.toUpperCase()
      if (role === 'ADMIN') navigate('/admin-dashboard')
      else if (role === 'LECTURER') navigate('/lecturer-dashboard')
      else navigate('/dashboard')
      
    } catch {
      setError('Invalid email or password')
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