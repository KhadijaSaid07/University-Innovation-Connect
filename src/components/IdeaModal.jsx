import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './IdeaModal.css'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const IdeaModal = ({ idea, onClose, onVote, onFeedback, onStatusUpdate, currentUser }) => {
  const [feedback, setFeedback] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [feedbackList, setFeedbackList] = useState(idea?.feedbacks || [])
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (idea && idea.id) {
      fetchComments()
      fetchFeedbacks()
    }
  }, [idea])

  const fetchComments = async () => {
    setCommentLoading(true)
    try {
      const res = await axios.get(`${API}/comment/idea/${idea.id}`)
      const data = res.data || []
      
      const commentsWithUsers = await Promise.all(
        data.map(async (comment) => {
          if (comment.userId) {
            try {
              const userRes = await axios.get(`${API}/user/${comment.userId}`)
              const user = userRes.data
              return {
                ...comment,
                user: user,
                userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student'
              }
            } catch {
              return { ...comment, userName: 'Student' }
            }
          }
          return { ...comment, userName: 'Student' }
        })
      )
      
      setComments(commentsWithUsers)
    } catch {
      setComments([])
    } finally {
      setCommentLoading(false)
    }
  }

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API}/feedback/idea/${idea.id}`)
      setFeedbackList(res.data || [])
    } catch {
      setFeedbackList([])
    }
  }

  if (!idea) return null

  const handleVote = () => onVote(idea.id)

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) {
      setMessage('⚠️ Please write your feedback')
      return
    }
    
    // Check if user is lecturer or admin
    if (currentUser?.role !== 'LECTURER' && currentUser?.role !== 'ADMIN') {
      setMessage('⚠️ Only lecturers can give feedback')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const res = await axios.post(`${API}/feedback`, {
        comment: feedback,
        idea: idea.id,
        lecturer: currentUser?.id
      })

      const data = res.data
      setFeedbackList([...feedbackList, data])
      setFeedback('')
      setMessage('✅ Feedback submitted successfully!')
      
      // Update idea status to UNDER_REVIEW after feedback
      if (idea.status === 'PENDING') {
        await updateIdeaStatus('UNDER_REVIEW')
      }
      
      setTimeout(() => setMessage(''), 3000)
      
    } catch (error) {
      console.error('Feedback error:', error)
      setMessage('❌ Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle status update (Approve/Reject)
  const updateIdeaStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      
      // If approving, check if feedback exists
      if (newStatus === 'APPROVED' && feedbackList.length === 0) {
        setMessage('⚠️ Please provide feedback before approving')
        setUpdatingStatus(false)
        return false
      }
      
      const res = await axios.put(`${API}/idea/${idea.id}/status?status=${newStatus}`)
      
      if (res.data) {
        idea.status = newStatus
        setMessage(`✅ Idea ${newStatus} successfully!`)
        setTimeout(() => setMessage(''), 3000)
        return true
      }
      return false
      
    } catch (error) {
      console.error('Status update error:', error)
      setMessage(`❌ Failed to update status: ${error.response?.data || 'Unknown error'}`)
      setTimeout(() => setMessage(''), 3000)
      return false
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleApprove = async () => {
    if (feedbackList.length === 0) {
      setMessage('⚠️ Please give feedback before approving')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    await updateIdeaStatus('APPROVED')
  }

  const handleReject = async () => {
    if (feedbackList.length === 0) {
      setMessage('⚠️ Please give feedback before rejecting')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    await updateIdeaStatus('REJECTED')
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      setMessage('⚠️ Please write a comment')
      return
    }
    if (!currentUser) {
      setMessage('⚠️ Please login to comment')
      return
    }
    setSubmitting(true)
    setMessage('')

    try {
      const res = await axios.post(`${API}/comment`, {
        message: comment,
        ideaId: idea.id,
        userId: currentUser?.id
      })
      const newComment = res.data
      const newCommentWithUser = {
        ...newComment,
        user: currentUser,
        userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Student'
      }
      
      setComments([...comments, newCommentWithUser])
      setComment('')
      setMessage('✅ Comment added successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Comment error:', error)
      setMessage('❌ Failed to add comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canComment = () => currentUser && currentUser.role === 'STUDENT'
  const canGiveFeedback = () => currentUser && (currentUser.role === 'LECTURER' || currentUser.role === 'ADMIN')
  const canVote = () => currentUser && currentUser.role === 'STUDENT'
  const canApproveReject = () => currentUser && (currentUser.role === 'LECTURER' || currentUser.role === 'ADMIN')
  
  const totalComments = comments.length || idea.comments?.length || 0
  const totalFeedbacks = feedbackList.length || idea.feedbacks?.length || 0

  // Check if idea already has feedback
  const hasFeedback = feedbackList.length > 0

  return (
    <div className="idea-modal-overlay" onClick={onClose}>
      <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
        <button className="idea-modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>
        <div className="idea-modal-content">
          
          {/* Header */}
          <div className="idea-modal-header">
            <span className="idea-modal-category">{idea.category}</span>
            <h2>{idea.title}</h2>
            <div className="idea-modal-meta">
              <span>👤 <strong>{idea.userName || idea.user?.firstName || 'Student'}</strong></span>
              <span>📅 {idea.createdDate || 'Just now'}</span>
              <span>⭐ {idea.votes?.length || 0} votes</span>
              <span>💬 {totalComments} comments</span>
              <span>📝 {totalFeedbacks} feedbacks</span>
              <span>
                Status: <strong className={`status-${idea.status?.toLowerCase() || 'pending'}`}>
                  {idea.status || 'PENDING'}
                </strong>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="idea-modal-body">
            <h4>📝 Description</h4>
            <p>{idea.description}</p>
          </div>

          {/* Vote Button */}
          <div className="idea-modal-actions">
            <button className="idea-modal-vote-btn" onClick={handleVote} disabled={!canVote()}>
              {canVote() ? '👍 Upvote' : '🔒 Login to Vote'} ({idea.votes?.length || 0})
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`idea-modal-alert ${message.includes('✅') ? 'idea-modal-success' : 'idea-modal-danger'}`}>
              {message}
            </div>
          )}

          {/* Feedback Section (Lecturers only) */}
          <div className="idea-modal-feedback">
            <h4>👨‍🏫 Feedback ({totalFeedbacks})</h4>
            
            {feedbackList.length > 0 ? (
              feedbackList.map((fb, index) => (
                <div key={index} className="feedback-item">
                  <p>{fb.comment || fb.message}</p>
                  <small>By Lecturer</small>
                </div>
              ))
            ) : (
              <p className="text-muted small">No feedback yet</p>
            )}
            
            {canGiveFeedback() && (
              <form onSubmit={handleFeedbackSubmit} className="mt-2">
                <textarea 
                  className="idea-modal-textarea" 
                  rows="2" 
                  placeholder="Write your feedback as a lecturer..." 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                />
                <button type="submit" className="idea-modal-feedback-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : '📤 Submit Feedback'}
                </button>
              </form>
            )}
          </div>

          {/* Approve/Reject Buttons (Lecturers only) */}
          {canApproveReject() && hasFeedback && idea.status !== 'APPROVED' && idea.status !== 'REJECTED' && idea.status !== 'IMPLEMENTED' && (
            <div className="idea-modal-actions-row">
              <button 
                className="btn-approve" 
                onClick={handleApprove}
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Processing...' : '✅ Approve'}
              </button>
              <button 
                className="btn-reject" 
                onClick={handleReject}
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Processing...' : '❌ Reject'}
              </button>
            </div>
          )}

          {canApproveReject() && !hasFeedback && (
            <div className="idea-modal-hint">
              <p className="text-muted small">⚠️ Please provide feedback first to approve or reject</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="idea-modal-comments">
            <h4>💬 Comments ({totalComments})</h4>
            
            {commentLoading ? (
              <p className="text-muted small">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="idea-modal-no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="idea-modal-comment">
                  <div className="comment-header">
                    <strong>{c.userName || c.user?.firstName || 'Student'}</strong>
                    <small>{c.createdDate || 'Just now'}</small>
                  </div>
                  <p>{c.message}</p>
                </div>
              ))
            )}
            
            {canComment() ? (
              <form onSubmit={handleCommentSubmit} className="mt-3">
                <div className="comment-input-wrapper">
                  <input 
                    type="text" 
                    className="idea-modal-comment-input" 
                    placeholder="Write a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                  />
                  <button type="submit" className="idea-modal-comment-btn" disabled={submitting}>
                    {submitting ? 'Sending...' : '📤 Post'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-muted small mt-2">
                {currentUser ? 'Only students can comment' : 'Please login to comment'}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default IdeaModal