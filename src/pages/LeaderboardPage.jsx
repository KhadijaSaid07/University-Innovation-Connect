import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const LeaderboardPage = () => {
  const navigate = useNavigate()

  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [notice, setNotice] = useState({ text: '', type: 'success' })

  const showMessage = (text, type = 'success') => {
    setNotice({ text, type })
    setTimeout(() => setNotice({ text: '', type: 'success' }), 4000)
  }

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
        const ideasData = ideasRes.data || []

        const ideasWithCounts = ideasData.map((idea) => ({
          ...idea,
          voteCount: idea.voteIds?.length || 0,
          commentCount: idea.commentIds?.length || 0
        }))

        const sorted = [...ideasWithCounts].sort((a, b) => b.voteCount - a.voteCount)
        setIdeas(sorted)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Could not load the innovation leaderboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

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
        const msg = 'Please sign in to vote'
        showMessage(msg, 'error')
        return { ok: false, message: msg }
      }

      if (user?.role !== 'STUDENT') {
        const msg = 'Only students can vote'
        showMessage(msg, 'error')
        return { ok: false, message: msg }
      }

      const res = await axios.post(`${API}/vote`, {
        ideaId: id,
        userId: user?.id
      })

      if (res.data) {
        const ideasRes = await axios.get(`${API}/idea`)
        const ideasData = ideasRes.data || []

        const ideasWithCounts = ideasData.map((idea) => ({
          ...idea,
          voteCount: idea.voteIds?.length || 0,
          commentCount: idea.commentIds?.length || 0
        }))

        const sorted = [...ideasWithCounts].sort((a, b) => b.voteCount - a.voteCount)
        setIdeas(sorted)

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = sorted.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
        showMessage('You voted for idea successfully', 'success')
        return { ok: true }
      }
      return { ok: false, message: 'Failed to vote' }
    } catch (error) {
      console.error('Vote error:', error)
      if (error.response?.status === 400 || error.response?.status === 409) {
        const msg = error.response?.data?.message || 'You already voted for this idea'
        showMessage(msg, 'error')
        return { ok: false, message: msg }
      } else {
        const msg = 'Failed to vote. Please try again.'
        showMessage(msg, 'error')
        return { ok: false, message: msg }
      }
    }
  }

  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()

      if (!user || (user?.role !== 'LECTURER' && user?.role !== 'ADMIN')) {
        showMessage('Only lecturers can submit academic feedback', 'error')
        return
      }

      const res = await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })

      if (res.data) {
        const ideasRes = await axios.get(`${API}/idea`)
        const ideasData = ideasRes.data || []

        const ideasWithCounts = ideasData.map((idea) => ({
          ...idea,
          voteCount: idea.voteIds?.length || 0,
          commentCount: idea.commentIds?.length || 0
        }))

        const sorted = [...ideasWithCounts].sort((a, b) => b.voteCount - a.voteCount)
        setIdeas(sorted)

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = sorted.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }

        if (callback) callback()
        showMessage('You submitted feedback successfully', 'success')
      }
    } catch (error) {
      console.error('Feedback error:', error)
      showMessage('Failed to submit feedback. Please try again.', 'error')
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

  const formatCategory = (cat) => {
    if (!cat) return 'General'
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="uic-page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading innovation rankings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="uic-page-loading">
        <h5 className="text-danger mb-3">{error}</h5>
        <button className="uic-btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="uic-content-shell">
      {notice.text && (
        <div className={`uic-alert ${notice.type === 'success' ? 'uic-alert-success' : 'uic-alert-error'}`}>
          <i className={`fas ${notice.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          <span>{notice.text}</span>
        </div>
      )}

      <div className="uic-surface-card">
        <div className="uic-surface-header">
          <div>
            <h3 className="uic-surface-title">Top Ideas Ranked by Community Votes</h3>
            <p className="uic-surface-subtitle">
              Discover the most supported student innovation proposals across the university
            </p>
          </div>
          <button onClick={() => navigate('/post-idea')} className="uic-btn-primary">
            <i className="fas fa-plus" />
            <span>Submit Idea</span>
          </button>
        </div>

        <div className="uic-surface-body">
          {ideas.length === 0 ? (
            <div className="uic-empty-state">
              <div className="uic-empty-icon">
                <i className="fas fa-trophy" />
              </div>
              <h4>No Ranked Ideas Yet</h4>
              <p>Ideas will appear here as students submit and vote on proposals.</p>
              <button className="uic-btn-primary mt-2" onClick={() => navigate('/post-idea')}>
                Submit First Idea
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="uic-clean-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Proposal Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Votes</th>
                    <th>Comments</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, index) => (
                    <tr key={idea.id}>
                      <td>
                        <span className={`uic-rank-pill rank-${index + 1}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{idea.title}</div>
                      </td>
                      <td>{getAuthorName(idea)}</td>
                      <td>
                        <span className="uic-tag-pill">{formatCategory(idea.category)}</span>
                      </td>
                      <td>
                        <span className={`uic-status-pill ${(idea.status || 'PENDING').toLowerCase()}`}>
                          {(idea.status || 'PENDING').replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark">
                          <i className="fas fa-thumbs-up text-primary me-1" />
                          {idea.voteCount || 0}
                        </span>
                      </td>
                      <td>{idea.commentCount || 0}</td>
                      <td className="text-end">
                        <button
                          className="uic-action-btn view"
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye" />
                          <span>Inspect</span>
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
