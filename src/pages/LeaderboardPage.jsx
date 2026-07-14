import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import IdeaModal from '../components/IdeaModal'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LeaderboardPage = () => {
  const navigate = useNavigate()
  
  // State
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)

  // Fetch ideas from backend and sort by votes
  useEffect(() => {
    const fetchLeaderboard = async () => {
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
    fetchLeaderboard()
  }, [])

  // Get logged in user
  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  // Go back
  const goBack = () => navigate('/dashboard')

  // Open/close modal
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
      
      // Update local state
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

  // Get rank class for styling
  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading leaderboard...</p>
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
    <div className="container-fluid">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">🏆 Leaderboard</h1>
        <button onClick={goBack} className="btn btn-secondary btn-sm">
          ← Back
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">🏆 Top Ideas by Votes</h6>
        </div>
        <div className="card-body">
          {ideas.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>🏆</div>
              <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
              <p className="text-muted">Ideas will appear here once people start voting.</p>
              <button className="btn btn-primary mt-2" onClick={() => navigate('/post-idea')}>
                Post Your First Idea
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Votes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, index) => (
                    <tr key={idea.id} className={getRankClass(index)}>
                      <td>
                        <span style={{ fontSize: '1.5rem' }}>
                          {getRankBadge(index)}
                        </span>
                      </td>
                      <td>{idea.title}</td>
                      <td>{idea.user?.firstName || 'Unknown'}</td>
                      <td>{idea.category}</td>
                      <td>
                        <span className="badge badge-success">
                          ⭐ {idea.votes?.length || 0}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye" /> View
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

      {/* Idea Modal */}
      <IdeaModal
        idea={selectedIdea}
        onClose={closeModal}
        onVote={handleVote}
        onFeedback={handleFeedback}
      />
    </div>
  )
}

export default LeaderboardPage