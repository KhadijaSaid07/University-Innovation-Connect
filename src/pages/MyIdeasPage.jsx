import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const allCategories = [
  'AGRICULTURE', 'EDUCATION', 'HEALTH', 'TECHNOLOGY',
  'ENVIRONMENT', 'BUSINESS', 'FINANCE', 'SECURITY',
  'TRANSPORTATION', 'WATER_AND_HYGIENE', 'TOURISM',
  'BLUE_ECONOMY', 'RENEWABLE_ENERGY', 'FINTECH', 'OTHERS'
]

const MyIdeasPage = () => {
  const navigate = useNavigate()

  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({ total: 0, votes: 0, comments: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', category: '', description: '' })
  const [savingEdit, setSavingEdit] = useState(false)

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const user = getUser()

        if (!user?.id) {
          setError('Please sign in to view your ideas.')
          setLoading(false)
          return
        }

        const res = await axios.get(`${API}/user/${user.id}/ideas`)
        const data = res.data || []

        setIdeas(data)

        const votes = data.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const comments = data.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
        setStats({ total: data.length, votes, comments })
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Could not load your submitted ideas.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyIdeas()
  }, [])

  const goToPost = () => navigate('/post-idea')

  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  const openEditModal = (idea) => {
    setEditingIdea(idea)
    setEditForm({
      title: idea.title || '',
      category: idea.category || 'TECHNOLOGY',
      description: idea.description || ''
    })
  }

  const closeEditModal = () => {
    setEditingIdea(null)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingIdea) return

    setSavingEdit(true)
    try {
      const res = await axios.put(`${API}/idea/${editingIdea.id}`, {
        title: editForm.title.trim(),
        category: editForm.category,
        description: editForm.description.trim()
      })

      if (res.data) {
        const updated = ideas.map(i => i.id === editingIdea.id ? res.data : i)
        setIdeas(updated)
        setEditingIdea(null)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update idea')
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteIdea = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return

    try {
      await axios.delete(`${API}/idea/${id}`)

      const updated = ideas.filter(i => i.id !== id)
      setIdeas(updated)

      const votes = updated.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
      const comments = updated.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
      setStats({ total: updated.length, votes, comments })
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete idea')
    }
  }

  const handleVote = async (id) => {
    try {
      const user = getUser()

      if (!user) {
        alert('Please sign in to vote')
        return
      }

      if (user?.role !== 'STUDENT') {
        alert('Only students can vote')
        return
      }

      const res = await axios.post(`${API}/vote`, {
        ideaId: id,
        userId: user?.id
      })

      if (res.data) {
        const refreshRes = await axios.get(`${API}/user/${user.id}/ideas`)
        const updatedData = refreshRes.data
        setIdeas(updatedData)

        const newVotes = updatedData.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        setStats(prev => ({ ...prev, votes: newVotes }))

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }
      }
    } catch (error) {
      console.error('Vote error:', error)
      alert(error.response?.data?.message || 'Failed to vote. Please try again.')
    }
  }

  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()

      if (!user || (user?.role !== 'LECTURER' && user?.role !== 'ADMIN')) {
        alert('Only lecturers can submit academic feedback')
        return
      }

      const res = await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })

      if (res.data) {
        const refreshRes = await axios.get(`${API}/user/${user.id}/ideas`)
        const updatedData = refreshRes.data
        setIdeas(updatedData)

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }

        if (callback) callback()
      }
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const canEditIdea = (idea) => {
    return idea.status === 'PENDING' || idea.status === 'UNDER_REVIEW'
  }

  const formatCategory = (cat) => {
    if (!cat) return 'General'
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="uic-page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading your submitted ideas...</p>
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
      {/* Summary Metrics */}
      <div className="uic-stats-row">
        <div className="uic-stat-card">
          <div className="uic-stat-icon indigo">
            <i className="fas fa-folder-open" />
          </div>
          <div>
            <div className="uic-stat-label">Submitted Ideas</div>
            <div className="uic-stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="uic-stat-card">
          <div className="uic-stat-icon emerald">
            <i className="fas fa-thumbs-up" />
          </div>
          <div>
            <div className="uic-stat-label">Total Votes Received</div>
            <div className="uic-stat-value">{stats.votes}</div>
          </div>
        </div>

        <div className="uic-stat-card">
          <div className="uic-stat-icon sky">
            <i className="fas fa-comments" />
          </div>
          <div>
            <div className="uic-stat-label">Community Comments</div>
            <div className="uic-stat-value">{stats.comments}</div>
          </div>
        </div>
      </div>

      {/* Ideas Table Card */}
      <div className="uic-surface-card">
        <div className="uic-surface-header">
          <div>
            <h3 className="uic-surface-title">Your Innovation Submissions</h3>
            <p className="uic-surface-subtitle">
              Track evaluation status, edit pending proposals, or inspect faculty feedback
            </p>
          </div>
          <button onClick={goToPost} className="uic-btn-primary">
            <i className="fas fa-plus" />
            <span>Submit New Idea</span>
          </button>
        </div>

        <div className="uic-surface-body">
          {ideas.length === 0 ? (
            <div className="uic-empty-state">
              <div className="uic-empty-icon">
                <i className="fas fa-lightbulb" />
              </div>
              <h4>No ideas submitted yet</h4>
              <p>Share your first innovation proposal with students and faculty.</p>
              <button onClick={goToPost} className="uic-btn-primary mt-2">
                <i className="fas fa-plus" />
                <span>Post Your First Idea</span>
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="uic-clean-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Proposal Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Votes</th>
                    <th>Comments</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, i) => (
                    <tr key={idea.id}>
                      <td className="text-muted fw-semibold">{i + 1}</td>
                      <td>
                        <div className="fw-semibold text-dark">{idea.title}</div>
                        {idea.description && (
                          <div className="text-muted small text-truncate" style={{ maxWidth: '340px' }}>
                            {idea.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="uic-tag-pill">{formatCategory(idea.category)}</span>
                      </td>
                      <td>
                        <span className={`uic-status-pill ${(idea.status || 'PENDING').toLowerCase()}`}>
                          {(idea.status || 'PENDING').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="fw-semibold">{idea.voteIds?.length || 0}</td>
                      <td>{idea.commentIds?.length || 0}</td>
                      <td>
                        <div className="uic-table-actions">
                          <button
                            className="uic-action-btn view"
                            onClick={() => openModal(idea)}
                            title="View Details"
                          >
                            <i className="fas fa-eye" />
                            <span>View</span>
                          </button>
                          {canEditIdea(idea) && (
                            <button
                              className="uic-action-btn edit"
                              onClick={() => openEditModal(idea)}
                              title="Edit Proposal"
                            >
                              <i className="fas fa-pen" />
                              <span>Edit</span>
                            </button>
                          )}
                          <button
                            className="uic-action-btn delete"
                            onClick={() => deleteIdea(idea.id, idea.title)}
                            title="Delete Proposal"
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Idea Modal */}
      {editingIdea && (
        <div
          className="idea-modal-overlay"
          onClick={closeEditModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px'
          }}
        >
          <div
            className="uic-form-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '580px', padding: '28px' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="m-0 fw-bold text-dark">Edit Proposal</h5>
              <button className="btn btn-sm btn-light" onClick={closeEditModal}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="uic-proposal-form">
              <div className="uic-field-group">
                <label className="uic-field-label">Title</label>
                <input
                  type="text"
                  className="uic-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="uic-field-group">
                <label className="uic-field-label">Category</label>
                <select
                  className="uic-select"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  required
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{formatCategory(cat)}</option>
                  ))}
                </select>
              </div>

              <div className="uic-field-group">
                <label className="uic-field-label">Description</label>
                <textarea
                  rows="4"
                  maxLength={250}
                  className="uic-textarea"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="uic-form-actions mt-3">
                <button type="button" className="uic-btn-ghost" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="uic-btn-primary" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
