import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'
import LecturerNavigation from '../components/LecturerNavigation'
import './LecturerLeaderboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const LecturerLeaderboardPage = () => {
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
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const data = res.data || []
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
      const sorted = [...(refreshRes.data || [])].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)

      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
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
      const sorted = [...(refreshRes.data || [])].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)

      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }

      if (callback) callback()
    } catch {
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
      const sorted = [...(refreshRes.data || [])].sort((a, b) => (b.voteIds?.length || 0) - (a.voteIds?.length || 0))
      setIdeas(sorted)

      if (selectedIdea && selectedIdea.id === id) {
        const updatedIdea = refreshRes.data.find(i => i.id === id)
        setSelectedIdea(updatedIdea)
      }

      alert(`Idea ${newStatus} successfully!`)
      return true
    } catch {
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

  const getRankBadge = (index) => `#${index + 1}`

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
        <h5 className="text-danger mt-3">{error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="lecturer-leaderboard-page">
      <LecturerNavigation
        pageTitle="Innovation Leaderboard"
        pageSubtitle="Top-voted student ideas across the university"
      />

      <div className="lecturer-leaderboard-content">
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <h1>Top Student Ideas</h1>
            <p>Ranked by student community votes</p>
          </div>

          <div className="leaderboard-card">
            {ideas.length === 0 ? (
              <div className="empty-state">
                <h5>No Ideas Yet</h5>
                <p>Ideas will appear here once students start voting.</p>
                <button className="btn-back-dash" onClick={goBack}>
                  Back to Dashboard
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
                          <span className="badge-votes">{idea.voteIds?.length || 0} votes</span>
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
