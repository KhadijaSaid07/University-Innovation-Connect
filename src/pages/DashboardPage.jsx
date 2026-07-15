import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const data = res.data
        setIdeas(data)
        
        // Calculate stats - FIXED: use voteIds and commentIds
        const votes = data.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const comments = data.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
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
  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  // Handle vote on idea
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
        const refreshRes = await axios.get(`${API}/idea`)
        const updatedData = refreshRes.data
        setIdeas(updatedData)
        
        // Update stats - FIXED: use voteIds
        const newVotes = updatedData.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        setStats(prev => ({ ...prev, votes: newVotes }))
        
        // Update selected idea if modal is open
        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
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

  // Handle feedback submission
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
      
      const data = res.data
      
      // Refresh ideas to get updated feedback counts
      const refreshRes = await axios.get(`${API}/idea`)
      const updatedData = refreshRes.data
      setIdeas(updatedData)
      
      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = updatedData.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }
      
      if (callback) callback()
      
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
        <p className="mt-2 text-muted">Loading ideas...</p>
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

  // Render
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
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>💡</div>
              <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
              <p className="text-muted">Be the first to share an idea!</p>
              <button onClick={goToPost} className="btn btn-primary mt-2">
                🚀 Post Your First Idea
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
                    <th>Action</th>
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
                      {/* FIXED: use voteIds */}
                      <td>⭐ {idea.voteIds?.length || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye" /> View Details
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
    </>
  )
}

export default DashboardPage