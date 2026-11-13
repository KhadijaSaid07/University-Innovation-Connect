import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './IdeaModal.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const IdeaModal = ({ idea, onClose, onVote, onFeedback, onStatusUpdate, currentUser }) => {
  const [feedback, setFeedback] = useState('')
  const [comment, setComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [voteCount, setVoteCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const [feedbackCount, setFeedbackCount] = useState(0)
  const [localIdeaStatus, setLocalIdeaStatus] = useState(idea?.status || 'PENDING')
  const [activeTab, setActiveTab] = useState('both') // 'both' | 'lecturer' | 'student'

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return String(dateStr)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return String(dateStr)
    }
  }

  const formatCategory = (cat) => {
    if (!cat) return 'General'
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  useEffect(() => {
    if (idea && idea.id) {
      setLocalIdeaStatus(idea.status || 'PENDING')
      fetchVoteCount()
      fetchCommentsAndFeedbacks()
    }
  }, [idea])

  const fetchVoteCount = async () => {
    try {
      const res = await axios.get(`${API}/vote/idea/${idea.id}`)
      const votes = res.data || []
      setVoteCount(votes.length)
      if (currentUser?.id) {
        const voted = votes.some(
          v => v.userId === currentUser.id || v.user?.id === currentUser.id
        )
        setHasVoted(voted)
      }
    } catch {
      setVoteCount(idea?.voteIds?.length || 0)
    }
  }

  const fetchCommentsAndFeedbacks = async () => {
    setCommentLoading(true)
    setFeedbackLoading(true)

    let userMap = {}
    try {
      const usersRes = await axios.get(`${API}/user`)
      ;(usersRes.data || []).forEach(u => {
        userMap[u.id] = {
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
          role: u.role
        }
      })
    } catch {
      // Fallback to DTO names if user list fails
    }

    // Fetch student comments
    try {
      const res = await axios.get(`${API}/comment/idea/${idea.id}`)
      const data = res.data || []
      const mappedComments = data.map(c => ({
        ...c,
        userName:
          c.userName ||
          (c.userId && userMap[c.userId]?.name) ||
          'Student'
      }))
      setComments(mappedComments)
      setCommentCount(mappedComments.length)
    } catch {
      setComments([])
      setCommentCount(0)
    } finally {
      setCommentLoading(false)
    }

    // Fetch lecturer feedbacks
    try {
      const res = await axios.get(`${API}/feedback/idea/${idea.id}`)
      const data = res.data || []
      const mappedFeedbacks = data.map(fb => ({
        ...fb,
        lecturerName:
          fb.lecturerName ||
          (fb.lecturer && userMap[fb.lecturer]?.name) ||
          'Lecturer'
      }))
      setFeedbackList(mappedFeedbacks)
      setFeedbackCount(mappedFeedbacks.length)
    } catch {
      setFeedbackList([])
      setFeedbackCount(0)
    } finally {
      setFeedbackLoading(false)
    }
  }

  if (!idea) return null

  const showNotice = (msg, type = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3500)
  }

  const handleVote = async () => {
    if (voting) return

    if (hasVoted) {
      showNotice('You already voted for this idea', 'error')
      return
    }

    if (!onVote) return

    setVoting(true)
    try {
      const result = await onVote(idea.id)
      if (result && result.ok === false) {
        if ((result.message || '').toLowerCase().includes('already voted')) {
          setHasVoted(true)
        }
        showNotice(result.message || 'You already voted for this idea', 'error')
      } else {
        setHasVoted(true)
        await fetchVoteCount()
        showNotice('You voted for idea successfully', 'success')
      }
    } finally {
      setVoting(false)
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()

    if (!feedback.trim()) {
      showNotice('Please enter your academic feedback before submitting.', 'error')
      return
    }

    if (currentUser?.role !== 'LECTURER' && currentUser?.role !== 'ADMIN') {
      showNotice('Only lecturers can submit academic feedback.', 'error')
      return
    }

    setSubmittingFeedback(true)
    setMessage('')

    try {
      if (localIdeaStatus === 'PENDING' && onStatusUpdate) {
        const result = await onStatusUpdate(idea.id, 'UNDER_REVIEW')
        if (result) {
          setLocalIdeaStatus('UNDER_REVIEW')
          idea.status = 'UNDER_REVIEW'
        }
      }

      if (onFeedback) {
        await onFeedback(idea.id, feedback.trim(), () => {
          fetchCommentsAndFeedbacks()
          setFeedback('')
          showNotice('Lecturer feedback submitted successfully.', 'success')
        })
      }
    } catch {
      showNotice('Failed to submit feedback. Please try again.', 'error')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const updateIdeaStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)

      if ((newStatus === 'APPROVED' || newStatus === 'REJECTED') && feedbackList.length === 0) {
        showNotice('Please provide lecturer feedback before approving or rejecting this project.', 'error')
        setUpdatingStatus(false)
        return false
      }

      if (onStatusUpdate) {
        const result = await onStatusUpdate(idea.id, newStatus)
        if (result) {
          setLocalIdeaStatus(newStatus)
          idea.status = newStatus
          showNotice(`Project status updated to ${newStatus.replace('_', ' ')}.`, 'success')
          return true
        }
      }
      return false
    } catch {
      showNotice('Failed to update project status.', 'error')
      return false
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim()) {
      showNotice('Please write a comment before posting.', 'error')
      return
    }

    if (!currentUser) {
      showNotice('Please sign in to post a comment.', 'error')
      return
    }

    if (currentUser.role !== 'STUDENT') {
      showNotice('Only students can post in the student comments section.', 'error')
      return
    }

    setSubmittingComment(true)
    setMessage('')

    try {
      const res = await axios.post(`${API}/comment`, {
        message: comment.trim(),
        ideaId: idea.id,
        userId: currentUser?.id
      })

      const newComment = {
        ...res.data,
        userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Student',
        createdDate: res.data?.createdDate || new Date().toISOString()
      }

      setComments(prev => [...prev, newComment])
      setCommentCount(prev => prev + 1)
      setComment('')
      showNotice('Student comment posted successfully.', 'success')
    } catch {
      showNotice('Failed to post comment. Please try again.', 'error')
    } finally {
      setSubmittingComment(false)
    }
  }

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

  const totalComments = commentCount || idea.commentIds?.length || 0
  const totalFeedbacks = feedbackCount || idea.feedbackIds?.length || 0
  const totalVotes = voteCount || idea.voteIds?.length || 0

  const hasFeedback = feedbackList.length > 0
  const displayStatus = localIdeaStatus || idea.status || 'PENDING'
  const authorName =
    idea.userName ||
    (idea.user ? `${idea.user.firstName || ''} ${idea.user.lastName || ''}`.trim() : '') ||
    'Student'

  return (
    <div className="idea-modal-overlay" onClick={onClose}>
      <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Modal Header */}
        <div className="idea-modal-topbar">
          <div className="idea-modal-badges">
            <span className="idea-modal-category-badge">
              {formatCategory(idea.category)}
            </span>
            <span className={`idea-modal-status-badge status-${displayStatus.toLowerCase()}`}>
              {displayStatus.replace('_', ' ')}
            </span>
          </div>
          <button
            type="button"
            className="idea-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="idea-modal-content">
          {/* Title & Meta Info */}
          <div className="idea-modal-header">
            <h2 className="idea-modal-title">{idea.title}</h2>
            <div className="idea-modal-meta">
              {authorName && authorName !== 'System Admin' && authorName !== 'Admin' && (
                <span className="idea-meta-pill">
                  <i className="fas fa-user-graduate" />
                  <span>By <strong>{authorName}</strong></span>
                </span>
              )}
              <span className="idea-meta-pill">
                <i className="fas fa-thumbs-up" />
                <span><strong>{totalVotes}</strong> Votes</span>
              </span>
              <span className="idea-meta-pill">
                <i className="fas fa-chalkboard-teacher" />
                <span><strong>{totalFeedbacks}</strong> Lecturer Feedback</span>
              </span>
              <span className="idea-meta-pill">
                <i className="fas fa-comments" />
                <span><strong>{totalComments}</strong> Student Comments</span>
              </span>
            </div>
          </div>

          {/* Project Description */}
          <div className="idea-modal-description-box">
            <div className="idea-description-label">Project Description</div>
            <p className="idea-description-text">
              {idea.description || 'No description provided.'}
            </p>
          </div>

          {/* Action Bar: Voting (for Students) & Status Review (for Lecturers/Admins) */}
          <div className="idea-modal-action-bar">
            <div className="idea-vote-area">
              <button
                type="button"
                className="idea-modal-vote-btn"
                onClick={handleVote}
                disabled={!canVote() || voting}
              >
                <i className="fas fa-thumbs-up" />
                <span>
                  {voting
                    ? 'Voting...'
                    : hasVoted
                    ? 'Voted'
                    : canVote()
                    ? 'Vote for Project'
                    : currentUser?.role === 'STUDENT' && idea.userId === currentUser.id
                    ? 'Your Project'
                    : 'Votes'}
                </span>
                <span className="idea-vote-count-pill">{totalVotes}</span>
              </button>
              {currentUser && idea.userId === currentUser.id && (
                <span className="idea-vote-note">Authors cannot vote on their own project</span>
              )}
            </div>

            {canApproveReject() && (
              <div className="idea-review-actions">
                {hasFeedback && displayStatus !== 'APPROVED' && displayStatus !== 'REJECTED' && displayStatus !== 'IMPLEMENTED' && (
                  <>
                    <button
                      type="button"
                      className="idea-btn-approve"
                      onClick={() => updateIdeaStatus('APPROVED')}
                      disabled={updatingStatus}
                    >
                      <i className="fas fa-check" />
                      <span>{updatingStatus ? 'Updating...' : 'Approve Project'}</span>
                    </button>
                    <button
                      type="button"
                      className="idea-btn-reject"
                      onClick={() => updateIdeaStatus('REJECTED')}
                      disabled={updatingStatus}
                    >
                      <i className="fas fa-times" />
                      <span>{updatingStatus ? 'Updating...' : 'Reject Project'}</span>
                    </button>
                  </>
                )}
                {!hasFeedback && displayStatus !== 'APPROVED' && displayStatus !== 'REJECTED' && displayStatus !== 'IMPLEMENTED' && (
                  <span className="idea-review-hint">
                    Submit lecturer feedback first to enable Approve / Reject
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status Notice */}
          {message && (
            <div className={`idea-modal-alert idea-alert-${messageType}`}>
              {message}
            </div>
          )}

          {/* Filter Tabs for Responsive / Separated Viewing */}
          <div className="idea-feedback-tabs">
            <button
              type="button"
              className={`idea-feedback-tab ${activeTab === 'both' ? 'active' : ''}`}
              onClick={() => setActiveTab('both')}
            >
              All Feedback ({totalFeedbacks + totalComments})
            </button>
            <button
              type="button"
              className={`idea-feedback-tab lecturer-tab ${activeTab === 'lecturer' ? 'active' : ''}`}
              onClick={() => setActiveTab('lecturer')}
            >
              <i className="fas fa-chalkboard-teacher" />
              <span>Lecturer Feedback ({totalFeedbacks})</span>
            </button>
            <button
              type="button"
              className={`idea-feedback-tab student-tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              <i className="fas fa-user-graduate" />
              <span>Student Feedback ({totalComments})</span>
            </button>
          </div>

          {/* Separated Lecturer Feedback & Student Feedback Grid */}
          <div className={`idea-feedback-split-grid mode-${activeTab}`}>
            {/* Panel 1: Lecturer Feedback */}
            {(activeTab === 'both' || activeTab === 'lecturer') && (
              <div className="idea-feedback-panel panel-lecturer">
                <div className="idea-panel-header">
                  <div className="idea-panel-title-wrap">
                    <span className="idea-panel-icon lecturer">
                      <i className="fas fa-chalkboard-teacher" />
                    </span>
                    <div>
                      <h4 className="idea-panel-title">Lecturer Feedback</h4>
                      <p className="idea-panel-subtitle">Official faculty evaluation & guidance</p>
                    </div>
                  </div>
                  <span className="idea-panel-count lecturer">{totalFeedbacks}</span>
                </div>

                <div className="idea-panel-list">
                  {feedbackLoading ? (
                    <p className="idea-panel-empty">Loading lecturer feedback...</p>
                  ) : feedbackList.length === 0 ? (
                    <div className="idea-panel-empty">
                      No lecturer feedback has been submitted yet.
                    </div>
                  ) : (
                    feedbackList.map((fb, index) => (
                      <div key={fb.id || index} className="idea-entry-card lecturer-entry">
                        <div className="idea-entry-top">
                          <div className="idea-entry-author">
                            <span className="idea-entry-avatar lecturer">
                              {(fb.lecturerName || 'L').charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <span className="idea-entry-name">{fb.lecturerName || 'Lecturer'}</span>
                              <span className="idea-entry-role-tag lecturer">Lecturer</span>
                            </div>
                          </div>
                          <span className="idea-entry-date">{formatDate(fb.createdDate)}</span>
                        </div>
                        <p className="idea-entry-body">{fb.comment || fb.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {canGiveFeedback() ? (
                  <form onSubmit={handleFeedbackSubmit} className="idea-panel-form">
                    <textarea
                      className="idea-panel-textarea"
                      rows="3"
                      placeholder="Write academic review feedback as a lecturer..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="idea-panel-submit lecturer"
                      disabled={submittingFeedback}
                    >
                      {submittingFeedback ? 'Submitting...' : 'Submit Lecturer Feedback'}
                    </button>
                  </form>
                ) : (
                  <div className="idea-panel-footer-note">
                    Only faculty lecturers can post in this section.
                  </div>
                )}
              </div>
            )}

            {/* Panel 2: Student Feedback / Comments */}
            {(activeTab === 'both' || activeTab === 'student') && (
              <div className="idea-feedback-panel panel-student">
                <div className="idea-panel-header">
                  <div className="idea-panel-title-wrap">
                    <span className="idea-panel-icon student">
                      <i className="fas fa-comments" />
                    </span>
                    <div>
                      <h4 className="idea-panel-title">Student Feedback</h4>
                      <p className="idea-panel-subtitle">Peer discussion, questions & suggestions</p>
                    </div>
                  </div>
                  <span className="idea-panel-count student">{totalComments}</span>
                </div>

                <div className="idea-panel-list">
                  {commentLoading ? (
                    <p className="idea-panel-empty">Loading student comments...</p>
                  ) : comments.length === 0 ? (
                    <div className="idea-panel-empty">
                      No student comments yet. Start the discussion below.
                    </div>
                  ) : (
                    comments.map((c, i) => (
                      <div key={c.id || i} className="idea-entry-card student-entry">
                        <div className="idea-entry-top">
                          <div className="idea-entry-author">
                            <span className="idea-entry-avatar student">
                              {(c.userName || 'S').charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <span className="idea-entry-name">{c.userName || 'Student'}</span>
                              <span className="idea-entry-role-tag student">Student</span>
                            </div>
                          </div>
                          <span className="idea-entry-date">{formatDate(c.createdDate)}</span>
                        </div>
                        <p className="idea-entry-body">{c.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {canComment() ? (
                  <form onSubmit={handleCommentSubmit} className="idea-panel-form">
                    <textarea
                      className="idea-panel-textarea"
                      rows="2"
                      placeholder="Write a comment or suggestion as a student..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="idea-panel-submit student"
                      disabled={submittingComment}
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                ) : (
                  <div className="idea-panel-footer-note">
                    {currentUser ? 'Only students can post comments here.' : 'Sign in as a student to comment.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaModal
