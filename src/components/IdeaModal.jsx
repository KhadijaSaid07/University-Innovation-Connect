import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './IdeaModal.css'

const API = '/api/v2/innovationConnect'

const IdeaModal = ({ idea, onClose, onVote, onFeedback, onStatusUpdate, currentUser }) => {
  const [feedback, setFeedback] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [voteCount, setVoteCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [feedbackCount, setFeedbackCount] = useState(0)
  const [localIdeaStatus, setLocalIdeaStatus] = useState(idea?.status || 'PENDING')
  const [users, setUsers] = useState({})

  // Fetch all users for name mapping
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
        console.log('✅ Users loaded for names:', userMap)
      } catch (err) {
        console.error('❌ Failed to fetch users:', err)
      }
    }
    fetchUsers()
  }, [])

  // Fetch all data when modal opens
  useEffect(() => {
    if (idea && idea.id) {
      setLocalIdeaStatus(idea.status || 'PENDING')
      fetchComments()
      fetchFeedbacks()
      fetchVoteCount()
    }
  }, [idea])

  // Fetch real vote count from API
  const fetchVoteCount = async () => {
    try {
      const res = await axios.get(`${API}/vote/idea/${idea.id}`)
      const votes = res.data || []
      setVoteCount(votes.length)
      console.log('✅ Real vote count:', votes.length)
    } catch (err) {
      console.error('Fetch vote count error:', err)
      setVoteCount(0)
    }
  }

  // Fetch real comments with student names
  const fetchComments = async () => {
    setCommentLoading(true)
    try {
      const res = await axios.get(`${API}/comment/idea/${idea.id}`)
      const data = res.data || []
      console.log('📝 Raw comments from API:', data)
      
      const commentsWithUsers = await Promise.all(
        data.map(async (comment) => {
          let userName = 'Student'
          
          // If comment has userId, fetch the user name
          if (comment.userId) {
            // Check if we already have the user in our map
            if (users[comment.userId]) {
              userName = users[comment.userId].name
            } else {
              // Fetch the user from API
              try {
                const userRes = await axios.get(`${API}/user/${comment.userId}`)
                const user = userRes.data
                userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student'
                // Update the users map
                users[comment.userId] = { name: userName, role: user.role }
              } catch (err) {
                console.error('Failed to fetch user:', comment.userId, err)
                userName = 'Student'
              }
            }
          }
          
          return {
            ...comment,
            userName: userName
          }
        })
      )
      
      setComments(commentsWithUsers)
      setCommentCount(commentsWithUsers.length)
      console.log('✅ Comments with student names:', commentsWithUsers)
      console.log('✅ Total comments count:', commentsWithUsers.length)
    } catch (err) {
      console.error('❌ Fetch comments error:', err)
      setComments([])
      setCommentCount(0)
    } finally {
      setCommentLoading(false)
    }
  }

  // Fetch real feedbacks with lecturer names
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API}/feedback/idea/${idea.id}`)
      const data = res.data || []
      console.log('📝 Raw feedbacks from API:', data)
      
      const feedbackWithNames = await Promise.all(
        data.map(async (fb) => {
          let lecturerName = 'Lecturer'
          
          // If feedback has lecturerId, fetch the name
          if (fb.lecturer) {
            // Check if we already have the user in our map
            if (users[fb.lecturer]) {
              lecturerName = users[fb.lecturer].name
            } else {
              // Fetch the user from API
              try {
                const userRes = await axios.get(`${API}/user/${fb.lecturer}`)
                const user = userRes.data
                lecturerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Lecturer'
                // Update the users map
                users[fb.lecturer] = { name: lecturerName, role: user.role }
              } catch (err) {
                console.error('Failed to fetch lecturer:', fb.lecturer, err)
                lecturerName = 'Lecturer'
              }
            }
          }
          
          return {
            ...fb,
            lecturerName: lecturerName
          }
        })
      )
      
      setFeedbackList(feedbackWithNames)
      setFeedbackCount(feedbackWithNames.length)
      console.log('✅ Feedbacks with lecturer names:', feedbackWithNames)
      console.log('✅ Total feedbacks count:', feedbackWithNames.length)
    } catch (err) {
      console.error('❌ Fetch feedbacks error:', err)
      setFeedbackList([])
      setFeedbackCount(0)
    }
  }

  if (!idea) return null

  // Handle vote - updates real count
  const handleVote = () => {
    if (onVote) {
      onVote(idea.id)
      setVoteCount(prev => prev + 1)
    }
  }

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    
    if (!feedback.trim()) {
      setMessage('⚠️ Please write your feedback')
      return
    }
    
    if (currentUser?.role !== 'LECTURER' && currentUser?.role !== 'ADMIN') {
      setMessage('⚠️ Only lecturers can give feedback')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      // Step 1: If PENDING, change to UNDER_REVIEW first
      if (localIdeaStatus === 'PENDING') {
        setMessage('⏳ Changing status to UNDER_REVIEW...')
        
        if (onStatusUpdate) {
          const result = await onStatusUpdate(idea.id, 'UNDER_REVIEW')
          if (result) {
            setLocalIdeaStatus('UNDER_REVIEW')
            idea.status = 'UNDER_REVIEW'
            console.log('✅ Status changed to UNDER_REVIEW')
          } else {
            setMessage('❌ Failed to change status')
            setSubmitting(false)
            return
          }
        }
      }
      
      // Step 2: Submit feedback
      if (onFeedback) {
        console.log('📤 Submitting feedback...')
        await onFeedback(idea.id, feedback, () => {
          fetchFeedbacks()
          setFeedback('')
          setMessage('✅ Feedback submitted successfully!')
          setTimeout(() => setMessage(''), 3000)
        })
      }
      
    } catch (error) {
      console.error('❌ Feedback error:', error)
      setMessage('❌ Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Update status (Approve/Reject)
  const updateIdeaStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      
      // Check if feedback exists before approving/rejecting
      if ((newStatus === 'APPROVED' || newStatus === 'REJECTED') && feedbackList.length === 0) {
        setMessage('⚠️ Please provide feedback before approving or rejecting')
        setUpdatingStatus(false)
        return false
      }
      
      if (onStatusUpdate) {
        const result = await onStatusUpdate(idea.id, newStatus)
        if (result) {
          setLocalIdeaStatus(newStatus)
          idea.status = newStatus
          setMessage(`✅ Idea ${newStatus} successfully!`)
          setTimeout(() => setMessage(''), 3000)
          return true
        }
      }
      return false
      
    } catch (error) {
      console.error('❌ Status update error:', error)
      setMessage('❌ Failed to update status')
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

  // Handle comment submission
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
    
    if (currentUser.role !== 'STUDENT') {
      setMessage('⚠️ Only students can comment')
      return
    }
    
    setSubmitting(true)
    setMessage('')

    try {
      console.log('📤 Submitting comment:', comment)
      
      const res = await axios.post(`${API}/comment`, {
        message: comment,
        ideaId: idea.id,
        userId: currentUser?.id
      })
      
      console.log('✅ Comment response:', res.data)
      
      const newComment = {
        ...res.data,
        userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Student'
      }
      
      // Add new comment to list
      setComments([...comments, newComment])
      setCommentCount(prev => prev + 1)
      setComment('')
      setMessage('✅ Comment added successfully!')
      setTimeout(() => setMessage(''), 3000)
      
    } catch (error) {
      console.error('❌ Comment error:', error)
      setMessage('❌ Failed to add comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Role-based permissions
  const canComment = () => currentUser && currentUser.role === 'STUDENT'
  const canGiveFeedback = () => currentUser && (currentUser.role === 'LECTURER' || currentUser.role === 'ADMIN')
  const canVote = () => {
    if (!currentUser) return false
    if (currentUser.role !== 'STUDENT') return false
    if (idea.userId === currentUser.id) return false
    if (localIdeaStatus === 'REJECTED' || localIdeaStatus === 'IMPLEMENTED') return false
    return true
  }
  const canApproveReject = () => currentUser && (currentUser.role === 'LECTURER' || currentUser.role === 'ADMIN')
  
  // REAL counts from API
  const totalComments = commentCount || idea.commentIds?.length || 0
  const totalFeedbacks = feedbackCount || idea.feedbackIds?.length || 0
  const totalVotes = voteCount || idea.voteIds?.length || 0

  const hasFeedback = feedbackList.length > 0
  const displayStatus = localIdeaStatus || idea.status || 'PENDING'

  return (
    <div className="idea-modal-overlay" onClick={onClose}>
      <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
        <button className="idea-modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>
        <div className="idea-modal-content">
          
          {/* Header with REAL counts */}
          <div className="idea-modal-header">
            <span className="idea-modal-category">{idea.category || 'General'}</span>
            <h2>{idea.title}</h2>
            <div className="idea-modal-meta">
              <span>👤 <strong>{idea.userName || idea.user?.firstName || 'Student'}</strong></span>
              <span>⭐ {totalVotes} votes</span>
              <span>💬 {totalComments} comments</span>
              <span>📝 {totalFeedbacks} feedbacks</span>
              <span>
                Status: <strong className={`status-${displayStatus?.toLowerCase() || 'pending'}`}>
                  {displayStatus || 'PENDING'}
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
            <button 
              className="idea-modal-vote-btn" 
              onClick={handleVote} 
              disabled={!canVote()}
            >
              {canVote() ? '⭐ Vote' : currentUser ? '🔒 Cannot Vote' : '🔒 Login to Vote'} 
              ({totalVotes})
            </button>
            {currentUser && idea.userId === currentUser.id && (
              <span className="text-muted small ml-2">(You cannot vote for your own idea)</span>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`idea-modal-alert ${message.includes('✅') ? 'idea-modal-success' : message.includes('⏳') ? 'idea-modal-info' : 'idea-modal-danger'}`}>
              {message}
            </div>
          )}

          {/* Feedback Section - Shows REAL lecturer names */}
          <div className="idea-modal-feedback">
            <h4>👨‍🏫 Lecturer Feedback ({totalFeedbacks})</h4>
            
            {feedbackList.length > 0 ? (
              feedbackList.map((fb, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-header">
                    <strong>👨‍🏫 {fb.lecturerName || 'Lecturer'}</strong>
                    <small>{fb.createdDate || 'Just now'}</small>
                  </div>
                  <p>{fb.comment || fb.message}</p>
                </div>
              ))
            ) : (
              <p className="text-muted small">No feedback yet from lecturers</p>
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
          {canApproveReject() && (
            <div className="idea-modal-actions-row">
              {hasFeedback && displayStatus !== 'APPROVED' && displayStatus !== 'REJECTED' && displayStatus !== 'IMPLEMENTED' && (
                <>
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
                </>
              )}
              {!hasFeedback && displayStatus !== 'APPROVED' && displayStatus !== 'REJECTED' && displayStatus !== 'IMPLEMENTED' && (
                <p className="text-muted small">⚠️ Please give feedback first to approve or reject</p>
              )}
              {displayStatus === 'APPROVED' && (
                <p className="text-success">✅ This idea has been APPROVED</p>
              )}
              {displayStatus === 'REJECTED' && (
                <p className="text-danger">❌ This idea has been REJECTED</p>
              )}
              {displayStatus === 'IMPLEMENTED' && (
                <p className="text-muted">🚀 This idea has been IMPLEMENTED</p>
              )}
            </div>
          )}

          {/* Comments Section - Shows REAL student names */}
          <div className="idea-modal-comments">
            <h4>💬 Student Comments ({totalComments})</h4>
            
            {commentLoading ? (
              <p className="text-muted small">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="idea-modal-no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="idea-modal-comment">
                  <div className="comment-header">
                    <strong>🎓 {c.userName || 'Student'}</strong>
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