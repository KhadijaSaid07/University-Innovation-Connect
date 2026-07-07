import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  
 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!email || !password) {
      setError('⚠️ Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
     
      // const response = await fetch('http://localhost:8080/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //     password: password
      //   })
      // })
      // 
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.message || 'Invalid credentials')
      // }
      // 
      // const data = await response.json()
      // 
      // // Save token and user data
      // localStorage.setItem('token', data.token)
      // localStorage.setItem('user', JSON.stringify(data.user))
      // 
      // // Redirect to dashboard
      // navigate('/dashboard')
     

      // For now 
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token-123456')
        localStorage.setItem('user', JSON.stringify({
          name: 'user',
          email: email,
          role: 'Student'
        }))
        navigate('/dashboard')
      }, 1500)

    } catch (err) {
      console.error('Error:', err)
      setError(err.message || '❌ Invalid email or password')
      setLoading(false)
    }
  }

 
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

 
  return (
    <div className="container-fluid" style={{ minHeight: '100vh', background: '#f5f0ff' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-lg-5 col-md-7">
          
          
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              
            
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🌊</div>
                <h2 className="font-weight-bold text-gray-800">Welcome Back</h2>
                <p className="text-muted">Sign in to continue innovating</p>
              </div>

            
              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Email */}
                <div className="form-group">
                  <label className="font-weight-bold">📧 Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

            
                <div className="form-group">
                  <label className="font-weight-bold">🔒 Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="rememberMe"
                    />
                    <label className="custom-control-label text-muted small" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-primary small">
                    Forgot password?
                  </Link>
                </div>

              
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Logging in...
                    </>
                  ) : (
                    '🚀 Login'
                  )}
                </button>
              </form>

              
              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-weight-bold">
                    Register here
                  </Link>
                </p>
              </div>

           
              <div className="text-center mt-3">
                <p className="text-muted small">
                  By continuing, you agree to our{' '}
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
                  💡 "Innovation distinguishes between a leader and a follower."
                </p>
                <p className="text-muted small">- Steve Jobs</p>
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

export default LoginPage