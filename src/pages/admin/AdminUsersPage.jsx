import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`
const AUTH_API = `${BASE_URL}/auth`

const initialAddForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'LECTURER',
  department: '',
  phone: '',
  specialization: ''
}

const AdminUsersPage = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // Add User Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState(initialAddForm)
  const [showAddPassword, setShowAddPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    phone: '',
    specialization: '',
    bio: ''
  })
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

  // Inspect User Ideas Modal state
  const [showUserIdeas, setShowUserIdeas] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userIdeas, setUserIdeas] = useState([])
  const [ideasLoading, setIdeasLoading] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const parsed = JSON.parse(user)
      if (parsed.role?.toUpperCase() !== 'ADMIN') {
        navigate('/login')
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/user`)
      setUsers(res.data || [])
    } catch (err) {
      console.error('Fetch users error:', err)
      setMessage('Could not load users.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
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
    setFormData(initialAddForm)
    setShowAddPassword(false)
    setShowAddModal(true)
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setShowAddPassword(false)
  }

  const addUser = async (e) => {
    e.preventDefault()

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password) {
      showNotice('Please complete all required fields.', 'error')
      return
    }

    if (formData.password.length < 6) {
      showNotice('Password must be at least 6 characters long.', 'error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department?.trim() || '',
        phone: formData.phone?.trim() || '',
        specialization: formData.specialization?.trim() || ''
      }

      let res
      if (formData.role === 'ADMIN') {
        res = await axios.post(`${AUTH_API}/admin/create-admin`, payload)
      } else if (formData.role === 'LECTURER') {
        res = await axios.post(`${AUTH_API}/admin/create-lecturer`, payload)
      } else {
        // Create student via /register, then update optional profile fields if provided
        res = await axios.post(`${AUTH_API}/register`, {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password
        })
        if (res.data?.id && (payload.department || payload.phone)) {
          await axios.put(`${AUTH_API}/profile/${res.data.id}`, {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            department: payload.department,
            phone: payload.phone
          })
        }
      }

      if (res?.data) {
        await fetchUsers()
        showNotice(`${formData.role} account for "${payload.firstName} ${payload.lastName}" created successfully.`, 'success')
        closeAddModal()
      }
    } catch (err) {
      console.error('Add user error:', err)
      let errorMsg = 'Failed to create user account.'
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('exist')) {
        errorMsg = 'Email address is already registered. Please use a different email.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      showNotice(errorMsg, 'error', 5500)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      department: user.department || '',
      phone: user.phone || '',
      specialization: user.specialization || '',
      bio: user.bio || ''
    })
    setShowEditPassword(false)
  }

  const closeEditModal = () => {
    setEditingUser(null)
    setShowEditPassword(false)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm({ ...editForm, [name]: value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    if (editForm.password && editForm.password.length < 6) {
      showNotice('New password must be at least 6 characters long.', 'error')
      return
    }

    setSavingEdit(true)
    try {
      const updatePayload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        department: editForm.department ? editForm.department.trim() : '',
        phone: editForm.phone ? editForm.phone.trim() : '',
        specialization: editForm.specialization ? editForm.specialization.trim() : '',
        bio: editForm.bio ? editForm.bio.trim() : ''
      }

      if (editForm.password.trim()) {
        updatePayload.password = editForm.password
      }

      const res = await axios.put(`${AUTH_API}/profile/${editingUser.id}`, updatePayload)
      if (res.data) {
        await fetchUsers()
        showNotice(`User "${updatePayload.firstName} ${updatePayload.lastName}" updated successfully.`, 'success')
        closeEditModal()
      }
    } catch (err) {
      console.error('Update user error:', err)
      showNotice(err.response?.data?.message || 'Failed to update user details.', 'error')
    } finally {
      setSavingEdit(false)
    }
  }

  const viewUserIdeas = async (user) => {
    setSelectedUser(user)
    setShowUserIdeas(true)
    setIdeasLoading(true)

    try {
      const res = await axios.get(`${API}/user/${user.id}/ideas`)
      setUserIdeas(res.data || [])
    } catch (err) {
      console.error('Fetch user ideas error:', err)
      setUserIdeas([])
    } finally {
      setIdeasLoading(false)
    }
  }

  const deleteIdea = async (ideaId, ideaTitle) => {
    if (!window.confirm(`Delete idea "${ideaTitle}"?`)) return

    try {
      await axios.delete(`${API}/idea/${ideaId}`)
      const res = await axios.get(`${API}/user/${selectedUser.id}/ideas`)
      setUserIdeas(res.data || [])
      showNotice(`Idea "${ideaTitle}" deleted successfully.`, 'success')
    } catch (err) {
      console.error('Delete idea error:', err)
      showNotice(err.response?.data?.message || 'Failed to delete idea.', 'error')
    }
  }

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return

    try {
      await axios.delete(`${API}/user/${id}`)
      await fetchUsers()
      showNotice(`User "${name}" deleted successfully.`, 'success')
    } catch (err) {
      console.error('Delete user error:', err)
      let errorMsg = 'Failed to delete user.'
      if (err.response?.status === 500) {
        errorMsg = 'Cannot delete this user because they have associated ideas, feedback, or comments. Click "Ideas" to remove their submissions first.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      showNotice(errorMsg, 'error', 6000)
    }
  }

  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'
  }

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: 'badge-danger',
      LECTURER: 'badge-warning',
      STUDENT: 'badge-primary'
    }
    return colors[role] || 'badge-primary'
  }

  const countByRole = (role) => {
    if (role === 'ALL') return users.length
    return users.filter(u => u.role === role).length
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    return matchesRole && matchesSearch
  })

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="Users Directory"
          pageSubtitle="View and manage registered students, lecturers, and administrators"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="User Management"
        pageSubtitle="Create, edit, search, and manage students, lecturers, and administrators"
      />

      <div className="admin-content">
        <div className="content-container">
          {/* Page Header */}
          <div className="page-header uic-responsive-header">
            <div className="page-header-left">
              <h1>Users Directory</h1>
              <p>Manage all student, faculty lecturer, and administrator accounts</p>
            </div>
            <div className="page-header-right">
              <span className="admin-count-badge">
                Showing {filteredUsers.length} of {users.length}
              </span>
              <button className="admin-add-btn" onClick={openAddModal}>
                <i className="fas fa-user-plus"></i>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          {/* Role Filter Pills + Search Bar */}
          <div className="uic-admin-toolbar">
            <div className="uic-role-tabs">
              {[
                { key: 'ALL', label: `All Users (${countByRole('ALL')})` },
                { key: 'STUDENT', label: `Students (${countByRole('STUDENT')})` },
                { key: 'LECTURER', label: `Lecturers (${countByRole('LECTURER')})` },
                { key: 'ADMIN', label: `Admins (${countByRole('ADMIN')})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`uic-role-tab ${roleFilter === tab.key ? 'active' : ''}`}
                  onClick={() => setRoleFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="uic-search-box">
              <i className="fas fa-search uic-search-icon" />
              <input
                type="text"
                className="uic-search-field"
                placeholder="Search by name, email, or department..."
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

          {/* Users Table */}
          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="admin-empty-text">
                        No users match your current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="uic-table-avatar">
                              {getFullName(user).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{getFullName(user)}</div>
                              {user.phone && <div className="text-muted small">{user.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.department || '—'}</td>
                        <td>
                          <span className={`admin-badge ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="uic-table-actions">
                            <button
                              type="button"
                              className="uic-action-btn view"
                              onClick={() => viewUserIdeas(user)}
                              title="View user ideas"
                            >
                              <i className="fas fa-lightbulb" />
                              <span>Ideas</span>
                            </button>
                            <button
                              type="button"
                              className="uic-action-btn edit"
                              onClick={() => openEditModal(user)}
                              title="Edit user details or reset password"
                            >
                              <i className="fas fa-pen" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="uic-action-btn delete"
                              onClick={() => deleteUser(user.id, getFullName(user))}
                              disabled={user.role === 'ADMIN' && user.email === 'admin@uic.com'}
                              title={
                                user.role === 'ADMIN' && user.email === 'admin@uic.com'
                                  ? 'Primary system admin cannot be deleted'
                                  : 'Delete user'
                              }
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={closeAddModal}>
          <div className="admin-modal uic-responsive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="m-0">Add New User</h3>
                <p className="text-muted small mb-0 mt-1">
                  Create a Student, Faculty Lecturer, or Administrator account
                </p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeAddModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={addUser} className="admin-modal-form">
              <div className="uic-form-grid-2">
                <div className="admin-form-group">
                  <label>First Name <span className="uic-required">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className="admin-form-control"
                    placeholder="e.g., Amina"
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
                    placeholder="e.g., Hassan"
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
                    placeholder="user@university.ac.tz"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Account Role <span className="uic-required">*</span></label>
                  <select
                    name="role"
                    className="admin-form-control"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Faculty Lecturer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Password <span className="uic-required">*</span></label>
                <div className="uic-password-field">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
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
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    aria-label={showAddPassword ? 'Hide password' : 'Show password'}
                    title={showAddPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showAddPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
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
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={handleChange}
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

              {formData.role === 'LECTURER' && (
                <div className="admin-form-group">
                  <label>Academic Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="admin-form-control"
                    placeholder="e.g., Artificial Intelligence & Data Systems"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel-btn" onClick={closeAddModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={submitting}>
                  {submitting ? 'Creating Account...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={closeEditModal}>
          <div className="admin-modal uic-responsive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="m-0">Edit User Account</h3>
                <p className="text-muted small mb-0 mt-1">
                  Update profile information or set a new password for {getFullName(editingUser)}
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
                    placeholder="Phone number"
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
                    placeholder="Department"
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
                    placeholder="Specialization"
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

      {/* User Ideas Modal */}
      {showUserIdeas && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowUserIdeas(false)}>
          <div className="admin-modal admin-modal-large uic-responsive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="m-0">Ideas Submitted by {getFullName(selectedUser)}</h3>
                <p className="text-muted small mb-0 mt-1">{selectedUser.email}</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setShowUserIdeas(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              {ideasLoading ? (
                <div className="uic-page-loading" style={{ minHeight: '200px' }}>
                  <div className="admin-spinner-small"></div>
                  <p>Loading ideas...</p>
                </div>
              ) : userIdeas.length === 0 ? (
                <p className="admin-empty-text">No ideas submitted by this user.</p>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table-full">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Votes</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userIdeas.map((idea, index) => (
                        <tr key={idea.id}>
                          <td>{index + 1}</td>
                          <td className="fw-semibold">{idea.title}</td>
                          <td>{idea.category}</td>
                          <td>
                            <span className={`admin-status-badge ${idea.status?.toLowerCase() || 'pending'}`}>
                              {idea.status || 'PENDING'}
                            </span>
                          </td>
                          <td>{idea.voteIds?.length || 0}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="uic-action-btn delete"
                              onClick={() => deleteIdea(idea.id, idea.title)}
                            >
                              <i className="fas fa-trash-alt"></i>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowUserIdeas(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
