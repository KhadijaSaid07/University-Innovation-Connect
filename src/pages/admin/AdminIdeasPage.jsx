import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './AdminDashboardPage.css'

const API = 'http://localhost:8081/api/v2/innovationConnect'

const AdminIdeasPage = () => {
  const navigate = useNavigate()
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState({})

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

  // Fetch users for name mapping
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        const userMap = {}
        res.data.forEach(u => {
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

  // Fetch ideas
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

  // View idea details
  const viewIdea = async (idea) => {
    setSelectedIdea(idea)
    setShowViewModal(true)
    setViewLoading(true)
    
    try {
      // Fetch comments for this idea
      const commentsRes = await axios.get(`${API}/comment/idea/${idea.id}`)
      const comments = commentsRes.data || []
      
      // Fetch feedbacks for this idea
      const feedbackRes = await axios.get(`${API}/feedback/idea/${idea.id}`)
      const feedbacks = feedbackRes.data || []
      
      // Add user names to comments
      const commentsWithNames = comments.map(comment => {
        const userInfo = users[comment.userId]
        return {
          ...comment,
          userName: userInfo ? userInfo.name : 'Unknown Student'
        }
      })
      
      // Add lecturer names to feedbacks
      const feedbackWithNames = feedbacks.map(fb => {
        const userInfo = users[fb.lecturer]
        return {
          ...fb,
          lecturerName: userInfo ? userInfo.name : 'Unknown Lecturer'
        }
      })
      
      setSelectedIdea({
        ...idea,
        comments: commentsWithNames,
        feedbacks: feedbackWithNames,
        commentCount: commentsWithNames.length,
        feedbackCount: feedbackWithNames.length
      })
      
    } catch (err) {
      console.error('View idea error:', err)
    } finally {
      setViewLoading(false)
    }
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setSelectedIdea(null)
  }

  // Delete idea
  const deleteIdea = async (id, title) => {
    if (!window.confirm(`🗑️ Delete idea: "${title}"?`)) return
    
    try {
      await axios.delete(`${API}/idea/${id}`)
      
      const res = await axios.get(`${API}/idea`)
      setIdeas(res.data)
      
      setMessage(`✅ Idea "${title}" deleted successfully!`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      console.error('Delete idea error:', err)
      setMessage(`❌ ${err.response?.data?.message || 'Failed to delete idea'}`)
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredIdeas = ideas.filter(idea =>
    idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAuthorName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.userId && users[idea.userId]) {
      return users[idea.userId].name
    }
    if (idea.user && idea.user.firstName) {
      return `${idea.user.firstName || ''} ${idea.user.lastName || ''}`.trim() || 'Unknown'
    }
    return 'Unknown'
  }

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'status-badge pending',
      'UNDER_REVIEW': 'status-badge under_review',
      'APPROVED': 'status-badge approved',
      'REJECTED': 'status-badge rejected',
      'IMPLEMENTED': 'status-badge implemented'
    }
    return colors[status] || 'status-badge pending'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Loading ideas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      
      {sidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">👑</span>
          <span className="brand-text">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className="sidebar-link">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/admin-users" className="sidebar-link">
            <i className="fas fa-users"></i> Users
          </Link>
          <Link to="/admin-ideas" className="sidebar-link active">
            <i className="fas fa-lightbulb"></i> Ideas
          </Link>
          <Link to="/admin-lecturers" className="sidebar-link">
            <i className="fas fa-chalkboard-teacher"></i> Lecturers
          </Link>
          <button className="sidebar-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      <header className="admin-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-brand">
              <span className="brand-icon">👑</span>
              <span className="brand-text">Admin Panel</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="content-container">
          
          <div className="page-header">
            <div className="page-header-left">
              <h1>💡 Ideas</h1>
              <p>Manage all ideas posted on the platform</p>
            </div>
            <div className="page-header-right">
              <span className="admin-count-badge">
                Total: {ideas.length} ideas
              </span>
            </div>
          </div>

          {message && (
            <div className={`admin-alert ${messageType === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="admin-search-bar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="🔍 Search ideas by title, category, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                        <td>{getAuthorName(idea)}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className={getStatusBadge(idea.status)}>
                            {idea.status || 'PENDING'}
                          </span>
                        </td>
                        <td>⭐ {idea.voteIds?.length || 0}</td>
                        <td>
                          <button 
                            className="admin-view-btn"
                            onClick={() => viewIdea(idea)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button 
                            className="admin-delete-btn"
                            onClick={() => deleteIdea(idea.id, idea.title)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
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

      {/* View Idea Modal */}
      {showViewModal && selectedIdea && (
        <div className="admin-modal-overlay" onClick={closeViewModal}>
          <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>💡 Idea Details</h3>
              <button className="admin-modal-close" onClick={closeViewModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              
              {viewLoading ? (
                <div className="admin-loading">
                  <div className="admin-spinner-small"></div>
                  <p>Loading details...</p>
                </div>
              ) : (
                <>
                  {/* Idea Info */}
                  <div className="view-idea-info">
                    <h2 className="view-idea-title">{selectedIdea.title}</h2>
                    
                    <div className="view-idea-meta">
                      <span className="view-meta-item">
                        <strong>Author:</strong> {getAuthorName(selectedIdea)}
                      </span>
                      <span className="view-meta-item">
                        <strong>Category:</strong> {selectedIdea.category}
                      </span>
                      <span className="view-meta-item">
                        <strong>Status:</strong>
                        <span className={`view-status-badge ${selectedIdea.status?.toLowerCase() || 'pending'}`}>
                          {selectedIdea.status || 'PENDING'}
                        </span>
                      </span>
                      <span className="view-meta-item">
                        <strong>Votes:</strong> ⭐ {selectedIdea.voteIds?.length || 0}
                      </span>
                      <span className="view-meta-item">
                        <strong>Comments:</strong> 💬 {selectedIdea.commentCount || selectedIdea.commentIds?.length || 0}
                      </span>
                      <span className="view-meta-item">
                        <strong>Feedbacks:</strong> 📝 {selectedIdea.feedbackCount || selectedIdea.feedbackIds?.length || 0}
                      </span>
                    </div>

                    <div className="view-idea-description">
                      <h4>📝 Description</h4>
                      <p>{selectedIdea.description || 'No description provided'}</p>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="view-comments-section">
                    <h4>💬 Comments ({selectedIdea.commentCount || selectedIdea.commentIds?.length || 0})</h4>
                    {selectedIdea.comments?.length === 0 ? (
                      <p className="empty-text">No comments yet</p>
                    ) : (
                      <div className="view-comments-list">
                        {selectedIdea.comments?.map((comment, index) => (
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

                  {/* Feedbacks Section */}
                  <div className="view-feedbacks-section">
                    <h4>📝 Feedbacks ({selectedIdea.feedbackCount || selectedIdea.feedbackIds?.length || 0})</h4>
                    {selectedIdea.feedbacks?.length === 0 ? (
                      <p className="empty-text">No feedbacks yet</p>
                    ) : (
                      <div className="view-feedbacks-list">
                        {selectedIdea.feedbacks?.map((feedback, index) => (
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
  )
}

export default AdminIdeasPage