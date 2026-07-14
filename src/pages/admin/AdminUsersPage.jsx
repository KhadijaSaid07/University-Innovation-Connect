import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const AdminUsersPage = () => {
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
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
    role: 'STUDENT'
  })

  // Check admin auth
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setUsers(data)
        
      } catch {
        setMessage('Could not load users')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Add user (works for STUDENT, LECTURER, ADMIN)
  const addUser = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMessage('Please fill in all fields')
      setMessageType('error')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      
      // Use different endpoints based on role
      let endpoint = `${API}/auth/register`
      let body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      }
      
      if (formData.role === 'ADMIN') {
        endpoint = `${API}/auth/admin/create-admin`
      } else if (formData.role === 'LECTURER') {
        endpoint = `${API}/auth/admin/create-lecturer`
      }
      
      console.log('Sending to:', endpoint)
      console.log('Body:', body)
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      console.log('Response:', data)
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add user')
      }
      
      // Add to list
      setUsers([...users, data])
      setMessage(`✅ ${formData.role} added successfully!`)
      setMessageType('success')
      setShowModal(false)
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'STUDENT' })
      
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
      setMessageType('error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Delete user
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user: ${name}?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Delete failed')
      
      setUsers(users.filter(u => u.id !== id))
      setMessage(`✅ User "${name}" deleted!`)
      setMessageType('success')
      
    } catch {
      setMessage('❌ Failed to delete user')
      setMessageType('error')
    } finally {
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Filter users
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
      'ADMIN': 'admin-badge-danger',
      'LECTURER': 'admin-badge-warning',
      'STUDENT': 'admin-badge-primary'
    }
    return colors[role] || 'admin-badge-primary'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-loading">
            <div className="admin-spinner-large" />
            <p>Loading users...</p>
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
            <h1>👥 Users</h1>
            <p>Manage all users on the platform</p>
          </div>
          <button className="admin-add-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus" /> Add User
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
            placeholder="Search users..."
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
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="admin-empty-text">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{getFullName(user)}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`admin-badge ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => deleteUser(user.id, getFullName(user))}
                          disabled={user.role === 'ADMIN'}
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

        {/* Add User Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>➕ Add New User</h3>
                <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times" />
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
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="admin-modal-actions">
                  <button type="submit" className="admin-save-btn" disabled={submitting}>
                    {submitting ? 'Adding...' : '✅ Add User'}
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

export default AdminUsersPage