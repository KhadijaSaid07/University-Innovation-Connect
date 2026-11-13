import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`
const AUTH_API = `${BASE_URL}/auth`

const initialLecturerForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  specialization: ''
}

const AdminLecturersPage = () => {
  const navigate = useNavigate()

  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // Add Lecturer Modal
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(initialLecturerForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Edit Lecturer Modal
  const [editingLecturer, setEditingLecturer] = useState(null)
  const [editForm, setEditForm] = useState(initialLecturerForm)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

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
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${API}/user`)
      const lecturersList = (res.data || []).filter(u => u.role === 'LECTURER')
      setLecturers(lecturersList)
    } catch (err) {
      console.error('Fetch lecturers error:', err)
      setMessage('Could not load lecturers.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLecturers()
  }, [])

  const showNotice = (msg, type = 'success', duration = 4500) => {
    setMessage(msg)
    setMessageType(type)
    if (duration) {
      setTimeout(() => setMessage(''), duration)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const openAddModal = () => {
    setFormData(initialLecturerForm)
    setShowPassword(false)
    setShowModal(true)
  }

  const closeAddModal = () => {
    setShowModal(false)
    setShowPassword(false)
  }

  const addLecturer = async (e) => {
    e.preventDefault()

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password) {
      showNotice('Please complete all required fields.', 'error')
      return
    }

    if (formData.password.length < 6) {
      showNotice('Your Password is too weak', 'error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || '',
        department: formData.department?.trim() || '',
        specialization: formData.specialization?.trim() || ''
      }

      const res = await axios.post(`${AUTH_API}/admin/create-lecturer`, body)

      if (res.data) {
        await fetchLecturers()
        showNotice(`You added lecturer "${body.firstName} ${body.lastName}" successfully`, 'success')
        closeAddModal()
      }
    } catch (err) {
      console.error('Add lecturer error:', err)
      let errorMsg = 'Failed to add lecturer.'
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('exist')) {
        errorMsg = 'Email address is already registered. Please use a different email.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      showNotice(errorMsg, 'error', 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (lecturer) => {
    setEditingLecturer(lecturer)
    setEditForm({
      firstName: lecturer.firstName || '',
      lastName: lecturer.lastName || '',
      email: lecturer.email || '',
      password: '',
      phone: lecturer.phone || '',
      department: lecturer.department || '',
      specialization: lecturer.specialization || ''
    })
    setShowEditPassword(false)
  }

  const closeEditModal = () => {
    setEditingLecturer(null)
    setShowEditPassword(false)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm({ ...editForm, [name]: value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingLecturer) return

    if (editForm.password && editForm.password.length < 6) {
      showNotice('Your Password is too weak', 'error')
      return
    }

    setSavingEdit(true)
    try {
      const payload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone ? editForm.phone.trim() : '',
        department: editForm.department ? editForm.department.trim() : '',
        specialization: editForm.specialization ? editForm.specialization.trim() : ''
      }

      if (editForm.password.trim()) {
        payload.password = editForm.password
      }

      const res = await axios.put(`${AUTH_API}/profile/${editingLecturer.id}`, payload)
      if (res.data) {
        await fetchLecturers()
        showNotice(`You updated lecturer "${payload.firstName} ${payload.lastName}" successfully`, 'success')
        closeEditModal()
      }
    } catch (err) {
      console.error('Update lecturer error:', err)
      showNotice(err.response?.data?.message || 'Failed to update lecturer.', 'error')
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteLecturer = async (id, name) => {
    if (!window.confirm(`Delete lecturer "${name}"? This action cannot be undone.`)) return

    try {
      await axios.delete(`${API}/user/${id}`)
      await fetchLecturers()
      showNotice(`You deleted lecturer "${name}" successfully`, 'success')
    } catch (err) {
      console.error('Delete lecturer error:', err)
      let errorMsg = 'Failed to delete lecturer.'
      if (err.response?.status === 500) {
        errorMsg = 'Cannot delete this lecturer because they have existing review feedback.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      showNotice(errorMsg, 'error', 5000)
    }
  }

  const filteredLecturers = lecturers.filter(l => {
    const q = searchTerm.trim().toLowerCase()
    return (
      !q ||
      l.firstName?.toLowerCase().includes(q) ||
      l.lastName?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.department?.toLowerCase().includes(q) ||
      l.specialization?.toLowerCase().includes(q)
    )
  })

  const getFullName = (l) => {
    return `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Unknown'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="Lecturers Directory"
          pageSubtitle="Create and manage academic faculty accounts"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large"></div>
            <p>Loading lecturers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="Lecturers Directory"
        pageSubtitle="Create and manage academic faculty accounts"
      />

      <div className="admin-content">
        <div className="content-container">
          <div className="page-header uic-responsive-header">
            <div className="page-header-left">
              <h1>Faculty Lecturers</h1>
              <p>Manage all academic faculty reviewers on the platform</p>
            </div>
            <div className="page-header-right">
              <span className="admin-count-badge">
                Total: {lecturers.length} lecturers
              </span>
              <button className="admin-add-btn" onClick={openAddModal}>
                <i className="fas fa-user-plus"></i>
                <span>Add Lecturer</span>
              </button>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="uic-admin-toolbar">
            <div className="uic-search-box" style={{ flex: 1, maxWidth: '100%' }}>
              <i className="fas fa-search uic-search-icon" />
              <input
                type="text"
                className="uic-search-field"
                placeholder="Search lecturers by name, email, department, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="uic-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Lecturer</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Specialization</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="admin-empty-text">
                        {lecturers.length === 0 ? 'No lecturers registered yet.' : 'No matching lecturers found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLecturers.map((lecturer, index) => (
                      <tr key={lecturer.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="uic-table-avatar">
                              {getFullName(lecturer).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{getFullName(lecturer)}</div>
                              {lecturer.phone && <div className="text-muted small">{lecturer.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{lecturer.email}</td>
                        <td>{lecturer.department || '—'}</td>
                        <td>{lecturer.specialization || '—'}</td>
                        <td>
                          <div className="uic-table-actions">
                            <button
                              type="button"
                              className="uic-action-btn edit"
                              onClick={() => openEditModal(lecturer)}
                            >
                              <i className="fas fa-pen" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="uic-action-btn delete"
                              onClick={() => deleteLecturer(lecturer.id, getFullName(lecturer))}
                            >
                              <i className="fas fa-trash-alt" />
                              <span>Delete</span>
                            </button>
                          </div>
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

      {/* Add Lecturer Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeAddModal}>
          <div className="admin-modal uic-responsive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="m-0">Add New Lecturer</h3>
                <p className="text-muted small mb-0 mt-1">
                  Create a faculty reviewer account with department and specialization
                </p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeAddModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={addLecturer} className="admin-modal-form">
              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>First Name <span className="uic-required">*</span></label>
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
                  <label>Last Name <span className="uic-required">*</span></label>
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
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Email Address <span className="uic-required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="admin-form-control"
                    placeholder="lecturer@university.ac.tz"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="admin-form-control"
                    placeholder="e.g., +255 700 000 000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Password <span className="uic-required">*</span></label>
                <div className="uic-password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="admin-form-control uic-password-input"
                    placeholder="Enter password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="uic-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    className="admin-form-control"
                    placeholder="e.g., Engineering & ICT"
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
                    placeholder="e.g., Software Systems"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel-btn" onClick={closeAddModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Lecturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lecturer Modal */}
      {editingLecturer && (
        <div className="admin-modal-overlay" onClick={closeEditModal}>
          <div className="admin-modal uic-responsive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="m-0">Edit Lecturer</h3>
                <p className="text-muted small mb-0 mt-1">
                  Update details or reset password for {getFullName(editingLecturer)}
                </p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeEditModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="admin-modal-form">
              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>First Name <span className="uic-required">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className="admin-form-control"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Last Name <span className="uic-required">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    className="admin-form-control"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Email Address <span className="uic-required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="admin-form-control"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="admin-form-control"
                    value={editForm.phone}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    className="admin-form-control"
                    value={editForm.department}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="admin-form-control"
                    value={editForm.specialization}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>New Password (leave blank to keep current password)</label>
                <div className="uic-password-field">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    name="password"
                    className="admin-form-control uic-password-input"
                    placeholder="Enter new password to reset"
                    value={editForm.password}
                    onChange={handleEditChange}
                  />
                  <button
                    type="button"
                    className="uic-password-toggle"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                    title={showEditPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showEditPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
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
