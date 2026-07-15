import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const AdminLecturersPage = () => {
  const navigate = useNavigate()
  
  // State
  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    specialization: '',
    gender: 'Male'
  })

  // Check admin auth
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

  // Fetch lecturers 
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        // Filter only LECTURER role
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

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Open modal for adding
  const openAddModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      department: '',
      specialization: '',
      gender: 'Male'
    })
    setShowModal(true)
  }

  // Add lecturer - NO TOKEN
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      }
      
      const res = await axios.post(`${API}/auth/admin/create-lecturer`, body)
      
      if (res.data) {
        // Refresh lecturers list
        const usersRes = await axios.get(`${API}/user`)
        const lecturersList = usersRes.data.filter(u => u.role === 'LECTURER')
        setLecturers(lecturersList)
        
        setMessage(`✅ Lecturer "${formData.firstName} ${formData.lastName}" added successfully! 🎉`)
        setMessageType('success')
        setShowModal(false)
        setFormData({ firstName: '', lastName: '', email: '', password: '', department: '', specialization: '', gender: 'Male' })
      }
      
    } catch (err) {
      console.error('Add lecturer error:', err)
      
      let errorMsg = 'Failed to add lecturer'
      if (err.response?.status === 409) {
        errorMsg = '⚠️ Email already exists. Please use a different email.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Delete lecturer - NO TOKEN
  const deleteLecturer = async (id, name) => {
    if (!window.confirm(`🗑️ Delete lecturer: "${name}"?`)) return
    
    try {
      await axios.delete(`${API}/user/${id}`)
      
      // Refresh lecturers list
      const usersRes = await axios.get(`${API}/user`)
      const lecturersList = usersRes.data.filter(u => u.role === 'LECTURER')
      setLecturers(lecturersList)
      
      setMessage(`✅ Lecturer "${name}" deleted successfully! 🗑️`)
      setMessageType('success')
      
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
    } finally {
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Filter lecturers by search
  const filteredLecturers = lecturers.filter(l =>
    l.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get full name
  const getFullName = (l) => {
    return `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Unknown'
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-loading">
            <div className="admin-spinner-large" />
            <p>Loading lecturers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>👨‍🏫 Lecturers</h1>
            <p>Manage all lecturers on the platform</p>
          </div>
          <div className="admin-header-right">
            <span className="admin-count-badge">
              Total: {lecturers.length} lecturers
            </span>
            <button className="admin-add-btn" onClick={openAddModal}>
              <i className="fas fa-plus" /> Add Lecturer
            </button>
          </div>
        </header>

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
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty-text">
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
                        <span className="admin-gender-badge">
                          {lecturer.gender === 'Female' ? '👩' : '👨'} {lecturer.gender || 'Male'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => deleteLecturer(lecturer.id, getFullName(lecturer))}
                        >
                          <i className="fas fa-trash" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Lecturer Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>➕ Add New Lecturer</h3>
                <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times" />
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
                    placeholder="Enter password (min 6 characters)"
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
                <div className="admin-form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="admin-form-control"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">👨 Male</option>
                    <option value="Female">👩 Female</option>
                  </select>
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
    </div>
  )
}

export default AdminLecturersPage