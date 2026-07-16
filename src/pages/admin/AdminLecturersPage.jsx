import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './AdminDashboardPage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'
const AUTH_API = 'http://localhost:8081/api/auth'

const AdminLecturersPage = () => {
  const navigate = useNavigate()
  
  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    specialization: ''
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      navigate('/login')
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.role?.toUpperCase() !== 'ADMIN') {
        navigate('/login')
        return
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        const lecturersList = res.data.filter(u => u.role === 'LECTURER')
        setLecturers(lecturersList)
      } catch (err) {
        console.error('Fetch lecturers error:', err)
        setMessage('Could not load lecturers')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }
    fetchLecturers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const openAddModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      department: '',
      specialization: ''
    })
    setShowModal(true)
  }

  // FIXED: Try multiple endpoint options
  const addLecturer = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMessage('⚠️ Please fill in all required fields')
      setMessageType('error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      }
      
      console.log('📤 Adding lecturer with body:', body)
      
      // Try Option 1: /admin/create-lecturer
      let endpoint = `${AUTH_API}/admin/create-lecturer`
      let res
      
      try {
        console.log('📤 Trying endpoint 1:', endpoint)
        res = await axios.post(endpoint, body)
      } catch (err1) {
        console.log('❌ Endpoint 1 failed:', err1.response?.status)
        
        // Try Option 2: /create-lecturer
        endpoint = `${AUTH_API}/create-lecturer`
        console.log('📤 Trying endpoint 2:', endpoint)
        
        try {
          res = await axios.post(endpoint, body)
        } catch (err2) {
          console.log('❌ Endpoint 2 failed:', err2.response?.status)
          
          // Try Option 3: /register with role
          endpoint = `${AUTH_API}/register`
          const bodyWithRole = {
            ...body,
            role: 'LECTURER'
          }
          console.log('📤 Trying endpoint 3:', endpoint, bodyWithRole)
          res = await axios.post(endpoint, bodyWithRole)
        }
      }
      
      console.log('✅ Response:', res.data)
      
      if (res.data) {
        const usersRes = await axios.get(`${API}/user`)
        const lecturersList = usersRes.data.filter(u => u.role === 'LECTURER')
        setLecturers(lecturersList)
        
        setMessage(`✅ Lecturer "${formData.firstName} ${formData.lastName}" added successfully! 🎉`)
        setMessageType('success')
        setShowModal(false)
        setFormData({ firstName: '', lastName: '', email: '', password: '', department: '', specialization: '' })
        setTimeout(() => setMessage(''), 4000)
      }
      
    } catch (err) {
      console.error('❌ Add lecturer error:', err)
      console.error('Status:', err.response?.status)
      console.error('Response:', err.response?.data)
      
      let errorMsg = 'Failed to add lecturer'
      if (err.response?.status === 409) {
        errorMsg = '⚠️ Email already exists. Please use a different email.'
      } else if (err.response?.status === 400) {
        errorMsg = `⚠️ ${err.response?.data?.message || 'Invalid data'}`
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMsg = '⚠️ Authentication failed. Please login again as ADMIN.'
        setTimeout(() => navigate('/login'), 2000)
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const deleteLecturer = async (id, name) => {
    if (!window.confirm(`🗑️ Delete lecturer: "${name}"?`)) return
    
    try {
      await axios.delete(`${API}/user/${id}`)
      
      const usersRes = await axios.get(`${API}/user`)
      const lecturersList = usersRes.data.filter(u => u.role === 'LECTURER')
      setLecturers(lecturersList)
      
      setMessage(`✅ Lecturer "${name}" deleted successfully! 🗑️`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      console.error('Delete lecturer error:', err)
      
      let errorMsg = 'Failed to delete lecturer'
      if (err.response?.status === 500) {
        errorMsg = '⚠️ Cannot delete this lecturer because they have existing feedbacks.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredLecturers = lecturers.filter(l =>
    l.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFullName = (l) => {
    return `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Unknown'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Loading lecturers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      
      {sidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">👑</span>
          <span className="brand-text">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className="sidebar-link">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/admin-users" className="sidebar-link">
            <i className="fas fa-users"></i> Users
          </Link>
          <Link to="/admin-ideas" className="sidebar-link">
            <i className="fas fa-lightbulb"></i> Ideas
          </Link>
          <Link to="/admin-lecturers" className="sidebar-link active">
            <i className="fas fa-chalkboard-teacher"></i> Lecturers
          </Link>
          <button className="sidebar-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      <header className="admin-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-brand">
              <span className="brand-icon">👑</span>
              <span className="brand-text">Admin Panel</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="content-container">
          
          <div className="page-header">
            <div className="page-header-left">
              <h1>👨‍🏫 Lecturers</h1>
              <p>Manage all lecturers on the platform</p>
            </div>
            <div className="page-header-right">
              <span className="admin-count-badge">
                Total: {lecturers.length} lecturers
              </span>
              <button className="admin-add-btn" onClick={openAddModal}>
                <i className="fas fa-plus"></i> Add Lecturer
              </button>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="admin-search-bar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="🔍 Search lecturers by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Specialization</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="admin-empty-text">
                        {lecturers.length === 0 ? 'No lecturers registered yet' : 'No matching lecturers found'}
                      </td>
                    </tr>
                  ) : (
                    filteredLecturers.map((lecturer, index) => (
                      <tr key={lecturer.id}>
                        <td>{index + 1}</td>
                        <td><strong>{getFullName(lecturer)}</strong></td>
                        <td>{lecturer.email}</td>
                        <td>{lecturer.department || '-'}</td>
                        <td>{lecturer.specialization || '-'}</td>
                        <td>
                          <button 
                            className="admin-delete-btn" 
                            onClick={() => deleteLecturer(lecturer.id, getFullName(lecturer))}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>➕ Add New Lecturer</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={addLecturer} className="admin-modal-form">
              <div className="admin-form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="admin-form-control"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="admin-form-control"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  className="admin-form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="admin-form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  className="admin-form-control"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="admin-form-control"
                  placeholder="Enter specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-modal-actions">
                <button type="submit" className="admin-save-btn" disabled={submitting}>
                  {submitting ? '⏳ Adding...' : '✅ Add Lecturer'}
                </button>
                <button type="button" className="admin-cancel-btn" onClick={() => setShowModal(false)}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminLecturersPage