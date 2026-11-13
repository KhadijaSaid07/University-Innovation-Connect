import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const DashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({ total: 0, votes: 0, comments: 0, approved: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const statusParam = params.get('status')
    if (statusParam) {
      setStatusFilter(statusParam.toUpperCase())
    } else {
      setStatusFilter('ALL')
    }
  }, [location.search])

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        const data = res.data || []
        setIdeas(data)

        const votes = data.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        const comments = data.reduce((sum, i) => sum + (i.commentIds?.length || 0), 0)
        const approved = data.filter(i => i.status === 'APPROVED' || i.status === 'IMPLEMENTED').length
        setStats({ total: data.length, votes, comments, approved })
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Could not load ideas')
      } finally {
        setLoading(false)
      }
    }
    fetchIdeas()
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
        const refreshRes = await axios.get(`${API}/idea`)
        const updatedData = refreshRes.data || []
        setIdeas(updatedData)

        const newVotes = updatedData.reduce((sum, i) => sum + (i.voteIds?.length || 0), 0)
        setStats(prev => ({ ...prev, votes: newVotes }))

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }

        alert('Vote added successfully!')
      }
    } catch (error) {
      console.error('Vote error:', error)
      if (error.response?.status === 400 || error.response?.status === 409) {
        alert(error.response?.data?.message || 'You cannot vote for this idea')
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

      if (res.data) {
        const refreshRes = await axios.get(`${API}/idea`)
        const updatedData = refreshRes.data || []
        setIdeas(updatedData)

        if (selectedIdea && selectedIdea.id === id) {
          const updatedIdea = updatedData.find(i => i.id === id)
          setSelectedIdea(updatedIdea)
        }

        if (callback) callback()
        alert('Feedback submitted successfully!')
      }
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

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

  const isAuthor = (idea) => {
    const user = getUser()
    if (!user) return false
    return idea.userId === user.id
  }

  const filteredIdeas = ideas.filter(idea => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'APPROVED'
        ? idea.status === 'APPROVED' || idea.status === 'IMPLEMENTED'
        : idea.status === statusFilter)
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      idea.title?.toLowerCase().includes(q) ||
      idea.category?.toLowerCase().includes(q) ||
      getAuthorName(idea).toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="uic-page-loading">
        <div className="spinner-border text-primary" />
        <p>Loading innovation proposals...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="uic-page-loading">
        <h5 className="text-danger mb-3">{error}</h5>
        <button className="uic-btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="uic-content-shell">
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm h-100" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <div className="card-body">
              <div className="text-xs font-weight-bold text-muted text-uppercase mb-1">Total Ideas</div>
              <div className="h4 font-weight-bold mb-0" style={{ color: '#111827' }}>{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm h-100" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <div className="card-body">
              <div className="text-xs font-weight-bold text-muted text-uppercase mb-1">Approved Ideas</div>
              <div className="h4 font-weight-bold mb-0" style={{ color: '#059669' }}>{stats.approved}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm h-100" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <div className="card-body">
              <div className="text-xs font-weight-bold text-muted text-uppercase mb-1">Total Votes</div>
              <div className="h4 font-weight-bold mb-0" style={{ color: '#4F46E5' }}>{stats.votes}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm h-100" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <div className="card-body">
              <div className="text-xs font-weight-bold text-muted text-uppercase mb-1">Total Comments</div>
              <div className="h4 font-weight-bold mb-0" style={{ color: '#2563EB' }}>{stats.comments}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
        <div className="card-body py-3 d-flex flex-wrap justify-content-between align-items-center" style={{ gap: '12px' }}>
          <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
            {[
              { key: 'ALL', label: 'All Ideas' },
              { key: 'PENDING', label: 'Pending' },
              { key: 'UNDER_REVIEW', label: 'Under Review' },
              { key: 'APPROVED', label: 'Approved' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className="btn btn-sm"
                style={{
                  borderRadius: '6px',
                  fontWeight: 600,
                  background: statusFilter === tab.key ? '#4F46E5' : '#F3F4F6',
                  color: statusFilter === tab.key ? '#FFFFFF' : '#374151',
                  border: 'none',
                  padding: '6px 14px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '240px', flex: '0 1 300px' }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title, category, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px', height: '36px' }}
            />
          </div>
        </div>
      </div>

      {/* Ideas Table */}
      <div className="card shadow-sm" style={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold" style={{ color: '#111827' }}>
            {statusFilter === 'ALL' ? 'Student Innovation Proposals' : `${statusFilter.replace('_', ' ')} Proposals`} ({filteredIdeas.length})
          </h6>
        </div>
        <div className="card-body">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-gray-800 mt-2">No matching ideas found</h5>
              <p className="text-muted">Try adjusting your filters or submit a new proposal.</p>
              <button onClick={goToPost} className="btn btn-primary btn-sm mt-2">
                Submit New Idea
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="thead-light">
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
                  {filteredIdeas.map((idea, i) => (
                    <tr key={idea.id}>
                      <td>{i + 1}</td>
                      <td className="font-weight-bold">{idea.title}</td>
                      <td>
                        {getAuthorName(idea)}
                        {isAuthor(idea) && <span className="ml-1 text-muted small">(You)</span>}
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
                      <td>{idea.voteIds?.length || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(idea)}
                        >
                          <i className="fas fa-eye mr-1" /> View Details
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

export default DashboardPage
