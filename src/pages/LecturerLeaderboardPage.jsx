import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IdeaModal from '../components/IdeaModal'
import './LecturerLeaderboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LecturerLeaderboardPage = () => {
  const navigate = useNavigate()
  
  // State
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

  // Fetch ideas from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/idea`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        
        // Sort by votes count (descending)
        const sorted = [...data].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))
        setIdeas(sorted)
        
      } catch {
        setError('Could not load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Go back
  const goBack = () => navigate('/lecturer-dashboard')

  // Logout
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

  // Get rank badge
  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  // Get rank class
  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  // Loading state
  if (loading) {
    return (
      <div className="lecturer-leaderboard-loading">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading leaderboard...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="lecturer-leaderboard-loading">
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h5 className="text-danger mt-3">{error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="lecturer-leaderboard-page">
      
      {/* Header */}
      <header className="lecturer-leaderboard-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Leaderboard</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="lecturer-leaderboard-content">
        <div className="leaderboard-container">
          
          <div className="leaderboard-header">
            <h1>🏆 Top Student Ideas</h1>
            <p>Ideas with the most votes from students</p>
          </div>

          <div className="leaderboard-card">
            {ideas.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '4rem' }}>🏆</div>
                <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
                <p className="text-muted">Ideas will appear here once students start voting.</p>
                <button className="btn-back-dash" onClick={goBack}>
                  ← Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Title</th>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Votes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map((idea, index) => (
                      <tr key={idea.id} className={getRankClass(index)}>
                        <td>
                          <span className="rank-badge">{getRankBadge(index)}</span>
                        </td>
                        <td>{idea.title}</td>
                        <td>{idea.user?.firstName || 'Unknown'}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className="badge-votes">⭐ {idea.votes?.length || 0}</span>
                        </td>
                        <td>
                          <button 
                            className="btn-view-idea"
                            onClick={() => openModal(idea)}
                          >
                            <i className="fas fa-eye" /> Review
                          </button>
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

      {/* Sidebar */}
      <aside className="lecturer-leaderboard-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt" /> Dashboard
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link active">
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

export default LecturerLeaderboardPage