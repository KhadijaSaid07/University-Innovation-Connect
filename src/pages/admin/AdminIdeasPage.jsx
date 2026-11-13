import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import IdeaModal from '../../components/IdeaModal'
import './AdminDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const AdminIdeasPage = () => {
  const navigate = useNavigate()

  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [users, setUsers] = useState({})

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const user = getUser()
    if (!user || user.role?.toUpperCase() !== 'ADMIN') {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        const userMap = {}
        ;(res.data || []).forEach(u => {
          userMap[u.id] = {
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
            role: u.role
          }
        })
        setUsers(userMap)
      } catch (err) {
        console.error('Fetch users error:', err)
      }
    }
    fetchUsers()
  }, [])

  const fetchIdeas = async () => {
    try {
      const res = await axios.get(`${API}/idea`)
      setIdeas(res.data || [])
    } catch (err) {
      console.error('Fetch ideas error:', err)
      setMessage('Could not load ideas.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  const viewIdea = (idea) => {
    setSelectedIdea({
      ...idea,
      userName: getAuthorName(idea)
    })
    setShowViewModal(true)
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setSelectedIdea(null)
  }

  const handleFeedback = async (id, comment, callback) => {
    try {
      const user = getUser()
      await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })
      await fetchIdeas()
      if (callback) callback()
    } catch (err) {
      console.error('Feedback error:', err)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API}/idea/${id}/status?status=${newStatus}`)
      await fetchIdeas()
      return true
    } catch (err) {
      console.error('Status update error:', err)
      return false
    }
  }

  const deleteIdea = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"? This action cannot be undone.`)) return

    try {
      await axios.delete(`${API}/idea/${id}`)
      await fetchIdeas()
      setMessage(`You deleted idea "${title}" successfully`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3500)
    } catch (err) {
      console.error('Delete idea error:', err)
      setMessage(err.response?.data?.message || 'Failed to delete project.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 4000)
    }
  }

  const getAuthorName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.userId && users[idea.userId]) {
      return users[idea.userId].name
    }
    if (idea.user && idea.user.firstName) {
      return `${idea.user.firstName || ''} ${idea.user.lastName || ''}`.trim() || 'Unknown'
    }
    return 'Student'
  }

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'status-badge pending',
      UNDER_REVIEW: 'status-badge under_review',
      APPROVED: 'status-badge approved',
      REJECTED: 'status-badge rejected',
      IMPLEMENTED: 'status-badge implemented'
    }
    return colors[status] || 'status-badge pending'
  }

  const countByStatus = (st) => {
    if (st === 'ALL') return ideas.length
    return ideas.filter(i => i.status === st).length
  }

  const filteredIdeas = ideas.filter(idea => {
    const matchesStatus = statusFilter === 'ALL' || idea.status === statusFilter
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      idea.title?.toLowerCase().includes(q) ||
      idea.category?.toLowerCase().includes(q) ||
      idea.status?.toLowerCase().includes(q) ||
      getAuthorName(idea).toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar
          pageTitle="Ideas Management"
          pageSubtitle="Inspect submissions, review feedback, and moderate proposals"
        />
        <div className="admin-content">
          <div className="uic-page-loading">
            <div className="admin-spinner-large"></div>
            <p>Loading ideas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        pageTitle="Ideas Management"
        pageSubtitle="Inspect submissions, review lecturer and student feedback, and moderate proposals"
      />

      <div className="admin-content">
        <div className="content-container">
          <div className="page-header uic-responsive-header">
            <div className="page-header-left">
              <h1>Submitted Projects & Ideas</h1>
              <p>Inspect project details, separated lecturer & student feedback, or remove entries</p>
            </div>
            <div className="page-header-right">
              <span className="admin-count-badge">
                Showing {filteredIdeas.length} of {ideas.length}
              </span>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="uic-admin-toolbar">
            <div className="uic-role-tabs">
              {[
                { key: 'ALL', label: `All (${countByStatus('ALL')})` },
                { key: 'PENDING', label: `Pending (${countByStatus('PENDING')})` },
                { key: 'UNDER_REVIEW', label: `Under Review (${countByStatus('UNDER_REVIEW')})` },
                { key: 'APPROVED', label: `Approved (${countByStatus('APPROVED')})` },
                { key: 'REJECTED', label: `Rejected (${countByStatus('REJECTED')})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`uic-role-tab ${statusFilter === tab.key ? 'active' : ''}`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="uic-search-box">
              <i className="fas fa-search uic-search-icon" />
              <input
                type="text"
                className="uic-search-field"
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="uic-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Votes</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="admin-empty-text">
                        {ideas.length === 0 ? 'No projects submitted yet.' : 'No matching projects found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredIdeas.map((idea, index) => (
                      <tr key={idea.id}>
                        <td>{index + 1}</td>
                        <td><strong>{idea.title}</strong></td>
                        <td>{getAuthorName(idea)}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className={getStatusBadge(idea.status)}>
                            {(idea.status || 'PENDING').replace('_', ' ')}
                          </span>
                        </td>
                        <td>{idea.voteIds?.length || 0}</td>
                        <td>
                          <div className="uic-table-actions">
                            <button
                              type="button"
                              className="uic-action-btn view"
                              onClick={() => viewIdea(idea)}
                            >
                              <i className="fas fa-eye"></i>
                              <span>Inspect</span>
                            </button>
                            <button
                              type="button"
                              className="uic-action-btn delete"
                              onClick={() => deleteIdea(idea.id, idea.title)}
                            >
                              <i className="fas fa-trash-alt"></i>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Project Inspection Modal with Separated Lecturer & Student Feedback */}
      {showViewModal && selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          onClose={closeViewModal}
          onFeedback={handleFeedback}
          onStatusUpdate={handleStatusUpdate}
          currentUser={getUser()}
        />
      )}
    </div>
  )
}

export default AdminIdeasPage
