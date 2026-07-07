import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  
 
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('⚠️ Please enter your email address')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      
      // const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     email: email
      //   })
      // })
      // 
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.message || 'Failed to send reset link')
      // }
      // 
      // setMessage('✅ Password reset link sent to your email!')
      // setEmail('')
      // 
      // setTimeout(() => {
      //   navigate('/login')
      // }, 3000)
   

      // For now - 
      setTimeout(() => {
        setMessage('✅ Password reset link sent to your email!')
        setEmail('')
        setLoading(false)
        
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }, 1500)

    } catch (err) {
      console.error('Error:', err)
      setError(err.message || '❌ Something went wrong. Please try again.')
      setLoading(false)
    }
  }

 
  const goBack = () => {
    navigate('/login')
  }

 
  return (
    <div className="container-fluid" style={{ minHeight: '100vh', background: '#f5f0ff' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-lg-5 col-md-7">
          
         
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              
              {/* Logo / Brand */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🔐</div>
                <h2 className="font-weight-bold text-gray-800">Forgot Password</h2>
                <p className="text-muted">
                  Enter your email and we'll send you a reset link
                </p>
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
                  <label className="font-weight-bold">📧 Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <small className="text-muted">
                    We'll send a password reset link to this email
                  </small>
                </div>

             
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Sending...
                    </>
                  ) : (
                    '📤 Send Reset Link'
                  )}
                </button>
              </form>

          
              <div className="text-center mt-4">
                <p className="text-muted">
                  Remember your password?{' '}
                  <button 
                    onClick={goBack}
                    className="text-primary font-weight-bold"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Back to Login
                  </button>
                </p>
              </div>

             
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small font-italic">
                  💡 "Innovation is the ability to see change as an opportunity, not a threat."
                </p>
              </div>
            </div>
          </div>

       
          <div className="text-center mt-3">
            <Link to="/about" className="text-muted small mx-2">About</Link>
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

export default ForgotPasswordPage