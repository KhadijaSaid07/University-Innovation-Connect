import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import './AdminDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const AdminIdeasPage = () => {
  const navigate = useNavigate()
  
  // State
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [comments, setComments] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [viewLoading, setViewLoading] = useState(false)
  const [users, setUsers] = useState({})

  // Fetch all users for name mapping
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        const userMap = {}
        res.data.forEach(user => {
          userMap[user.id] = {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
            role: user.role
          }
        })
        setUsers(userMap)
      } catch (err) {
        console.error('Fetch users error:', err)
      }
    }
    fetchUsers()
  }, [])

  // Check admin auth
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      navigate('/login')
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.role?.toUpperCase() !== 'ADMIN') {
        navigate('/login')
        return
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  // Fetch ideas - NO TOKEN
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${API}/idea`)
        setIdeas(res.data)
      } catch (err) {
        console.error('Fetch ideas error:', err)
        setMessage('Could not load ideas')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }
    fetchIdeas()
  }, [])

  // Delete idea - NO TOKEN
  const deleteIdea = async (id, title) => {
    if (!window.confirm(`🗑️ Delete idea: "${title}"?`)) return
    
    try {
      await axios.delete(`${API}/idea/${id}`)
      
      // Refresh list
      const res = await axios.get(`${API}/idea`)
      setIdeas(res.data)
      
      setMessage(`✅ Idea "${title}" deleted successfully!`)
      setMessageType('success')
      
    } catch (err) {
      console.error('Delete idea error:', err)
      
      let errorMsg = 'Failed to delete idea'
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
    } finally {
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // View idea details
  const viewIdea = async (idea) => {
    setSelectedIdea(idea)
    setShowViewModal(true)
    setViewLoading(true)
    setComments([])
    setFeedbacks([])
    
    try {
      // Fetch comments for this idea
      const commentsRes = await axios.get(`${API}/comment/idea/${idea.id}`)
      const commentsData = commentsRes.data || []
      
      // Add user names to comments
      const commentsWithNames = commentsData.map(comment => {
        const userInfo = users[comment.userId]
        return {
          ...comment,
          userName: userInfo ? userInfo.name : 'Unknown Student',
          userRole: userInfo ? userInfo.role : 'STUDENT'
        }
      })
      setComments(commentsWithNames)
    } catch (err) {
      console.error('Fetch comments error:', err)
      setComments([])
    }
    
    try {
      // Fetch feedbacks for this idea
      const feedbackRes = await axios.get(`${API}/feedback/idea/${idea.id}`)
      const feedbackData = feedbackRes.data || []
      
      // Add lecturer names to feedbacks
      const feedbackWithNames = feedbackData.map(feedback => {
        const userInfo = users[feedback.lecturer]
        return {
          ...feedback,
          lecturerName: userInfo ? userInfo.name : 'Unknown Lecturer',
          lecturerRole: userInfo ? userInfo.role : 'LECTURER'
        }
      })
      setFeedbacks(feedbackWithNames)
    } catch (err) {
      console.error('Fetch feedbacks error:', err)
      setFeedbacks([])
    }
    
    setViewLoading(false)
  }

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false)
    setSelectedIdea(null)
    setComments([])
    setFeedbacks([])
  }

  // Filter ideas by search
  const filteredIdeas = ideas.filter(idea =>
    idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get author name
  const getAuthor = (idea) => {
    if (idea.user) {
      return `${idea.user.firstName || ''} ${idea.user.lastName || ''}`.trim() || 'Unknown'
    }
    if (idea.userName) {
      return idea.userName
    }
    return 'Unknown'
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': 'admin-status-pending',
      'UNDER_REVIEW': 'admin-status-review',
      'APPROVED': 'admin-status-approved',
      'REJECTED': 'admin-status-rejected',
      'IMPLEMENTED': 'admin-status-implemented'
    }
    return statusMap[status] || 'admin-status-pending'
  }

  // Get status color for modal
  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#F59E0B',
      'UNDER_REVIEW': '#3B82F6',
      'APPROVED': '#10B981',
      'REJECTED': '#EF4444',
      'IMPLEMENTED': '#6B7280'
    }
    return colors[status] || '#6B7280'
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-loading">
            <div className="admin-spinner-large" />
            <p>Loading ideas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>💡 Ideas</h1>
            <p>Manage all ideas posted on the platform</p>
          </div>
          <div className="admin-header-right">
            <span className="admin-count-badge">
              Total: {ideas.length} ideas
            </span>
          </div>
        </header>

        {/* Message */}
        {message && (
          <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
            {message}
          </div>
        )}

        {/* Search */}
        <div className="admin-search-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="🔍 Search ideas by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Ideas Table */}
        <div className="admin-table-card">
          <div className="admin-table-responsive">
            <table className="admin-table-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Votes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty-text">
                      {ideas.length === 0 ? 'No ideas posted yet' : 'No matching ideas found'}
                    </td>
                  </tr>
                ) : (
                  filteredIdeas.map((idea, index) => (
                    <tr key={idea.id}>
                      <td>{index + 1}</td>
                      <td><strong>{idea.title}</strong></td>
                      <td>{getAuthor(idea)}</td>
                      <td>{idea.category}</td>
                      <td>⭐ {idea.voteIds?.length || 0}</td>
                      <td>
                        <span className={`admin-status-badge ${getStatusBadge(idea.status)}`}>
                          {idea.status || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-view-btn"
                          onClick={() => viewIdea(idea)}
                        >
                          <i className="fas fa-eye" /> View
                        </button>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => deleteIdea(idea.id, idea.title)}
                        >
                          <i className="fas fa-trash" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Idea Modal */}
        {showViewModal && selectedIdea && (
          <div className="admin-modal-overlay" onClick={closeViewModal}>
            <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>💡 Idea Details</h3>
                <button className="admin-modal-close" onClick={closeViewModal}>
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="admin-modal-body">
                
                {/* Idea Info */}
                <div className="view-idea-info">
                  <h2 className="view-idea-title">{selectedIdea.title}</h2>
                  
                  <div className="view-idea-meta">
                    <span className="view-meta-item">
                      <strong>Author:</strong> {getAuthor(selectedIdea)}
                    </span>
                    <span className="view-meta-item">
                      <strong>Category:</strong> {selectedIdea.category}
                    </span>
                    <span className="view-meta-item">
                      <strong>Status:</strong>
                      <span className="view-status-badge" style={{ backgroundColor: getStatusColor(selectedIdea.status) }}>
                        {selectedIdea.status || 'PENDING'}
                      </span>
                    </span>
                    <span className="view-meta-item">
                      <strong>Votes:</strong> ⭐ {selectedIdea.voteIds?.length || 0}
                    </span>
                    <span className="view-meta-item">
                      <strong>Comments:</strong> 💬 {comments.length}
                    </span>
                    <span className="view-meta-item">
                      <strong>Feedbacks:</strong> 📝 {feedbacks.length}
                    </span>
                  </div>

                  <div className="view-idea-description">
                    <h4>📝 Description</h4>
                    <p>{selectedIdea.description || 'No description provided'}</p>
                  </div>
                </div>

                {/* Loading */}
                {viewLoading ? (
                  <div className="admin-loading">
                    <div className="admin-spinner-small" />
                    <p>Loading comments and feedbacks...</p>
                  </div>
                ) : (
                  <>
                    {/* Comments Section - WITH STUDENT NAMES */}
                    <div className="view-comments-section">
                      <h4>💬 Comments ({comments.length})</h4>
                      {comments.length === 0 ? (
                        <p className="admin-empty-text">No comments yet</p>
                      ) : (
                        <div className="view-comments-list">
                          {comments.map((comment, index) => (
                            <div key={index} className="view-comment-item">
                              <div className="view-comment-header">
                                <strong>🎓 {comment.userName || 'Student'}</strong>
                                <small>{comment.createdDate || 'Just now'}</small>
                              </div>
                              <p>{comment.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Feedbacks Section - WITH LECTURER NAMES */}
                    <div className="view-feedbacks-section">
                      <h4>📝 Feedbacks ({feedbacks.length})</h4>
                      {feedbacks.length === 0 ? (
                        <p className="admin-empty-text">No feedbacks yet</p>
                      ) : (
                        <div className="view-feedbacks-list">
                          {feedbacks.map((feedback, index) => (
                            <div key={index} className="view-feedback-item">
                              <div className="view-feedback-header">
                                <strong>👨‍🏫 {feedback.lecturerName || 'Lecturer'}</strong>
                                <small>{feedback.createdDate || 'Just now'}</small>
                              </div>
                              <p>{feedback.comment || feedback.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="admin-modal-actions">
                  <button className="admin-cancel-btn" onClick={closeViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminIdeasPage