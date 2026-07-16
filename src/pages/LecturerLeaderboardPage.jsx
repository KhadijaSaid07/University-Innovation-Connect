import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'
import './LecturerLeaderboardPage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'

const LecturerLeaderboardPage = () => {
  const navigate = useNavigate()
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const data = res.data
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

  const goBack = () => navigate('/lecturer-dashboard')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }
  
  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  const handleVote = async (id) => {
    try {
      const user = getUser()
      if (!user || user?.role !== 'STUDENT') {
        alert('Only students can vote!')
        return
      }
      
      await axios.post(`${API}/vote`, {
        ideaId: id,
        userId: user?.id
      })
      
      const refreshRes = await axios.get(`${API}/idea`)
      const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)
      
      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert('You have already voted for this idea')
      } else {
        alert('Failed to vote')
      }
    }
  }

  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()
      if (!user || (user?.role !== 'LECTURER' && user?.role !== 'ADMIN')) {
        alert('Only lecturers can give feedback!')
        return
      }
      
      await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })
      
      const refreshRes = await axios.get(`${API}/idea`)
      const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)
      
      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }
      
      if (callback) callback()
    } catch (error) {
      alert('Failed to submit feedback')
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const user = getUser()
      if (!user || (user?.role !== 'LECTURER' && user?.role !== 'ADMIN')) {
        alert('Only lecturers can update status!')
        return false
      }
      
      await axios.put(`${API}/idea/${id}/status?status=${newStatus}`)
      
      const refreshRes = await axios.get(`${API}/idea`)
      const sorted = [...refreshRes.data].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)
      
      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }
      
      alert(`Idea ${newStatus} successfully!`)
      return true
    } catch (error) {
      alert('Failed to update status')
      return false
    }
  }

  const getStudentName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.user) {
      const name = `${idea.user.firstName || ''} ${idea.user.lastName || ''}`.trim()
      return name || 'Unknown'
    }
    return 'Unknown'
  }

  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  if (loading) {
    return (
      <div className="lecturer-leaderboard-loading">
        <div className="spinner-border text-primary" />
        <p>Loading leaderboard...</p>
      </div>
    )
  }

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
      
      {sidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} />}

      <aside className={`lecturer-leaderboard-sidebar ${sidebarOpen ? 'show' : ''}`}>
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

      <header className="lecturer-leaderboard-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
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
                <h5>No Ideas Yet</h5>
                <p>Ideas will appear here once students start voting.</p>
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