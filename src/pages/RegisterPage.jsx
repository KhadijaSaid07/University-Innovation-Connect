import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const API = `${import.meta.env.VITE_API_URL}/auth`

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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

    // Clear messages when user starts correcting the form
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim()
    const password = form.password

    // Required fields
    if (!firstName || !lastName || !email || !password || !form.confirmPassword) {
      return 'Please fill in all fields'
    }

    // Match backend first-name validation
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/

    if (!namePattern.test(firstName)) {
      return 'First name can contain only letters, spaces, apostrophes and hyphens'
    }

    if (firstName.length < 2 || firstName.length > 50) {
      return 'First name must be between 2 and 50 characters'
    }

    // Match backend last-name validation
    if (!namePattern.test(lastName)) {
      return 'Last name can contain only letters, spaces, apostrophes and hyphens'
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return 'Last name must be between 2 and 50 characters'
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      return 'Enter a valid email address'
    }

    if (email.length > 150) {
      return 'Email is too long'
    }

    // Password length
    if (password.length < 8 || password.length > 72) {
      return 'Password must be between 8 and 72 characters'
    }

    // Password requirements
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialCharacter = /[@$!%*?&]/.test(password)

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialCharacter) {
      return 'Password must contain uppercase, lowercase, number and special character'
    }

    // Confirm password
    if (password !== form.confirmPassword) {
      return 'Passwords do not match'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const firstName = form.firstName.trim()
      const lastName = form.lastName.trim()
      const email = form.email.trim().toLowerCase()

      console.log('📤 Registering to:', `${API}/register`)
      console.log('📤 Registration data:', {
        firstName,
        lastName,
        email
      })

      const res = await axios.post(`${API}/register`, {
        firstName,
        lastName,
        email,
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
        errorMsg =
          error.response?.data?.message ||
          'Invalid data. Please check your input.'
      } else if (error.response?.status === 409) {
        errorMsg =
          error.response?.data?.message ||
          'Email already exists. Please use a different email.'
      } else if (error.response?.status === 403) {
        errorMsg =
          error.response?.data?.message ||
          'Registration not allowed.'
      } else if (error.response?.status === 500) {
        errorMsg =
          'Server error. Please try again later.'
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
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

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* First Name */}
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="auth-input"
            autoComplete="given-name"
            required
          />

          {/* Last Name */}
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="auth-input"
            autoComplete="family-name"
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            autoComplete="email"
            required
          />

          {/* Password */}
          <div className="auth-password-wrapper">

            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️'}
            </button>

          </div>

          {/* Confirm Password */}
          <div className="auth-password-wrapper">

            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="auth-eye-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              {showConfirmPassword ? '👁️' : '👁️'}
            </button>

          </div>

          {/* Password requirements */}
          <div className="password-requirements">
            <small>
              Password must contain:
            </small>

            <small>
              • At least 8 characters
            </small>

            <small>
              • Uppercase and lowercase letters
            </small>

            <small>
              • At least one number
            </small>

            <small>
              • At least one special character (@ $ ! % * ? &)
            </small>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage

