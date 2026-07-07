import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const IdeaDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  

  const [idea, setIdea] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

 
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {

        // const token = localStorage.getItem('token')
        // 
        // // 1. Fetch idea details
        // const ideaResponse = await fetch(`http://localhost:8080/api/ideas/${id}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // if (!ideaResponse.ok) {
        //   throw new Error('Idea not found')
        // }
        // 
        // const ideaData = await ideaResponse.json()
        // setIdea(ideaData)
        // 
        // // 2. Check if user already voted
        // const voteResponse = await fetch(`http://localhost:8080/api/ideas/${id}/has-voted`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // })
        // const voteData = await voteResponse.json()
        // setHasVoted(voteData.hasVoted)
        // 
        // // 3. Fetch comments
        // const commentsResponse = await fetch(`http://localhost:8080/api/ideas/${id}/comments`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // const commentsData = await commentsResponse.json()
        // setComments(commentsData)
        // 
        // setLoading(false)
   

      
        setIdea(null)
        setComments([])
        setHasVoted(false)
        setLoading(false)

      } catch (err) {
        console.error('Error:', err)
        setError('Could not load idea details')
        setLoading(false)
      }
    }
    
    fetchIdeaDetails()
  }, [id])


  const handleVote = async () => {
    // Check if already voted
    if (hasVoted) {
      setMessage('⚠️ You already voted for this idea!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    try {
    
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch(`http://localhost:8080/api/ideas/${id}/vote`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to vote')
      // }
      // 
      // const updatedIdea = await response.json()
      // setIdea(updatedIdea)
      // setHasVoted(true)
      // setMessage('✅ You voted for this idea!')
      // setTimeout(() => setMessage(''), 3000)
      // =============================================
      // REMOVE THIS COMMENT WHEN API IS READY
      // =============================================

      setMessage('⚠️ Voting will work when API is connected')
      setTimeout(() => setMessage(''), 3000)

    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Could not vote. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  
  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      setMessage('⚠️ Please write a comment')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
   
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch(`http://localhost:8080/api/ideas/${id}/comments`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     content: newComment
      //   })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to post comment')
      // }
      // 
      // const commentData = await response.json()
      // setComments([...comments, commentData])
      // setNewComment('')
      // setMessage('✅ Comment posted successfully!')
      // setTimeout(() => setMessage(''), 3000)


      setMessage('⚠️ Comments will work when API is connected')
      setTimeout(() => setMessage(''), 3000)

    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Could not post comment. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSubmitting(false)
    }
  }


  const goBack = () => {
    navigate('/dashboard')
  }


  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading idea details...</p>
      </div>
    )
  }

 
  if (error) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h5 className="text-danger mt-3">{error}</h5>
        <button 
          className="btn btn-primary mt-3"
          onClick={goBack}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '4rem' }}>📭</div>
        <h5 className="text-gray-800 mt-3">No Idea Found</h5>
        <p className="text-muted">
          The idea you're looking for doesn't exist or has been removed.
        </p>
        <button 
          className="btn btn-primary mt-3"
          onClick={goBack}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }


  return (
    <div className="container-fluid">
      
    
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">📋 Idea Details</h1>
        <button 
          onClick={goBack} 
          className="btn btn-sm btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              
          
              <div className="mb-2">
                <span className="badge badge-primary" style={{ fontSize: '0.9rem' }}>
                  {idea.category}
                </span>
              </div>

              
              <h2 className="font-weight-bold text-gray-800">{idea.title}</h2>

              {/* Author & Date */}
              <div className="text-muted small mb-3">
                <i className="fas fa-user" /> {idea.author} {idea.authorReg && `(${idea.authorReg})`} &nbsp;
                <i className="fas fa-calendar" /> {idea.date}
              </div>

              
              <div className="bg-light p-3 rounded mb-3">
                <h6 className="font-weight-bold">📝 Description</h6>
                <p className="mb-0">{idea.description}</p>
              </div>

              
              <div className="text-center mb-3">
                <button 
                  className={`btn ${hasVoted ? 'btn-secondary' : 'btn-success'} btn-lg px-5`}
                  onClick={handleVote}
                  disabled={hasVoted}
                >
                  {hasVoted ? '✅ Voted' : '👍 Upvote'} ({idea.votes || 0})
                </button>
                {hasVoted && (
                  <p className="text-muted small mt-2">You already voted for this idea</p>
                )}
              </div>

              
              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('⚠️') ? 'alert-warning' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}
            </div>
          </div>

         
          {idea.feedback && (
            <div className="card shadow mb-4 border-left-warning">
              <div className="card-header bg-warning text-white">
                <h6 className="mb-0 font-weight-bold">
                  👨‍🏫 Lecturer Feedback
                </h6>
              </div>
              <div className="card-body">
                <p className="mb-0">{idea.feedback}</p>
              </div>
            </div>
          )}

         
          <div className="card shadow mb-4">
            <div className="card-header">
              <h6 className="mb-0 font-weight-bold text-primary">
                💬 Comments ({comments.length})
              </h6>
            </div>
            <div className="card-body">
              
              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-muted">No comments yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{comment.author} {comment.authorReg && `(${comment.authorReg})`}</strong>
                      <small className="text-muted">{comment.date}</small>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                ))
              )}

            
              <form onSubmit={handleComment} className="mt-3">
                <div className="form-group">
                  <label className="font-weight-bold">Add a Comment</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Posting...
                    </>
                  ) : (
                    '📤 Post Comment'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header">
              <h6 className="mb-0 font-weight-bold text-primary">📊 Quick Info</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="font-weight-bold">Author</label>
                <p>{idea.author}</p>
              </div>
              {idea.authorReg && (
                <div className="mb-3">
                  <label className="font-weight-bold">Registration</label>
                  <p>{idea.authorReg}</p>
                </div>
              )}
              <div className="mb-3">
                <label className="font-weight-bold">Total Votes</label>
                <p>⭐ {idea.votes || 0}</p>
              </div>
              <div className="mb-3">
                <label className="font-weight-bold">Total Comments</label>
                <p>💬 {comments.length}</p>
              </div>
              <div>
                <label className="font-weight-bold">Posted On</label>
                <p>{idea.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetailsPage