import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LeaderboardPage = () => {
  const navigate = useNavigate()
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const ideasRes = await axios.get(`${API}/idea`)
        const ideasData = ideasRes.data
        
        const ideasWithDetails = await Promise.all(
          ideasData.map(async (idea) => {
            try {
              const votesRes = await axios.get(`${API}/vote/idea/${idea.id}`)
              const votes = votesRes.data || []
              
              const commentsRes = await axios.get(`${API}/comment/idea/${idea.id}`)
              let comments = commentsRes.data || []
              
              // ✅ Fetch user names for each comment
              const commentsWithUsers = await Promise.all(
                comments.map(async (comment) => {
                  if (comment.userId) {
                    try {
                      const userRes = await axios.get(`${API}/user/${comment.userId}`)
                      const user = userRes.data
                      return {
                        ...comment,
                        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student'
                      }
                    } catch {
                      return { ...comment, userName: 'Student' }
                    }
                  }
                  return { ...comment, userName: 'Student' }
                })
              )
              
              return {
                ...idea,
                votes: votes,
                comments: commentsWithUsers,
                voteCount: votes.length,
                commentCount: commentsWithUsers.length
              }
            } catch {
              return {
                ...idea,
                votes: [],
                comments: [],
                voteCount: 0,
                commentCount: 0
              }
            }
          })
        )
        
        const sorted = [...ideasWithDetails].sort((a, b) => b.voteCount - a.voteCount)
        setIdeas(sorted)
        
      } catch {
        setError('Could not load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const goBack = () => navigate('/dashboard')

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
        const updatedIdeas = ideas.map(i => {
          if (i.id === id) {
            return {
              ...i,
              votes: [...(i.votes || []), res.data],
              voteCount: (i.voteCount || 0) + 1
            }
          }
          return i
        })
        setIdeas(updatedIdeas)
        
        if (selectedIdea && selectedIdea.id === id) {
          setSelectedIdea({
            ...selectedIdea,
            votes: [...(selectedIdea.votes || []), res.data],
            voteCount: (selectedIdea.voteCount || 0) + 1
          })
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
      
      const updatedIdeas = ideas.map(i => 
        i.id === id ? { ...i, feedbacks: [...(i.feedbacks || []), data] } : i
      )
      setIdeas(updatedIdeas)
      
      if (selectedIdea && selectedIdea.id === id) {
        setSelectedIdea({ ...selectedIdea, feedbacks: [...(selectedIdea.feedbacks || []), data] })
      }
      
      if (callback) callback()
      
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const getAuthorName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.user) {
      const firstName = idea.user.firstName || ''
      const lastName = idea.user.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      if (fullName) return fullName
    }
    return 'Student'
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading leaderboard...</p>
      </div>
    )
  }

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
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">🏆 Leaderboard</h1>
        <button onClick={goBack} className="btn btn-secondary btn-sm">
          ← Back
        </button>
      </div>

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
                    <th>Comments</th>
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
                      <td>{getAuthorName(idea)}</td>
                      <td>{idea.category}</td>
                      <td>
                        <span className="badge badge-success">
                          ⭐ {idea.voteCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          💬 {idea.commentCount || 0}
                        </span>
                      </td>
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

export default LeaderboardPage