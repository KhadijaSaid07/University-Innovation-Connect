import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import IdeaModal from '../components/IdeaModal'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const DashboardPage = () => {
  const navigate = useNavigate()
  
  // State
  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({ total: 0, votes: 0, comments: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)

  // Fetch ideas from backend
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/idea`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setIdeas(data)
        
        // Calculate stats
        const votes = data.reduce((sum, i) => sum + (i.votes?.length || 0), 0)
        const comments = data.reduce((sum, i) => sum + (i.comments?.length || 0), 0)
        setStats({ total: data.length, votes, comments })
        
      } catch {
        setError('Could not load ideas')
      } finally {
        setLoading(false)
      }
    }
    fetchIdeas()
  }, [])

  // Navigate to post idea page
  const goToPost = () => navigate('/post-idea')

  // Open modal for idea details
  const openModal = (idea) => setSelectedIdea(idea)

  // Close modal
  const closeModal = () => setSelectedIdea(null)

  // Handle vote on idea
  const handleVote = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ideaId: id, userId: 1 })
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

  // Handle feedback submission
  const handleFeedback = async (id, comment, callback) => {
    try {
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
          lecturer: 1
        })
      })
      
      if (!res.ok) throw new Error('Feedback failed')
      
      const data = await res.json()
      
      // Update local state
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

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading ideas...</p>
      </div>
    )
  }

  // Show error message
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

  // Main render
  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">🌊 Innovation Dashboard</h1>
        <button onClick={goToPost} className="btn btn-primary btn-sm">
          <i className="fas fa-plus" /> Post Idea
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card border-left-primary shadow h-100">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase">💡 Total Ideas</div>
              <div className="h5 font-weight-bold">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-left-success shadow h-100">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-success text-uppercase">⭐ Total Votes</div>
              <div className="h5 font-weight-bold">{stats.votes}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-left-info shadow h-100">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-info text-uppercase">💬 Total Comments</div>
              <div className="h5 font-weight-bold">{stats.comments}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Table */}
      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">📝 Recent Ideas</h6>
        </div>
        <div className="card-body">
          {ideas.length === 0 ? (
            // Empty state
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>💡</div>
              <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
              <button onClick={goToPost} className="btn btn-primary mt-2">
                Post Your First Idea
              </button>
            </div>
          ) : (
            // Ideas table
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Votes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, i) => (
                    <tr key={idea.id}>
                      <td>{i + 1}</td>
                      <td>{idea.title}</td>
                      <td>{idea.user?.firstName || 'Unknown'}</td>
                      <td>{idea.category}</td>
                      <td>⭐ {idea.votes?.length || 0}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal(idea)}>
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

      
      <IdeaModal
        idea={selectedIdea}
        onClose={closeModal}
        onVote={handleVote}
        onFeedback={handleFeedback}
      />
    </>
  )
}

export default DashboardPage