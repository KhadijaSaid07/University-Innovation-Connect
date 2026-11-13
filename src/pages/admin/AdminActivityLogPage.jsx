import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const AdminActivityLogPage = () => {
  const navigate = useNavigate()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState({ name: 'Admin', email: '' })

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
      setAdmin({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin',
        email: user.email || ''
      })
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/activity-log`)
      setLogs(res.data || [])
    } catch (err) {
      console.error('Fetch activity logs error:', err)
      setMessage('Could not load activity logs')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const deleteLog = async (id) => {
    try {
      await axios.delete(`${API}/activity-log/${id}`)
      setLogs(prev => prev.filter(l => l.id !== id))
      setMessage('✅ Activity log entry deleted')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Delete log error:', err)
      setMessage('❌ Failed to delete log entry')
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const clearAllLogs = async () => {
    if (!window.confirm('🗑️ Are you sure you want to clear all activity logs?')) return
    try {
      await axios.delete(`${API}/activity-log/clear`)
      setLogs([])
      setMessage('✅ All activity logs cleared')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Clear logs error:', err)
      setMessage('❌ Failed to clear activity logs')
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return String(dateStr)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return String(dateStr)
    }
  }

  const getActionBadge = (action) => {
    const map = {
      USER_REGISTERED: { icon: '🎓', label: 'Registered', color: 'badge-primary' },
      USER_LOGIN: { icon: '🔑', label: 'Login', color: 'badge-primary' },
      LECTURER_CREATED: { icon: '👨‍🏫', label: 'Lecturer Added', color: 'badge-warning' },
      ADMIN_CREATED: { icon: '👑', label: 'Admin Added', color: 'badge-danger' },
      PROFILE_UPDATED: { icon: '✏️', label: 'Profile Updated', color: 'badge-primary' },
      USER_DELETED: { icon: '🗑️', label: 'User Deleted', color: 'badge-danger' },
      IDEA_CREATED: { icon: '💡', label: 'Idea Posted', color: 'badge-primary' },
      IDEA_UPDATED: { icon: '📝', label: 'Idea Edited', color: 'badge-warning' },
      IDEA_DELETED: { icon: '🗑️', label: 'Idea Deleted', color: 'badge-danger' },
      IDEA_STATUS_CHANGED: { icon: '🔄', label: 'Status Changed', color: 'badge-warning' },
      COMMENT_ADDED: { icon: '💬', label: 'Comment Added', color: 'badge-primary' },
      COMMENT_UPDATED: { icon: '✏️', label: 'Comment Edited', color: 'badge-warning' },
      COMMENT_DELETED: { icon: '🗑️', label: 'Comment Deleted', color: 'badge-danger' },
      FEEDBACK_ADDED: { icon: '📋', label: 'Feedback Given', color: 'badge-warning' },
      FEEDBACK_UPDATED: { icon: '✏️', label: 'Feedback Edited', color: 'badge-warning' },
      FEEDBACK_DELETED: { icon: '🗑️', label: 'Feedback Deleted', color: 'badge-danger' },
      VOTE_CAST: { icon: '⭐', label: 'Voted', color: 'badge-primary' },
      VOTE_REMOVED: { icon: '❌', label: 'Vote Removed', color: 'badge-danger' }
    }
    return map[action] || { icon: '📌', label: action || 'Activity', color: 'badge-primary' }
  }

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: 'badge-danger',
      LECTURER: 'badge-warning',
      STUDENT: 'badge-primary'
    }
    return colors[role] || 'badge-primary'
  }

  const filteredLogs = logs.filter(log => {
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter
    const matchesRole = roleFilter === 'ALL' || log.actorRole === roleFilter
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      log.description?.toLowerCase().includes(q) ||
      log.actorName?.toLowerCase().includes(q) ||
      log.actorEmail?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q)
    return matchesCategory && matchesRole && matchesSearch
  })

  const userLogsCount = logs.filter(l => l.category === 'USER').length
  const ideaLogsCount = logs.filter(l => l.category === 'IDEA').length
  const engagementLogsCount = logs.filter(l => l.category === 'ENGAGEMENT').length

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="System Activity Log"
          pageSubtitle="Audit trail of user actions, idea updates, comments, votes, and feedback"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large"></div>
            <p>Loading activity logs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="Activity Log"
        pageSubtitle="Audit trail of user registrations, logins, idea submissions, and reviews"
      />

      <div className="admin-content">
        <div className="content-container">
          <div className="page-header">
            <div className="page-header-left">
              <h1>📋 System Activity Log</h1>
              <p>Monitor all user, student, lecturer, and admin actions in real time</p>
            </div>
            <div className="page-header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="admin-view-btn" onClick={fetchLogs} style={{ padding: '10px 16px' }}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
              {logs.length > 0 && (
                <button className="admin-delete-btn" onClick={clearAllLogs} style={{ padding: '10px 16px' }}>
                  <i className="fas fa-trash-alt"></i> Clear All
                </button>
              )}
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          {/* Stats Summary */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card stat-primary" onClick={() => setCategoryFilter('ALL')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{logs.length}</h3>
                <p>Total Events</p>
              </div>
            </div>
            <div className="stat-card stat-purple" onClick={() => setCategoryFilter('USER')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{userLogsCount}</h3>
                <p>User & Auth Events</p>
              </div>
            </div>
            <div className="stat-card stat-success" onClick={() => setCategoryFilter('IDEA')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <h3>{ideaLogsCount}</h3>
                <p>Idea Events</p>
              </div>
            </div>
            <div className="stat-card stat-warning" onClick={() => setCategoryFilter('ENGAGEMENT')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{engagementLogsCount}</h3>
                <p>Votes, Comments & Feedback</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <input
                type="text"
                className="admin-search-input"
                placeholder="🔍 Search logs by user, email, action, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ALL', 'USER', 'IDEA', 'ENGAGEMENT'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={categoryFilter === cat ? 'admin-add-btn' : 'admin-view-btn'}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            <select
              className="admin-form-control"
              style={{ width: 'auto', minWidth: '150px', padding: '8px 12px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">🎓 Students</option>
              <option value="LECTURER">👨‍🏫 Lecturers</option>
              <option value="ADMIN">👑 Admins</option>
            </select>
          </div>

          {/* Activity Log Table */}
          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Actor</th>
                    <th>Role</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="admin-empty-text">
                        No activity logs found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => {
                      const badge = getActionBadge(log.action)
                      return (
                        <tr key={log.id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <span className={`admin-badge ${badge.color}`} style={{ whiteSpace: 'nowrap' }}>
                              {badge.icon} {badge.label}
                            </span>
                          </td>
                          <td style={{ maxWidth: '420px' }}>{log.description}</td>
                          <td>
                            <div><strong>{log.actorName || 'System'}</strong></div>
                            {log.actorEmail && (
                              <small style={{ color: '#8B6BA8' }}>{log.actorEmail}</small>
                            )}
                          </td>
                          <td>
                            <span className={`admin-badge ${getRoleBadge(log.actorRole)}`}>
                              {log.actorRole || 'ADMIN'}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#6B7280' }}>
                            🕒 {formatDate(log.createdDate)}
                          </td>
                          <td>
                            <button
                              className="admin-delete-btn"
                              onClick={() => deleteLog(log.id)}
                              title="Delete log entry"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminActivityLogPage

