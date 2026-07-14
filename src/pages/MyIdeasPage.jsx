import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import IdeaModal from '../components/IdeaModal'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const MyIdeasPage = () => {
  const navigate = useNavigate()
  
  // State
  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({ total: 0, votes: 0, comments: 0 })
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

  // Fetch my ideas from backend
  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const user = getUser()
        const token = localStorage.getItem('token')
        
        // Fetch all ideas and filter by user
        const res = await fetch(`${API}/idea`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        
        // Filter ideas by current user
        const myIdeas = data.filter(idea => idea.user?.id === user?.id)
        setIdeas(myIdeas)
        
        // Calculate stats
        const votes = myIdeas.reduce((sum, i) => sum + (i.votes?.length || 0), 0)
        const comments = myIdeas.reduce((sum, i) => sum + (i.comments?.length || 0), 0)
        setStats({ total: myIdeas.length, votes, comments })
        
      } catch {
        setError('Could not load your ideas')
      } finally {
        setLoading(false)
      }
    }
    fetchMyIdeas()
  }, [])

  // Navigate to post idea
  const goToPost = () => navigate('/post-idea')

  // Go back to dashboard
  const goBack = () => navigate('/dashboard')

  // Delete idea
  const deleteIdea = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/idea/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Delete failed')
      
      // Update local state
      const updated = ideas.filter(i => i.id !== id)
      setIdeas(updated)
      
      const votes = updated.reduce((sum, i) => sum + (i.votes?.length || 0), 0)
      const comments = updated.reduce((sum, i) => sum + (i.comments?.length || 0), 0)
      setStats({ total: updated.length, votes, comments })
      
    } catch {
      alert('Failed to delete idea')
    }
  }

  // Open modal
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

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading your ideas...</p>
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
        <h1 className="h3 mb-0">📁 My Ideas</h1>
        <div>
          <button onClick={goBack} className="btn btn-secondary btn-sm mr-2">
            ← Back
          </button>
          <button onClick={goToPost} className="btn btn-primary btn-sm">
            <i className="fas fa-plus" /> New Idea
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card border-left-primary shadow h-100">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase">💡 My Ideas</div>
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
          <h6 className="m-0 font-weight-bold text-primary">📝 Ideas You've Posted</h6>
        </div>
        <div className="card-body">
          {ideas.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>📭</div>
              <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
              <button onClick={goToPost} className="btn btn-primary mt-2">
                Post Your First Idea
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Votes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, i) => (
                    <tr key={idea.id}>
                      <td>{i + 1}</td>
                      <td>{idea.title}</td>
                      <td>{idea.category}</td>
                      <td>⭐ {idea.votes?.length || 0}</td>
                      <td>{idea.createdDate || 'Just now'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary mr-1"
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye" /> View
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteIdea(idea.id, idea.title)}
                        >
                          Delete
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

export default MyIdeasPage