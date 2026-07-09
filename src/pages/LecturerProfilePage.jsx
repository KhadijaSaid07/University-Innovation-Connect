import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LecturerProfilePage.css'

const LecturerProfilePage = () => {
  const navigate = useNavigate()
  

  const [lecturer, setLecturer] = useState({
    name: '',
    email: '',
    idNumber: '',
    phone: '',
    department: '',
    bio: '',
    specialization: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')


  const getLoggedInUser = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return null
      }
    }
    return null
  }


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const loggedInUser = getLoggedInUser()
        
       
        // const token = localStorage.getItem('token')
        // 
        // const response = await fetch('http://localhost:8080/api/lecturers/profile', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch profile')
        // }
        // 
        // const data = await response.json()
        // setLecturer({
        //   name: data.name || '',
        //   email: data.email || '',
        //   idNumber: data.idNumber || '',
        //   phone: data.phone || '',
        //   department: data.department || '',
        //   bio: data.bio || '',
        //   specialization: data.specialization || ''
        // })
        // setLoading(false)
       
        // For now 
        setLecturer({
          name: loggedInUser?.name || '',
          email: loggedInUser?.email || '',
          idNumber: loggedInUser?.idNumber || '',
          phone: loggedInUser?.phone || '',
          department: loggedInUser?.department || '',
          bio: loggedInUser?.bio || '',
          specialization: loggedInUser?.specialization || ''
        })
        setLoading(false)

      } catch (err) {
        console.error('Error:', err)
        setError('Could not load profile')
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [])

  
  const handleChange = (e) => {
    const { name, value } = e.target
    setLecturer({
      ...lecturer,
      [name]: value
    })
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
       
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch('http://localhost:8080/api/lecturers/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: lecturer.name,
      //     phone: lecturer.phone,
      //     department: lecturer.department,
      //     bio: lecturer.bio,
      //     specialization: lecturer.specialization
      //   })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update profile')
      // }
      // 
      // const data = await response.json()
      // setLecturer(data)
      // setMessage('✅ Profile updated successfully!')
      // setTimeout(() => setMessage(''), 3000)
     

      setMessage('⚠️ Profile update will work when API is connected')
      setTimeout(() => setMessage(''), 3000)

    } catch (err) {
      console.error('Error:', err)
      setError('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  
  const goBack = () => {
    navigate('/lecturer-dashboard')
  }


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

 
  if (loading) {
    return (
      <div className="lecturer-profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    )
  }

 
  return (
    <div className="lecturer-profile-page">
      
     
      <header className="lecturer-profile-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Lecturer Profile</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </header>

   
      <div className="lecturer-profile-content">
        <div className="profile-container">
          
      
          <button onClick={goBack} className="btn-back">
            ← Back to Dashboard
          </button>

         
          <div className="profile-card">
            
         
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {lecturer.name ? lecturer.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <h2 className="profile-name">{lecturer.name || 'Lecturer'}</h2>
              <span className="profile-role">👨‍🏫 Lecturer</span>
            </div>

           
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`}>
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            
            <form onSubmit={handleSubmit} className="profile-form">
              
           
              <div className="form-group">
                <label className="font-weight-bold">👤 Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={lecturer.name}
                  onChange={handleChange}
                />
              </div>

            
              <div className="form-group">
                <label className="font-weight-bold">📧 Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={lecturer.email}
                  disabled
                  style={{ background: '#f8f9fa' }}
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              
              <div className="form-group">
                <label className="font-weight-bold">🆔 ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  className="form-control"
                  value={lecturer.idNumber}
                  disabled
                  style={{ background: '#f8f9fa' }}
                />
                <small className="text-muted">ID Number cannot be changed</small>
              </div>

           
              <div className="form-group">
                <label className="font-weight-bold">📞 Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={lecturer.phone}
                  onChange={handleChange}
                />
              </div>

           
           
              <div className="form-group">
                <label className="font-weight-bold">🏛️ Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  placeholder="Enter your department"
                  value={lecturer.department}
                  onChange={handleChange}
                />
              </div>

           
              <div className="form-group">
                <label className="font-weight-bold">🎯 Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  placeholder="e.g., AI & Machine Learning"
                  value={lecturer.specialization}
                  onChange={handleChange}
                />
              </div>

             
              <div className="form-group">
                <label className="font-weight-bold">📝 Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  value={lecturer.bio}
                  onChange={handleChange}
                />
              </div>

            
              <div className="form-buttons">
                <button
                  type="submit"
                  className="btn-save"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
                <button
                  type="reset"
                  className="btn-reset"
                  onClick={() => {
                    setLecturer({
                      ...lecturer,
                      name: lecturer.name,
                      phone: lecturer.phone,
                      department: lecturer.department,
                      bio: lecturer.bio,
                      specialization: lecturer.specialization
                    })
                    setMessage('')
                    setError('')
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </form>

       
            <div className="account-info">
              <h6 className="account-title">📋 Account Information</h6>
              <div className="account-details">
                <div>
                  <strong>Role:</strong> Lecturer
                </div>
                <div>
                  <strong>Status:</strong> Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <aside className="lecturer-profile-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
              <i className="fas fa-trophy" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link active">
              <i className="fas fa-user" />
              <span>Profile</span>
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

    </div>
  )
}

export default LecturerProfilePage