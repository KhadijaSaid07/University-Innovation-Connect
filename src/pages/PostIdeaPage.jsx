import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PostIdeaPage = () => {
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  
  const goBack = () => {
    navigate('/dashboard')
  }

  
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

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title || !category || !description) {
      setMessage('⚠️ Please fill in all fields')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const loggedInUser = getLoggedInUser()
      
    
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch('http://localhost:8080/api/ideas', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     title: title,
      //     category: category,
      //     description: description,
      //     author: loggedInUser?.name || 'Anonymous',
      //     authorReg: loggedInUser?.idNumber || '',
      //     date: new Date().toLocaleString()
      //   })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to post idea')
      // }
      // 
      // const data = await response.json()
     
     
      const newIdea = {
        id: Date.now(),
        title: title,
        category: category,
        description: description,
        author: loggedInUser?.name || 'Anonymous',
        authorReg: loggedInUser?.idNumber || '',
        date: new Date().toLocaleString(),
        votes: 0,
        comments: 0,
        status: 'Pending'
      }

     
      const existingIdeas = JSON.parse(localStorage.getItem('ideas') || '[]')
      existingIdeas.unshift(newIdea) // Add to beginning
      localStorage.setItem('ideas', JSON.stringify(existingIdeas))

      setMessage('✅ Your idea was posted successfully! 🎉')
      setMessageType('success')
      setTitle('')
      setCategory('')
      setDescription('')
      setLoading(false)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error:', error)
      setMessage('❌ Something went wrong. Please try again.')
      setMessageType('error')
      setLoading(false)
    }
  }


  const clearForm = () => {
    setTitle('')
    setCategory('')
    setDescription('')
    setMessage('')
    setMessageType('')
  }

  return (
    <div className="container-fluid">
      
    
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">💡 Post Your Idea</h1>
        <button onClick={goBack} className="btn btn-primary btn-sm">
          ← Back to Dashboard
        </button>
      </div>

     
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              
           
              <div className="text-center mb-4">
                <div style={{ fontSize: '3.5rem' }}>🚀</div>
                <h3 className="text-primary font-weight-bold">Share Your Innovation</h3>
                <p className="text-muted">
                  Every great solution starts with an idea. Yours could be next.
                </p>
              </div>

            
              {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
               
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
                    type="button"
                    className="btn btn-secondary btn-lg px-4 ml-2"
                    onClick={clearForm}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </form>

              
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