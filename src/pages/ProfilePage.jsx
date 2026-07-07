import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  

  const [user, setUser] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    phone: '',
    role: '',
    department: '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        // const token = localStorage.getItem('token')
        // 
        // const response = await fetch('http://localhost:8080/api/users/profile', {
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
        // setUser({
        //   name: data.name || '',
        //   email: data.email || '',
        //   registrationNumber: data.registrationNumber || '',
        //   phone: data.phone || '',
        //   role: data.role || '',
        //   department: data.department || '',
        //   bio: data.bio || ''
        // })
        // setLoading(false)


       
        setUser({
          name: '',
          email: '',
          registrationNumber: '',
          phone: '',
          role: '',
          department: '',
          bio: ''
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
    setUser({
      ...user,
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
      // const response = await fetch('http://localhost:8080/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: user.name,
      //     phone: user.phone,
      //     department: user.department,
      //     bio: user.bio
      //   })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update profile')
      // }
      // 
      // const data = await response.json()
      // setUser(data)
      // setMessage('✅ Profile updated successfully!')
      
      setMessage('✅ Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)

    } catch (err) {
      console.error('Error:', err)
      setError('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

 
  const goBack = () => {
    navigate('/dashboard')
  }

  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    )
  }

  
  return (
    <div className="container-fluid">
      
     
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          👤 My Profile
        </h1>
        <button 
          onClick={goBack} 
          className="btn btn-sm btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

  
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              
             
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <h4 className="font-weight-bold text-gray-800">
                  {user.name || 'User'}
                </h4>
                <p className="text-muted">
                  <span className="badge badge-primary">{user.role || 'Role'}</span>
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
                  <label className="font-weight-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>

              
                <div className="form-group">
                  <label className="font-weight-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user.email}
                    disabled
                    style={{ background: '#f8f9fa' }}
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>

                
                {user.registrationNumber && (
                  <div className="form-group">
                    <label className="font-weight-bold">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      className="form-control"
                      value={user.registrationNumber}
                      disabled
                      style={{ background: '#f8f9fa' }}
                    />
                  </div>
                )}

             
                <div className="form-group">
                  <label className="font-weight-bold">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={user.phone}
                    onChange={handleChange}
                  />
                </div>

  
                <div className="form-group">
                  <label className="font-weight-bold">Department</label>
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="Enter your department"
                    value={user.department}
                    onChange={handleChange}
                  />
                </div>

               
                <div className="form-group">
                  <label className="font-weight-bold">Bio</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="3"
                    placeholder="Tell us about yourself..."
                    value={user.bio}
                    onChange={handleChange}
                  />
                </div>

               
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5"
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
                    className="btn btn-secondary btn-lg px-4 ml-2"
                    onClick={() => {
                      setUser({
                        ...user,
                        name: user.name,
                        phone: user.phone,
                        department: user.department,
                        bio: user.bio
                      })
                      setMessage('')
                      setError('')
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-top">
                <h6 className="font-weight-bold text-primary">Account Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Role:</strong> {user.role || 'Not set'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Member Since:</strong> {user.joinedDate || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage