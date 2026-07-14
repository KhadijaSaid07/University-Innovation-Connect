import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // Fetch ideas from backend
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/idea`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setIdeas(data)
        
      } catch {
        setMessage('Could not load ideas')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }
    fetchIdeas()
  }, [])

  // Delete idea
  const deleteIdea = async (id, title) => {
    if (!window.confirm(`Delete idea: "${title}"?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/idea/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Delete failed')
      
      setIdeas(ideas.filter(i => i.id !== id))
      setMessage(`✅ Idea "${title}" deleted successfully!`)
      setMessageType('success')
      
    } catch {
      setMessage('❌ Failed to delete idea')
      setMessageType('error')
    } finally {
      setTimeout(() => setMessage(''), 3000)
    }
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
            placeholder="Search ideas by title or author..."
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
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Votes</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty-text">No ideas found</td>
                  </tr>
                ) : (
                  filteredIdeas.map((idea) => (
                    <tr key={idea.id}>
                      <td><strong>{idea.title}</strong></td>
                      <td>{getAuthor(idea)}</td>
                      <td>{idea.category}</td>
                      <td>⭐ {idea.votes?.length || 0}</td>
                      <td>
                        <span className={`admin-status-badge ${getStatusBadge(idea.status)}`}>
                          {idea.status || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => deleteIdea(idea.id, idea.title)}
                        >
                          Delete
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
  )
}

export default AdminIdeasPage