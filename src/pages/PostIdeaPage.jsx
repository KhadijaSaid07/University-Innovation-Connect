import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = '/api/v2/innovationConnect'

const PostIdeaPage = () => {
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // ALL CATEGORIES from IdeaCategory enum - will be shown
  const allCategories = [
    'AGRICULTURE', 'EDUCATION', 'HEALTHCARE', 'TECHNOLOGY',
    'ENVIRONMENT', 'BUSINESS', 'FINANCE', 'SECURITY',
    'TRANSPORTATION', 'WATER_AND_HYGIENE', 'TOURISM',
    'BLUE_ECONOMY', 'RENEWABLE_ENERGY', 'FINTECH', 'OTHERS'
  ]

  useEffect(() => {
    // Always show all categories
    setCategories(allCategories)
    setFetching(false)
  }, [])

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
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
      const user = getUser()
      
      if (!user) {
        setMessage('⚠️ Please login to post an idea')
        setMessageType('error')
        setLoading(false)
        return
      }
      
      if (user.role !== 'STUDENT') {
        setMessage('⚠️ Only students can post ideas!')
        setMessageType('error')
        setLoading(false)
        return
      }

      const requestData = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        userId: user.id
      }

      console.log('📤 Posting idea:', requestData)
      
      const res = await axios.post(`${API}/idea`, requestData)

      console.log('✅ Response:', res.data)

      if (res.data) {
        setMessage('✅ Idea posted successfully! 🎉')
        setMessageType('success')
        setTitle('')
        setCategory('')
        setDescription('')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }

    } catch (error) {
      console.error('❌ Post error:', error)
      console.error('Response:', error.response?.data)
      
      let errorMsg = 'Failed to post idea. Please try again.'
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid data. Please check your input.'
      } else if (error.response?.status === 401) {
        errorMsg = 'Please login to post an idea.'
      } else if (error.response?.status === 403) {
        errorMsg = 'Only students can post ideas.'
      }
      
      setMessage(`❌ ${errorMsg}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const getEmoji = (cat) => {
    const map = {
      'AGRICULTURE': '🌾',
      'EDUCATION': '📚',
      'HEALTHCARE': '🏥',
      'TECHNOLOGY': '💻',
      'ENVIRONMENT': '🌿',
      'BUSINESS': '💼',
      'FINANCE': '💰',
      'SECURITY': '🛡️',
      'TRANSPORTATION': '🚍',
      'WATER_AND_HYGIENE': '💧',
      'TOURISM': '🏖️',
      'BLUE_ECONOMY': '🌊',
      'RENEWABLE_ENERGY': '⚡',
      'FINTECH': '📱',
      'OTHERS': '📌'
    }
    return map[cat] || '📌'
  }

  const formatCategory = (cat) => {
    if (!cat) return ''
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">💡 Post Your Idea</h1>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm">
          ← Back
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🚀</div>
                <h3 className="text-primary">Share Your Innovation</h3>
                <p className="text-muted">Every great solution starts with an idea</p>
              </div>

              {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">📌 Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's your idea?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">🏷️ Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getEmoji(cat)} {formatCategory(cat)}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">Choose a category that best fits your idea</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">📝 Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Describe your idea in detail... What problem does it solve? How does it work? Who will benefit?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Posting...
                      </>
                    ) : (
                      '🚀 Post Idea'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg px-4 ms-2"
                    onClick={() => {
                      setTitle('')
                      setCategory('')
                      setDescription('')
                      setMessage('')
                      setMessageType('')
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted fst-italic">
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