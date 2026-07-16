import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './AdminDashboardPage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'
const AUTH_API = 'http://localhost:8081/api/auth'

const AdminUsersPage = () => {
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showUserIdeas, setShowUserIdeas] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userIdeas, setUserIdeas] = useState([])
  const [ideasLoading, setIdeasLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'LECTURER'
  })

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
        return
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        setUsers(res.data)
      } catch (err) {
        console.error('Fetch users error:', err)
        setMessage('Could not load users')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addUser = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMessage('⚠️ Please fill in all fields')
      setMessageType('error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      let endpoint = ''
      let body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      }
      
      if (formData.role === 'ADMIN') {
        endpoint = `${AUTH_API}/admin/create-admin`
      } else if (formData.role === 'LECTURER') {
        endpoint = `${AUTH_API}/admin/create-lecturer`
      }
      
      const res = await axios.post(endpoint, body)
      
      if (res.data) {
        const usersRes = await axios.get(`${API}/user`)
        setUsers(usersRes.data)
        
        setMessage(`✅ ${formData.role} added successfully! 🎉`)
        setMessageType('success')
        setShowModal(false)
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'LECTURER' })
        setTimeout(() => setMessage(''), 4000)
      }
      
    } catch (err) {
      console.error('Add user error:', err)
      
      let errorMsg = 'Failed to add user'
      if (err.response?.status === 409) {
        errorMsg = '⚠️ Email already exists. Please use a different email.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setSubmitting(false)
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
    if (!window.confirm(`🗑️ Delete idea: "${ideaTitle}"?`)) return
    
    try {
      await axios.delete(`${API}/idea/${ideaId}`)
      
      const res = await axios.get(`${API}/user/${selectedUser.id}/ideas`)
      setUserIdeas(res.data || [])
      
      setMessage(`✅ Idea "${ideaTitle}" deleted!`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      console.error('Delete idea error:', err)
      setMessage(`❌ ${err.response?.data?.message || 'Failed to delete idea'}`)
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const deleteUser = async (id, name) => {
    if (!window.confirm(`🗑️ Delete user: "${name}"?`)) return
    
    try {
      await axios.delete(`${API}/user/${id}`)
      
      const usersRes = await axios.get(`${API}/user`)
      setUsers(usersRes.data)
      
      setMessage(`✅ User "${name}" deleted successfully! 🗑️`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      console.error('Delete user error:', err)
      
      let errorMsg = 'Failed to delete user'
      if (err.response?.status === 500) {
        errorMsg = '⚠️ Cannot delete this user because they have existing data.\n\nClick "View Ideas" to see and delete their ideas first.'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredUsers = users.filter(u =>
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'
  }

  const getRoleBadge = (role) => {
    const colors = {
      'ADMIN': 'badge-danger',
      'LECTURER': 'badge-warning',
      'STUDENT': 'badge-primary'
    }
    return colors[role] || 'badge-primary'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Loading users...</p>
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
          <Link to="/admin-users" className="sidebar-link active">
            <i className="fas fa-users"></i> Users
          </Link>
          <Link to="/admin-ideas" className="sidebar-link">
            <i className="fas fa-lightbulb"></i> Ideas
          </Link>
          <Link to="/admin-lecturers" className="sidebar-link">
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
              <h1>👥 Users</h1>
              <p>Manage all users on the platform</p>
            </div>
            <button className="admin-add-btn" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus"></i> Add User
            </button>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          <div className="admin-search-bar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="🔍 Search users by name or email..."
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
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="admin-empty-text">No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td><strong>{getFullName(user)}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`admin-badge ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="admin-view-btn"
                            onClick={() => viewUserIdeas(user)}
                          >
                            <i className="fas fa-eye"></i> Ideas
                          </button>
                          <button 
                            className="admin-delete-btn" 
                            onClick={() => deleteUser(user.id, getFullName(user))}
                            disabled={user.role === 'ADMIN' && user.email === 'admin@uic.com'}
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

      {/* User Ideas Modal */}
      {showUserIdeas && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowUserIdeas(false)}>
          <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>💡 Ideas by {getFullName(selectedUser)}</h3>
              <button className="admin-modal-close" onClick={() => setShowUserIdeas(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              {ideasLoading ? (
                <div className="admin-loading">
                  <div className="admin-spinner-small"></div>
                  <p>Loading ideas...</p>
                </div>
              ) : userIdeas.length === 0 ? (
                <p className="admin-empty-text">📭 No ideas posted by this user</p>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userIdeas.map((idea, index) => (
                        <tr key={idea.id}>
                          <td>{index + 1}</td>
                          <td>{idea.title}</td>
                          <td>{idea.category}</td>
                          <td>
                            <span className={`admin-status-badge ${idea.status?.toLowerCase() || 'pending'}`}>
                              {idea.status || 'PENDING'}
                            </span>
                          </td>
                          <td>⭐ {idea.voteIds?.length || 0}</td>
                          <td>
                            <button 
                              className="admin-delete-btn"
                              onClick={() => deleteIdea(idea.id, idea.title)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="admin-modal-actions">
                <button className="admin-cancel-btn" onClick={() => setShowUserIdeas(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>➕ Add New User</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={addUser} className="admin-modal-form">
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
                <label>Role *</label>
                <select
                  name="role"
                  className="admin-form-control"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="LECTURER">👨‍🏫 Lecturer</option>
                  <option value="ADMIN">👑 Admin</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="submit" className="admin-save-btn" disabled={submitting}>
                  {submitting ? '⏳ Adding...' : '✅ Add User'}
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

export default AdminUsersPage