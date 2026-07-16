import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'

const API = 'http://localhost:8081/api/v2/innovationConnect'

const MyIdeasPage = () => {
  const navigate = useNavigate()
  
  // State
  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({ total: 0, votes: 0, comments: 0 })
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

  // Fetch my ideas
  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const user = getUser()
        
        if (!user?.id) {
          setError('Please login first')
          setLoading(false)
          return
        }

        console.log('📤 Fetching ideas for user:', user.id)
        const res = await axios.get(`${API}/user/${user.id}/ideas`)
        const data = res.data
        console.log('✅ My ideas:', data)
        
        setIdeas(data)
        
        // Calculate stats using voteIds and commentIds
        const votes = data.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const comments = data.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
        setStats({ total: data.length, votes, comments })

      } catch (err) {
        console.error('Fetch error:', err)
        setError('Could not load your ideas')
      } finally {
        setLoading(false)
      }
    }
    fetchMyIdeas()
  }, [])

  // Navigate
  const goToPost = () => navigate('/post-idea')
  const goBack = () => navigate('/dashboard')

  // Modal functions
  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  // Delete idea
  const deleteIdea = async (id, title) => {
    if (!window.confirm(`🗑️ Delete "${title}"?`)) return
    
    try {
      await axios.delete(`${API}/idea/${id}`)
      
      const updated = ideas.filter(i => i.id !== id)
      setIdeas(updated)
      
      // Update stats using voteIds and commentIds
      const votes = updated.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
      const comments = updated.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
      setStats({ total: updated.length, votes, comments })
      
      alert('✅ Idea deleted successfully!')

    } catch (err) {
      console.error('Delete error:', err)
      alert('❌ Failed to delete idea')
    }
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
        // Refresh ideas to get updated vote counts
        const refreshRes = await axios.get(`${API}/user/${user.id}/ideas`)
        const updatedData = refreshRes.data
        setIdeas(updatedData)
        
        // Update stats using voteIds
        const newVotes = updatedData.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        setStats(prev => ({ ...prev, votes: newVotes }))
        
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
        
        alert('✅ Vote added successfully!')
      }
      
    } catch (error) {
      console.error('Vote error:', error)
      if (error.response?.status === 400) {
        alert('You have already voted for this idea')
      } else {
        alert('Failed to vote. Please try again.')
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
        // Refresh ideas
        const refreshRes = await axios.get(`${API}/user/${user.id}/ideas`)
        const updatedData = refreshRes.data
        setIdeas(updatedData)
        
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
        
        if (callback) callback()
        alert('✅ Feedback submitted successfully!')
      }
      
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  // Get author name
  const getAuthorName = (idea) => {
    if (idea.userName) {
      return idea.userName
    }
    if (idea.user) {
      const firstName = idea.user.firstName || ''
      const lastName = idea.user.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      if (fullName) return fullName
    }
    return 'Student'
  }

  // Check if current user is the author
  const isAuthor = (idea) => {
    const user = getUser()
    if (!user) return false
    return idea.userId === user.id
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
          <button onClick={goBack} className="btn btn-secondary btn-sm me-2">
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
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Votes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, i) => (
                    <tr key={idea.id}>
                      <td>{i + 1}</td>
                      <td>{idea.title}</td>
                      <td>
                        {getAuthorName(idea)}
                        {isAuthor(idea) && <span className="ml-1 text-muted">(You)</span>}
                      </td>
                      <td>{idea.category}</td>
                      <td>
                        <span className={`badge ${idea.status === 'PENDING' ? 'badge-warning' : 
                          idea.status === 'UNDER_REVIEW' ? 'badge-primary' :
                          idea.status === 'APPROVED' ? 'badge-success' : 
                          idea.status === 'REJECTED' ? 'badge-danger' : 
                          idea.status === 'IMPLEMENTED' ? 'badge-dark' : 'badge-secondary'}`}>
                          {idea.status || 'PENDING'}
                        </span>
                      </td>
                      <td>⭐ {idea.voteIds?.length || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye" /> View
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteIdea(idea.id, idea.title)}
                        >
                          <i className="fas fa-trash" /> Delete
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
      {showModal && selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          onClose={closeModal}
          onVote={handleVote}
          onFeedback={handleFeedback}
          currentUser={getUser()}
        />
      )}
    </div>
  )
}

export default MyIdeasPage