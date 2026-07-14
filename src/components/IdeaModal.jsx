import React, { useState } from 'react'
import './IdeaModal.css'

const IdeaModal = ({ idea, onClose, onVote, onFeedback }) => {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  if (!idea) return null

  const handleVote = () => {
    onVote(idea.id)
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedback.trim()) {
      setMessage('⚠️ Please write your feedback')
      return
    }
    setSubmitting(true)
    onFeedback(idea.id, feedback, () => {
      setFeedback('')
      setSubmitting(false)
      setMessage('✅ Feedback submitted successfully!')
      setTimeout(() => setMessage(''), 3000)
    })
  }

  return (
    <div className="idea-modal-overlay" onClick={onClose}>
      <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="idea-modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <div className="idea-modal-content">
          
          <div className="idea-modal-header">
            <span className="idea-modal-category">{idea.category}</span>
            <h2>{idea.title}</h2>
            <div className="idea-modal-meta">
              <span>👤 <strong>{idea.author}</strong> {idea.authorReg && `(${idea.authorReg})`}</span>
              <span>📅 {idea.date}</span>
              <span>⭐ {idea.votes || 0} votes</span>
            </div>
          </div>

          <div className="idea-modal-body">
            <h4>📝 Description</h4>
            <p>{idea.description}</p>
          </div>

          <div className="idea-modal-actions">
            <button className="idea-modal-vote-btn" onClick={handleVote}>
              👍 Upvote ({idea.votes || 0})
            </button>
          </div>

          {message && (
            <div className={`idea-modal-alert ${message.includes('✅') ? 'idea-modal-success' : 'idea-modal-warning'}`}>
              {message}
            </div>
          )}

          <div className="idea-modal-feedback">
            <h4>👨‍🏫 Feedback</h4>
            {idea.feedback ? (
              <div className="idea-modal-feedback-existing">
                <p>{idea.feedback}</p>
                <small>Feedback submitted</small>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  className="idea-modal-textarea"
                  rows="3"
                  placeholder="Write your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button type="submit" className="idea-modal-feedback-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : '📤 Submit Feedback'}
                </button>
              </form>
            )}
          </div>

          <div className="idea-modal-comments">
            <h4>💬 Comments ({idea.comments || 0})</h4>
            {idea.commentsList && idea.commentsList.length > 0 ? (
              idea.commentsList.map((comment, index) => (
                <div key={index} className="idea-modal-comment">
                  <strong>{comment.author}</strong>
                  <small>{comment.date}</small>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="idea-modal-no-comments">No comments yet</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default IdeaModal