import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    users: 0, students: 0, lecturers: 0,
    ideas: 0, votes: 0, comments: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentIdeas, setRecentIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState({ name: '' })

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
      setAdmin({ name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin' })
    } catch {
      navigate('/login')
    }
  }, [navigate])

  // Get user name by ID
  const getUserName = async (userId) => {
    try {
      const res = await axios.get(`${API}/user/${userId}`)
      const user = res.data
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'
    } catch {
      return 'Unknown'
    }
  }

  // Fetch data from backend using axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await axios.get(`${API}/user`)
        const users = usersRes.data
        
        // Fetch ideas
        const ideasRes = await axios.get(`${API}/idea`)
        const ideas = ideasRes.data
        
        // Calculate stats - FIXED: use voteIds and commentIds
        const students = users.filter(u => u.role === 'STUDENT').length
        const lecturers = users.filter(u => u.role === 'LECTURER').length
        const totalVotes = ideas.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const totalComments = ideas.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
        
        setStats({
          users: users.length,
          students: students,
          lecturers: lecturers,
          ideas: ideas.length,
          votes: totalVotes,
          comments: totalComments
        })
        
        // Get recent users (last 5) with full names
        const recentUsersData = users.slice(-5).reverse()
        setRecentUsers(recentUsersData)
        
        // Get recent ideas with author names
        const recentIdeasData = ideas.slice(-5).reverse()
        
        // Fetch author names for each idea
        const ideasWithAuthors = await Promise.all(
          recentIdeasData.map(async (idea) => {
            let authorName = 'Unknown'
            if (idea.userId) {
              try {
                const userRes = await axios.get(`${API}/user/${idea.userId}`)
                const user = userRes.data
                authorName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'
              } catch {
                authorName = 'Unknown'
              }
            }
            return {
              ...idea,
              authorName: authorName
            }
          })
        )
        
        setRecentIdeas(ideasWithAuthors)
        
      } catch (err) {
        console.error('Error fetching admin data:', err)
        // Keep zeros if fetch fails
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-loading">
            <div className="admin-spinner-large" />
            <p>Loading dashboard...</p>
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
            <h1>📊 Dashboard</h1>
            <p>Welcome back, {admin.name}!</p>
          </div>
          <div className="admin-header-right">
            <span className="admin-user-badge">
              <i className="fas fa-user-shield" /> {admin.name}
            </span>
          </div>
        </header>

        {/* Row 1 - 3 Cards */}
        <div className="admin-stats-grid admin-stats-row-1">
          <div className="admin-stat-card admin-stat-primary">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-info">
              <h3>{stats.users}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-success">
            <div className="admin-stat-icon">💡</div>
            <div className="admin-stat-info">
              <h3>{stats.ideas}</h3>
              <p>Total Ideas</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-warning">
            <div className="admin-stat-icon">⭐</div>
            <div className="admin-stat-info">
              <h3>{stats.votes}</h3>
              <p>Total Votes</p>
            </div>
          </div>
        </div>

        {/* Row 2 - 3 Cards */}
        <div className="admin-stats-grid admin-stats-row-2">
          <div className="admin-stat-card admin-stat-info">
            <div className="admin-stat-icon">🎓</div>
            <div className="admin-stat-info">
              <h3>{stats.students}</h3>
              <p>Students</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-gold">
            <div className="admin-stat-icon">👨‍🏫</div>
            <div className="admin-stat-info">
              <h3>{stats.lecturers}</h3>
              <p>Lecturers</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-purple">
            <div className="admin-stat-icon">💬</div>
            <div className="admin-stat-info">
              <h3>{stats.comments}</h3>
              <p>Comments</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-recent-grid">
          <div className="admin-recent-card">
            <h3>👥 Recent Users</h3>
            {recentUsers.length === 0 ? (
              <p className="admin-empty-text">No users registered yet</p>
            ) : (
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
                      <td><span className="admin-badge">{user.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="admin-recent-card">
            <h3>💡 Recent Ideas</h3>
            {recentIdeas.length === 0 ? (
              <p className="admin-empty-text">No ideas posted yet</p>
            ) : (
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
                        <span className={`admin-status-badge ${idea.status?.toLowerCase() || 'pending'}`}>
                          {idea.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboardPage