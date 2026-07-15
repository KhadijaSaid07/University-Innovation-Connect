import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
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
  const [showModal, setShowModal] = useState(false)

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
        const res = await axios.get(`${API}/idea`)
        const data = res.data
        
        // Sort by vote count (descending) - using voteIds from DTO
        const sorted = [...data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
        setIdeas(sorted)
        
      } catch (err) {
        console.error('Fetch error:', err)
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
  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }
  
  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  // Handle vote
  const handleVote = async (id) => {
    try {
      const user = getUser()
      
      if (!user) {
        alert('Please login to vote')
        return
      }
      
      if (user?.role !== 'STUDENT') {
        alert('Only students can vote!')
        return
      }
      
      const res = await axios.post(`${API}/vote`, {
        ideaId: id,
        userId: user?.id
      })
      
      if (res.data) {
        const refreshRes = await axios.get(`${API}/idea`)
        const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
        setIdeas(sorted)
        
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = refreshRes.data.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
      }
      
    } catch (error) {
      console.error('Vote error:', error)
      if (error.response?.status === 400) {
        alert('You have already voted for this idea')
      } else {
        alert('Failed to vote')
      }
    }
  }

  // Handle feedback
  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()
      
      if (!user) {
        alert('Please login to give feedback')
        return
      }
      
      if (user?.role !== 'LECTURER' && user?.role !== 'ADMIN') {
        alert('Only lecturers can give feedback!')
        return
      }
      
      const res = await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })
      
      if (res.data) {
        const refreshRes = await axios.get(`${API}/idea`)
        const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
        setIdeas(sorted)
        
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = refreshRes.data.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
        
        if (callback) callback()
      }
      
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback')
    }
  }

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const user = getUser()
      
      if (!user) {
        alert('Please login')
        return
      }
      
      if (user?.role !== 'LECTURER' && user?.role !== 'ADMIN') {
        alert('Only lecturers can update status!')
        return
      }
      
      const res = await axios.put(`${API}/idea/${id}/status?status=${newStatus}`)
      
      if (res.data) {
        const refreshRes = await axios.get(`${API}/idea`)
        const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
        setIdeas(sorted)
        
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = refreshRes.data.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
        
        alert(`Idea ${newStatus} successfully!`)
        return true
      }
      return false
    } catch (error) {
      console.error('Status update error:', error)
      alert('Failed to update status')
      return false
    }
  }

  // Get student name
  const getStudentName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.user) {
      const firstName = idea.user.firstName || ''
      const lastName = idea.user.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      if (fullName) return fullName
    }
    return 'Unknown'
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
                        <td>{getStudentName(idea)}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className="badge-votes">⭐ {idea.voteIds?.length || 0}</span>
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

      {/* Modal */}
      {showModal && selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          onClose={closeModal}
          onVote={handleVote}
          onFeedback={handleFeedback}
          onStatusUpdate={handleStatusUpdate}
          currentUser={getUser()}
        />
      )}
    </div>
  )
}

export default LecturerLeaderboardPage