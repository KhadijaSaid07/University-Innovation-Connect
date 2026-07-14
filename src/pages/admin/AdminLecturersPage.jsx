import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [editingLecturer, setEditingLecturer] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    specialization: '',
    gender: ''
  })
  const [submitting, setSubmitting] = useState(false)

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

  // Fetch lecturers from backend
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        // Filter only LECTURER role
        const lecturersList = data.filter(u => u.role === 'LECTURER')
        setLecturers(lecturersList)
        
      } catch {
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
    setEditingLecturer(null)
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

  // Open modal for editing
  const openEditModal = (lecturer) => {
    setEditingLecturer(lecturer)
    setFormData({
      firstName: lecturer.firstName || '',
      lastName: lecturer.lastName || '',
      email: lecturer.email || '',
      password: '',
      department: lecturer.department || '',
      specialization: lecturer.specialization || '',
      gender: lecturer.gender || ''
    })
    setShowModal(true)
  }

  // Save lecturer (Add or Edit)
  const saveLecturer = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      let res
      let data

      if (editingLecturer) {
        // EDIT lecturer
        const body = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          department: formData.department,
          specialization: formData.specialization
        }
        
        res = await fetch(`${API}/user/${editingLecturer.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        
        if (!res.ok) throw new Error('Failed to update')
        data = await res.json()
        
        setLecturers(lecturers.map(l => l.id === editingLecturer.id ? { ...l, ...data } : l))
        setMessage(`✅ Lecturer updated successfully!`)
        
      } else {
        // ADD new lecturer
        if (!formData.password) {
          setMessage('Password is required')
          setMessageType('error')
          setSubmitting(false)
          return
        }
        
        res = await fetch(`${API}/auth/admin/create-lecturer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          })
        })
        
        if (!res.ok) throw new Error('Failed to add')
        data = await res.json()
        
        setLecturers([...lecturers, { ...data, gender: formData.gender, department: formData.department, specialization: formData.specialization }])
        setMessage(`✅ Lecturer "${formData.firstName} ${formData.lastName}" added successfully!`)
      }
      
      setMessageType('success')
      setShowModal(false)
      setFormData({ firstName: '', lastName: '', email: '', password: '', department: '', specialization: '', gender: 'Male' })
      setEditingLecturer(null)
      
    } catch {
      setMessage(editingLecturer ? '❌ Failed to update lecturer' : '❌ Failed to add lecturer')
      setMessageType('error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Delete lecturer
  const deleteLecturer = async (id, name) => {
    if (!window.confirm(`Delete lecturer: ${name}?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Delete failed')
      
      setLecturers(lecturers.filter(l => l.id !== id))
      setMessage(`✅ Lecturer "${name}" deleted successfully!`)
      setMessageType('success')
      
    } catch {
      setMessage('❌ Failed to delete lecturer')
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
          <button className="admin-add-btn" onClick={openAddModal}>
            <i className="fas fa-plus" /> Add Lecturer
          </button>
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
            placeholder="Search lecturers by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

     
        <div className="admin-table-card">
          <div className="admin-table-responsive">
            <table className="admin-table-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty-text">No lecturers found</td>
                  </tr>
                ) : (
                  filteredLecturers.map((lecturer) => (
                    <tr key={lecturer.id}>
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
                          className="admin-edit-btn" 
                          onClick={() => openEditModal(lecturer)}
                        >
                          <i className="fas fa-edit" /> Edit
                        </button>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => deleteLecturer(lecturer.id, getFullName(lecturer))}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>{editingLecturer ? '✏️ Edit Lecturer' : '➕ Add New Lecturer'}</h3>
                <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times" />
                </button>
              </div>
              <form onSubmit={saveLecturer} className="admin-modal-form">
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
                {!editingLecturer && (
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
                )}
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
                    {submitting ? 'Saving...' : editingLecturer ? '💾 Update' : '✅ Add Lecturer'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
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