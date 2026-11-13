import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import IdeaModal from '../components/IdeaModal'
import LecturerNavigation from '../components/LecturerNavigation'
import './LecturerDashboardPage.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const LecturerDashboardPage = () => {
  const location = useLocation()

  const [lecturer, setLecturer] = useState({ name: '', email: '' })
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const filterParam = params.get('filter')
    if (filterParam) {
      setFilter(filterParam)
    } else {
      setFilter('all')
    }
  }, [location.search])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser()
        const res = await axios.get(`${API}/idea`)
        setIdeas(res.data || [])

        if (user) {
          setLecturer({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Lecturer',
            email: user.email || ''
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

  const openModal = (idea) => {
    setSelectedIdea(idea)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedIdea(null)
    setShowModal(false)
  }

  const getFilteredIdeas = () => {
    if (filter === 'all') return ideas
    return ideas.filter(idea => idea.status === filter)
  }

  const getCount = (status) => {
    if (status === 'all') return ideas.length
    return ideas.filter(i => i.status === status).length
  }

  const handleFilter = (status) => setFilter(status)

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
      setIdeas(refreshRes.data || [])
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

      const currentIdea = ideas.find(i => i.id === id)
      if (currentIdea && currentIdea.status === 'PENDING') {
        await axios.put(`${API}/idea/${id}/status?status=UNDER_REVIEW`)
      }

      await axios.post(`${API}/feedback`, {
        comment: comment,
        idea: id,
        lecturer: user?.id
      })

      const refreshRes = await axios.get(`${API}/idea`)
      setIdeas(refreshRes.data || [])

      if (callback) callback()
      alert('Feedback submitted successfully!')
    } catch (error) {
      alert(`${error.response?.data?.message || 'Failed to submit feedback'}`)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const user = getUser()
      if (!user || (user?.role !== 'LECTURER' && user?.role !== 'ADMIN')) {
        alert('Only lecturers can update status!')
        return false
      }

      if (newStatus === 'APPROVED' || newStatus === 'REJECTED') {
        const feedbackRes = await axios.get(`${API}/feedback/idea/${id}`)
        if (feedbackRes.data?.length === 0) {
          alert('Please give feedback first')
          return false
        }
      }

      await axios.put(`${API}/idea/${id}/status?status=${newStatus}`)

      const refreshRes = await axios.get(`${API}/idea`)
      setIdeas(refreshRes.data || [])
      setFilter('all')
      alert(`Idea ${newStatus} successfully!`)
      return true
    } catch (error) {
      alert(`${error.response?.data?.message || 'Failed to update status'}`)
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

  const filteredIdeas = getFilteredIdeas()

  if (loading) {
    return (
      <div className="lecturer-loading">
        <div className="spinner-border text-primary" />
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h5 className="text-danger mt-3">{error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="lecturer-dashboard">
      <LecturerNavigation
        pageTitle="Student Proposals Review"
        pageSubtitle="Evaluate submissions, leave academic feedback, and update approval status"
        activeFilter={filter}
        onSelectFilter={handleFilter}
      />

      <div className="lecturer-content">
        <div className="content-container">
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Welcome, {lecturer.name || 'Lecturer'}</h1>
              <p>Review student ideas and provide constructive feedback.</p>
            </div>
            <div className="welcome-badge">
              {lecturer.email && <span>{lecturer.email}</span>}
            </div>
          </div>

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
              Under Review ({getCount('UNDER_REVIEW')})
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

          <div className="recent-ideas">
            <div className="section-header">
              <h3>{filter === 'all' ? 'All Student Ideas' : `${filter.replace('_', ' ')} Ideas`}</h3>
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
                        {filter === 'all' ? 'No ideas submitted yet' : `No ${filter.toLowerCase().replace('_', ' ')} ideas found`}
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
                        <td>{idea.voteIds?.length || 0}</td>
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
