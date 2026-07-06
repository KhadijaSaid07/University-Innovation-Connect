import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PostIdeaPage = () => {
  const navigate = useNavigate()
  
  // Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (!title || !category || !description) {
      setMessage('⚠️ Please fill in all fields')
      return
    }

    setLoading(true)
    setMessage('')

    // Simulate posting to database
    setTimeout(() => {
      setMessage('✅ Your idea was posted successfully! 🎉')
      setTitle('')
      setCategory('')
      setDescription('')
      setLoading(false)
      
      // Go back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }, 1500)
  }

  // Go back to dashboard
  const goBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="container-fluid">
      
      {/* Header with Back Button */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">💡 Post Your Idea</h1>
        <button 
          onClick={goBack} 
          className="btn btn-sm btn-secondary"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Form Card */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              
              {/* Motivational Header */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '3.5rem' }}>🚀</div>
                <h3 className="text-primary font-weight-bold">Share Your Innovation</h3>
                <p className="text-muted">
                  Every great solution starts with an idea. Yours could be next.
                </p>
              </div>

              {/* Success or Error Message */}
              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Title */}
                <div className="form-group">
                  <label className="font-weight-bold">📌 Idea Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's your idea? Give it a clear title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <small className="text-muted">Example: Solar-powered Water Filter for Rural Villages</small>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="font-weight-bold">🏷️ Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category...</option>
                    <option>🌊 Blue Economy</option>
                    <option>🌾 Agriculture</option>
                    <option>🏥 Health</option>
                    <option>💰 Fintech</option>
                    <option>🎓 Education</option>
                    <option>🏖️ Tourism</option>
                    <option>♻️ Waste Management</option>
                    <option>⚡ Renewable Energy</option>
                    <option>💧 Water & Hygiene</option>
                    <option>🚍 Transportation</option>
                    <option>🌿 Environment</option>
                    <option>👥 Social Impact</option>
                    <option>💡 General Technology</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="font-weight-bold">📝 Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Describe your idea in detail... What problem does it solve? How does it work? Who will benefit?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <small className="text-muted">Be clear and specific so others can understand your vision</small>
                </div>

                {/* Submit & Clear Buttons */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" />
                        Posting...
                      </>
                    ) : (
                      '🚀 Post Idea'
                    )}
                  </button>
                  
                  <button
                    type="reset"
                    className="btn btn-secondary btn-lg px-4 ml-2"
                    onClick={() => {
                      setTitle('')
                      setCategory('')
                      setDescription('')
                      setMessage('')
                    }}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </form>

              {/* Motivational Quote */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted font-italic">
                  💡 "The best way to predict the future is to create it."
                </p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostIdeaPage