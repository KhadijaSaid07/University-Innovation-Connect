import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    users: 0, students: 0, lecturers: 0, admins: 0,
    ideas: 0, votes: 0, comments: 0,
    pending: 0, underReview: 0, approved: 0, rejected: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentIdeas, setRecentIdeas] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState({ name: '', email: '' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ideasRes] = await Promise.all([
          axios.get(`${API}/user`),
          axios.get(`${API}/idea`)
        ])
        const users = usersRes.data || []
        const ideas = ideasRes.data || []
        
        const students = users.filter(u => u.role === 'STUDENT').length
        const lecturers = users.filter(u => u.role === 'LECTURER').length
        const admins = users.filter(u => u.role === 'ADMIN').length
        const totalVotes = ideas.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const totalComments = ideas.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
        const pending = ideas.filter(i => i.status === 'PENDING').length
        const underReview = ideas.filter(i => i.status === 'UNDER_REVIEW').length
        const approved = ideas.filter(i => i.status === 'APPROVED').length
        const rejected = ideas.filter(i => i.status === 'REJECTED').length
        
        setStats({
          users: users.length,
          students, lecturers, admins,
          ideas: ideas.length,
          votes: totalVotes,
          comments: totalComments,
          pending, underReview, approved, rejected
        })
        
        setRecentUsers(users.slice(-5).reverse())
        
        const recentIdeasData = ideas.slice(-5).reverse()
        const ideasWithAuthors = recentIdeasData.map(idea => {
          let authorName = 'Unknown'
          if (idea.userId) {
            const author = users.find(u => u.id === idea.userId)
            if (author) {
              authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Unknown'
            }
          }
          if (idea.userName) {
            authorName = idea.userName
          }
          return { ...idea, authorName }
        })
        setRecentIdeas(ideasWithAuthors)

        try {
          const logsRes = await axios.get(`${API}/activity-log`)
          setRecentLogs((logsRes.data || []).slice(0, 8))
        } catch (logErr) {
          console.error('Fetch activity logs error:', logErr)
        }
        
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return String(dateStr)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return String(dateStr)
    }
  }

  const getActionIcon = (action) => {
    const icons = {
      USER_REGISTERED: '🎓',
      USER_LOGIN: '🔑',
      LECTURER_CREATED: '👨‍🏫',
      ADMIN_CREATED: '👑',
      PROFILE_UPDATED: '✏️',
      USER_DELETED: '🗑️',
      IDEA_CREATED: '💡',
      IDEA_UPDATED: '📝',
      IDEA_DELETED: '🗑️',
      IDEA_STATUS_CHANGED: '🔄',
      COMMENT_ADDED: '💬',
      FEEDBACK_ADDED: '📋',
      VOTE_CAST: '⭐'
    }
    return icons[action] || '📌'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="System Overview"
          pageSubtitle="Real-time metrics, recent submissions, and platform activity"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="System Overview"
        pageSubtitle="Real-time metrics, recent submissions, and platform activity"
      />

      <div className="admin-content">
        <div className="content-container">
          
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>👋 Welcome, {admin.name}!</h1>
              <p>Manage the entire platform from here.</p>
            </div>
            <div className="welcome-badge">
              {admin.email && <span>📧 {admin.email}</span>}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.users}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <h3>{stats.ideas}</h3>
                <p>Total Ideas</p>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{stats.votes}</h3>
                <p>Total Votes</p>
              </div>
            </div>
            <div className="stat-card stat-info">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <h3>{stats.comments}</h3>
                <p>Total Comments</p>
              </div>
            </div>
          </div>

          <div className="stats-grid row2">
            <div className="stat-card stat-purple">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <h3>{stats.students}</h3>
                <p>Students</p>
              </div>
            </div>
            <div className="stat-card stat-gold">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-info">
                <h3>{stats.lecturers}</h3>
                <p>Lecturers</p>
              </div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-icon">👑</div>
              <div className="stat-info">
                <h3>{stats.admins}</h3>
                <p>Admins</p>
              </div>
            </div>
            <div className="stat-card stat-dark">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Pending Ideas</p>
              </div>
            </div>
          </div>

          <div className="recent-grid">
            <div className="recent-card">
              <h3>👥 Recent Users</h3>
              {recentUsers.length === 0 ? (
                <p className="empty-text">No users registered yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user, i) => (
                        <tr key={i}>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td><span className="badge">{user.role}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="recent-card">
              <h3>💡 Recent Ideas</h3>
              {recentIdeas.length === 0 ? (
                <p className="empty-text">No ideas posted yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Votes</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentIdeas.map((idea, i) => (
                        <tr key={i}>
                          <td>{idea.title}</td>
                          <td><strong>{idea.authorName}</strong></td>
                          <td>⭐ {idea.voteIds?.length || 0}</td>
                          <td>
                            <span className={`status-badge ${idea.status?.toLowerCase() || 'pending'}`}>
                              {idea.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Log Widget */}
          <div className="recent-card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>📋 Recent Activity Log</h3>
              <Link
                to="/admin-activity-logs"
                className="admin-view-btn"
                style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.85rem' }}
              >
                View All Activity →
              </Link>
            </div>
            {recentLogs.length === 0 ? (
              <p className="empty-text">No recent activities recorded yet</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Description</th>
                      <th>Actor</th>
                      <th>Role</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, i) => (
                      <tr key={log.id || i}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {getActionIcon(log.action)} <strong>{log.action?.replace(/_/g, ' ')}</strong>
                        </td>
                        <td>{log.description}</td>
                        <td>{log.actorName || 'System'}</td>
                        <td><span className="badge">{log.actorRole || 'ADMIN'}</span></td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#8B6BA8' }}>
                          {formatTime(log.createdDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
