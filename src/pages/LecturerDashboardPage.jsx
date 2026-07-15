import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'
import './LecturerDashboardPage.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const LecturerDashboardPage = () => {
  const navigate = useNavigate()
  
  // State
  const [lecturer, setLecturer] = useState({ name: '', email: '', department: '' })
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, approved: 0, rejected: 0 })
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  // Get logged in user
  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser()
        
        // Fetch all ideas
        const res = await axios.get(`${API}/idea`)
        const data = res.data
        setIdeas(data)
        
        // Calculate stats
        const pending = data.filter(i => i.status === 'PENDING').length
        const underReview = data.filter(i => i.status === 'UNDER_REVIEW').length
        const approved = data.filter(i => i.status === 'APPROVED').length
        const rejected = data.filter(i => i.status === 'REJECTED').length
        
        setStats({
          total: data.length,
          pending: pending,
          underReview: underReview,
          approved: approved,
          rejected: rejected
        })
        
        // Set lecturer info
        if (user) {
          setLecturer({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Lecturer',
            email: user.email || '',
            department: user.department || ''
          })
        }
        
      } catch {
        setError('Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Modal functions
  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  // Filter ideas by status
  const getFilteredIdeas = () => {
    if (filter === 'all') return ideas
    return ideas.filter(idea => idea.status === filter)
  }

  // Get count for each status
  const getCount = (status) => {
    if (status === 'all') return stats.total
    return ideas.filter(i => i.status === status).length
  }

  const handleFilter = (status) => {
    setFilter(status)
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
        const refreshRes = await axios.get(`${API}/idea`)
        const data = refreshRes.data
        setIdeas(data)
        
        setStats({
          total: data.length,
          pending: data.filter(i => i.status === 'PENDING').length,
          underReview: data.filter(i => i.status === 'UNDER_REVIEW').length,
          approved: data.filter(i => i.status === 'APPROVED').length,
          rejected: data.filter(i => i.status === 'REJECTED').length
        })
      }
      
    } catch (error) {
      console.error('Vote error:', error)
      if (error.response?.status === 400) {
        alert('You have already voted for this idea')
      } else {
        alert('Failed to vote')
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
        const refreshRes = await axios.get(`${API}/idea`)
        const data = refreshRes.data
        setIdeas(data)
        
        setStats({
          total: data.length,
          pending: data.filter(i => i.status === 'PENDING').length,
          underReview: data.filter(i => i.status === 'UNDER_REVIEW').length,
          approved: data.filter(i => i.status === 'APPROVED').length,
          rejected: data.filter(i => i.status === 'REJECTED').length
        })
      }
      
      if (callback) callback()
      
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback')
    }
  }

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const user = getUser()
      
      if (!user) {
        alert('Please login')
        return
      }
      
      if (user?.role !== 'LECTURER' && user?.role !== 'ADMIN') {
        alert('Only lecturers can update status!')
        return
      }
      
      const idea = ideas.find(i => i.id === id)
      if (!idea) {
        alert('Idea not found')
        return false
      }
      
      // Check if feedback exists before approving/rejecting
      if (newStatus === 'APPROVED' || newStatus === 'REJECTED') {
        const feedbackRes = await axios.get(`${API}/feedback/idea/${id}`)
        const feedbacks = feedbackRes.data || []
        if (feedbacks.length === 0) {
          alert('Please give feedback first before approving or rejecting')
          return false
        }
      }
      
      const res = await axios.put(`${API}/idea/${id}/status?status=${newStatus}`)
      
      if (res.data) {
        const refreshRes = await axios.get(`${API}/idea`)
        const data = refreshRes.data
        setIdeas(data)
        
        setStats({
          total: data.length,
          pending: data.filter(i => i.status === 'PENDING').length,
          underReview: data.filter(i => i.status === 'UNDER_REVIEW').length,
          approved: data.filter(i => i.status === 'APPROVED').length,
          rejected: data.filter(i => i.status === 'REJECTED').length
        })
        
        setFilter('all')
        return true
      }
      return false
    } catch (error) {
      console.error('Status update error:', error)
      alert('Failed to update status')
      return false
    }
  }

  // Get student name
  const getStudentName = (idea) => {
    if (idea.userName) return idea.userName
    if (idea.user) {
      const firstName = idea.user.firstName || ''
      const lastName = idea.user.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      if (fullName) return fullName
    }
    return 'Unknown'
  }

  const filteredIdeas = getFilteredIdeas()

  // Loading state
  if (loading) {
    return (
      <div className="lecturer-loading">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading dashboard...</p>
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
    <div className="lecturer-dashboard">
      
      {/* Sidebar */}
      <aside className="lecturer-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link active">
              <i className="fas fa-tachometer-alt" /> Dashboard
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
              <i className="fas fa-trophy" /> Leaderboard
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link">
              <i className="fas fa-user" /> Profile
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Header */}
      <header className="lecturer-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Lecturer Portal</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-user">
              <div className="user-avatar">
                {lecturer.name ? lecturer.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div className="user-info">
                <span className="user-name">{lecturer.name || 'Lecturer'}</span>
                <span className="user-role">Lecturer</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="lecturer-content">
        <div className="content-container">
          
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>👋 Welcome, {lecturer.name || 'Lecturer'}!</h1>
              <p>Review student ideas and provide feedback.</p>
            </div>
            <div className="welcome-badge">
              {lecturer.email && <span>📧 {lecturer.email}</span>}
            </div>
          </div>

          {/* Filter Buttons - ONLY 5 (NO IMPLEMENTED) */}
          <div className="filter-section">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              All ({getCount('all')})
            </button>
            <button 
              className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
              onClick={() => handleFilter('PENDING')}
            >
              Pending ({getCount('PENDING')})
            </button>
            <button 
              className={`filter-btn ${filter === 'UNDER_REVIEW' ? 'active' : ''}`}
              onClick={() => handleFilter('UNDER_REVIEW')}
            >
              Reviewing ({getCount('UNDER_REVIEW')})
            </button>
            <button 
              className={`filter-btn ${filter === 'APPROVED' ? 'active' : ''}`}
              onClick={() => handleFilter('APPROVED')}
            >
              Approved ({getCount('APPROVED')})
            </button>
            <button 
              className={`filter-btn ${filter === 'REJECTED' ? 'active' : ''}`}
              onClick={() => handleFilter('REJECTED')}
            >
              Rejected ({getCount('REJECTED')})
            </button>
          </div>

          {/* Ideas Table */}
          <div className="recent-ideas">
            <div className="section-header">
              <h3>📝 {filter === 'all' ? 'All Student Ideas' : filter + ' Ideas'}</h3>
            </div>
            <div className="table-responsive">
              <table className="ideas-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Votes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        {filter === 'all' ? 'No ideas submitted yet' : `No ${filter.toLowerCase()} ideas found`}
                      </td>
                    </tr>
                  ) : (
                    filteredIdeas.map((idea, index) => (
                      <tr key={idea.id}>
                        <td>{index + 1}</td>
                        <td>{idea.title}</td>
                        <td>{getStudentName(idea)}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className={`status-badge ${idea.status === 'PENDING' ? 'status-pending' : 
                            idea.status === 'UNDER_REVIEW' ? 'status-under-review' :
                            idea.status === 'APPROVED' ? 'status-approved' : 
                            idea.status === 'REJECTED' ? 'status-rejected' : 'status-pending'}`}>
                            {idea.status || 'PENDING'}
                          </span>
                        </td>
                        <td>⭐ {idea.voteIds?.length || 0}</td>
                        <td>
                          <button 
                            className="btn-review-idea"
                            onClick={() => openModal(idea)}
                          >
                            <i className="fas fa-check-circle" /> Review
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

      {/* Modal */}
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

export default LecturerDashboardPage