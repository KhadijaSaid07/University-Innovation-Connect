import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IdeaModal from '../components/IdeaModal'
import './LecturerDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LecturerDashboardPage = () => {
  const navigate = useNavigate()
  
  // State
  const [lecturer, setLecturer] = useState({ name: '', email: '', department: '' })
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0 })
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)

  // Get logged in user
  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser()
        const token = localStorage.getItem('token')
        
        // Fetch all ideas
        const res = await fetch(`${API}/idea`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setIdeas(data)
        
        // Calculate stats
        const pending = data.filter(i => i.status === 'PENDING').length
        const reviewed = data.filter(i => i.status === 'APPROVED' || i.status === 'REJECTED').length
        
        setStats({
          total: data.length,
          pending: pending,
          reviewed: reviewed
        })
        
        // Set lecturer info
        if (user) {
          setLecturer({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Lecturer',
            email: user.email || '',
            department: user.department || ''
          })
        }
        
      } catch {
        setError('Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Modal functions
  const openModal = (idea) => setSelectedIdea(idea)
  const closeModal = () => setSelectedIdea(null)

  // Handle vote
  const handleVote = async (id) => {
    try {
      const user = getUser()
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${API}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ideaId: id, userId: user?.id || 1 })
      })
      
      if (!res.ok) throw new Error('Vote failed')
      
      setIdeas(ideas.map(i => 
        i.id === id ? { ...i, votes: [...(i.votes || []), {}] } : i
      ))
      if (selectedIdea?.id === id) {
        setSelectedIdea({ ...selectedIdea, votes: [...(selectedIdea.votes || []), {}] })
      }
      
    } catch {
      alert('Failed to vote')
    }
  }

  // Handle feedback
  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: comment,
          idea: id,
          lecturer: user?.id || 1
        })
      })
      
      if (!res.ok) throw new Error('Feedback failed')
      
      const data = await res.json()
      
      setIdeas(ideas.map(i => 
        i.id === id ? { ...i, feedbacks: [...(i.feedbacks || []), data] } : i
      ))
      if (selectedIdea?.id === id) {
        setSelectedIdea({ ...selectedIdea, feedbacks: [...(selectedIdea.feedbacks || []), data] })
      }
      
      if (callback) callback()
      
    } catch {
      alert('Failed to submit feedback')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading dashboard...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h5 className="text-danger mt-3">{error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="lecturer-dashboard">
      
      {/* Header */}
      <header className="lecturer-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Lecturer Portal</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-user">
              <div className="user-avatar">
                {lecturer.name ? lecturer.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div className="user-info">
                <span className="user-name">{lecturer.name || 'Lecturer'}</span>
                <span className="user-role">Lecturer</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="lecturer-content">
        <div className="content-container">
          
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>👋 Welcome, {lecturer.name || 'Lecturer'}!</h1>
              <p>Review student ideas and provide feedback.</p>
            </div>
            <div className="welcome-badge">
              {lecturer.email && <span>📧 {lecturer.email}</span>}
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Ideas</p>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.reviewed}</h3>
                <p>Reviewed</p>
              </div>
            </div>
          </div>

          {/* Ideas Table */}
          <div className="recent-ideas">
            <div className="section-header">
              <h3>📝 Student Ideas for Review</h3>
            </div>
            <div className="table-responsive">
              <table className="ideas-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No ideas submitted yet</td>
                    </tr>
                  ) : (
                    ideas.map((idea, index) => (
                      <tr key={idea.id}>
                        <td>{index + 1}</td>
                        <td>{idea.title}</td>
                        <td>{idea.user?.firstName || 'Unknown'}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className={`status-badge ${idea.status === 'PENDING' ? 'status-pending' : 'status-reviewed'}`}>
                            {idea.status || 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-review-idea"
                            onClick={() => openModal(idea)}
                          >
                            <i className="fas fa-check-circle" /> Review
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

      {/* Sidebar */}
      <aside className="lecturer-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link active">
              <i className="fas fa-tachometer-alt" /> Dashboard
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
              <i className="fas fa-trophy" /> Leaderboard
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link">
              <i className="fas fa-user" /> Profile
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Modal */}
      <IdeaModal
        idea={selectedIdea}
        onClose={closeModal}
        onVote={handleVote}
        onFeedback={handleFeedback}
      />
    </div>
  )
}

export default LecturerDashboardPage