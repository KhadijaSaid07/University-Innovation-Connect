import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './LecturerIdeaDetailsPage.css'

const LecturerIdeaDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  

  const [idea, setIdea] = useState(null)
  const [comments, setComments] = useState([])
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [lecturer, setLecturer] = useState({ name: '' })

  const getLoggedInUser = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return null
      }
    }
    return null
  }

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUser = getLoggedInUser()
        setLecturer({ name: loggedInUser?.name || 'Lecturer' })
      
        // const token = localStorage.getItem('token')
        // 
        // // 1. Get idea details
        // const ideaRes = await fetch(`http://localhost:8080/api/ideas/${id}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const ideaData = await ideaRes.json()
        // setIdea(ideaData)
        // 
        // // 2. Get comments
        // const commentsRes = await fetch(`http://localhost:8080/api/ideas/${id}/comments`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const commentsData = await commentsRes.json()
        // setComments(commentsData)
        // 
        // setLoading(false)
       
        // For now 
        setIdea(null)
        setComments([])
        setLoading(false)
        
      } catch (err) {
        console.error('Error:', err)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

 
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    
    if (!feedback.trim()) {
      setMessage('⚠️ Please write your feedback')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      
      
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch(`http://localhost:8080/api/ideas/${id}/feedback`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ feedback: feedback })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to submit feedback')
      // }
      // 
      // const data = await response.json()
      // setIdea({ ...idea, feedback: data.feedback })
      // setMessage('✅ Feedback submitted successfully!')
      // setFeedback('')
      // setTimeout(() => setMessage(''), 3000)
      

      setMessage('⚠️ Feedback will work when API is connected')
      setTimeout(() => setMessage(''), 3000)

    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Could not submit feedback')
    } finally {
      setSubmitting(false)
    }
  }


  const handleVote = async () => {
    try {
      
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch(`http://localhost:8080/api/ideas/${id}/vote`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to vote')
      // }
      // 
      // const data = await response.json()
      // setIdea(data)
      // setMessage('✅ You voted for this idea!')
      // setTimeout(() => setMessage(''), 2000)
     

      setMessage('⚠️ Voting will work when API is connected')
      setTimeout(() => setMessage(''), 2000)

    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Could not vote')
    }
  }

  
  const goBack = () => {
    navigate('/lecturer-dashboard')
  }


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

 
  if (loading) {
    return (
      <div className="lecturer-idea-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading idea details...</p>
      </div>
    )
  }

 
  if (!idea) {
    return (
      <div className="lecturer-idea-notfound">
        <div style={{ fontSize: '4rem' }}>📭</div>
        <h5 className="text-gray-800 mt-3">No Idea Found</h5>
        <p className="text-muted">The idea you're looking for doesn't exist.</p>
        <button className="btn btn-primary mt-3" onClick={goBack}>
          ← Back to Dashboard
        </button>
      </div>
    )
  }

 
  return (
    <div className="lecturer-idea-page">
      
  
      <header className="lecturer-idea-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Review Idea</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="lecturer-idea-content">
        <div className="idea-container">
          
          <button onClick={goBack} className="btn-back">
            ← Back to Dashboard
          </button>

          <div className="idea-card">
            
           
            <div className="idea-header">
              <span className="idea-category">{idea.category}</span>
              <h2 className="idea-title">{idea.title}</h2>
              <div className="idea-meta">
                <span>👤 {idea.author} {idea.authorReg && `(${idea.authorReg})`}</span>
                <span>📅 {idea.date}</span>
              </div>
            </div>

        
            <div className="idea-description">
              <h4>📝 Description</h4>
              <p>{idea.description}</p>
            </div>

          
            <div className="idea-actions">
              <button className="btn-vote" onClick={handleVote}>
                👍 Upvote ({idea.votes || 0})
              </button>
            </div>

          
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`}>
                {message}
              </div>
            )}

            <div className="feedback-section">
              <h4>👨‍🏫 Your Feedback</h4>
              
              {idea.feedback ? (
                <div className="feedback-existing">
                  <p>{idea.feedback}</p>
                  <small className="text-muted">Feedback submitted by you</small>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your feedback for this idea..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <button type="submit" className="btn-submit-feedback" disabled={submitting}>
                    {submitting ? 'Submitting...' : '📤 Submit Feedback'}
                  </button>
                </form>
              )}
            </div>

            <div className="comments-section">
              <h4>💬 Comments ({comments.length})</h4>
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <strong>{comment.author}</strong>
                    <small className="text-muted">{comment.date}</small>
                    <p>{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

     
      <aside className="lecturer-idea-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
              <i className="fas fa-trophy" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link">
              <i className="fas fa-user" />
              <span>Profile</span>
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

    </div>
  )
}

export default LecturerIdeaDetailsPage