import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const navigate = useNavigate()
  
  // ----- STATE -----
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    phone: '',
    role: 'Student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ----- HANDLE INPUT CHANGE -----
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // ----- HANDLE REGISTER -----
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('⚠️ Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('⚠️ Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
     
      // const response = await fetch('http://localhost:8080/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     password: formData.password,
      //     registrationNumber: formData.registrationNumber,
      //     phone: formData.phone,
      //     role: formData.role
      //   })
      // })
      // 
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.message || 'Registration failed')
      // }
      // 
      // const data = await response.json()
      // 
      // // Save token and user data
      // localStorage.setItem('token', data.token)
      // localStorage.setItem('user', JSON.stringify(data.user))
      // 
      // setMessage('✅ Registration successful! Redirecting...')
      // 
      // // Redirect to dashboard
      // setTimeout(() => {
      //   navigate('/')
      // }, 1500)
      

      // For now
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token-123456')
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role
        }))
        setMessage('✅ Registration successful! Redirecting...')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }, 1500)

    } catch (err) {
      console.error('Error:', err)
      setError(err.message || '❌ Registration failed. Please try again.')
      setLoading(false)
    }
  }

 
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }


  return (
    <div className="container-fluid" style={{ minHeight: '100vh', background: '#f5f0ff' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-lg-6 col-md-8">
          
          
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              
             
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🌟</div>
                <h2 className="font-weight-bold text-gray-800">Create Account</h2>
                <p className="text-muted">Join SUZA's innovation community</p>
              </div>

             
              {message && (
                <div className="alert alert-success text-center">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

            
              <form onSubmit={handleSubmit}>
                
                
                <div className="form-group">
                  <label className="font-weight-bold">👤 Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

              
                <div className="form-group">
                  <label className="font-weight-bold">📧 Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold">🔒 Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Enter password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePassword}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>
                </div>

             
                <div className="form-group">
                  <label className="font-weight-bold">🔐 Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleConfirmPassword}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>
                </div>

               
                <div className="form-group">
                  <label className="font-weight-bold">🎓 Registration Number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    className="form-control"
                    placeholder="Enter your registration number (e.g., 24BCS026)"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </div>

                
                <div className="form-group">
                  <label className="font-weight-bold">📞 Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Role */}
                <div className="form-group">
                  <label className="font-weight-bold">🎯 Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>

               
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Registering...
                    </>
                  ) : (
                    '🚀 Create Account'
                  )}
                </button>
              </form>

            
              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-weight-bold">
                    Login here
                  </Link>
                </p>
              </div>

             
              <div className="text-center mt-3">
                <p className="text-muted small">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary">
                    Privacy Policy
                  </Link>
                </p>
              </div>

             
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small font-italic">
                  💡 "The future belongs to those who believe in the beauty of their dreams."
                </p>
               
              </div>
            </div>
          </div>

         
          <div className="text-center mt-3">
            <Link to="/about" className="text-muted small mx-2">About</Link>
            <span className="text-muted small">|</span>
            <Link to="/mission" className="text-muted small mx-2">Mission</Link>
            <span className="text-muted small">|</span>
            <Link to="/terms" className="text-muted small mx-2">Terms</Link>
            <span className="text-muted small">|</span>
            <Link to="/privacy-policy" className="text-muted small mx-2">Privacy</Link>
          </div>

          <div className="text-center mt-2">
            <p className="text-muted small">
              © 2026 University Innovation Connect (UIC) - SUZA Zanzibar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage