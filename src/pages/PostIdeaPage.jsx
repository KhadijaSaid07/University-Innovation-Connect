import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8080/api/v2/innovationConnect'

const PostIdeaPage = () => {
  const navigate = useNavigate()
  
  // Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/idea/categories`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          // If API returns object with categories array
          if (data.categories && Array.isArray(data.categories)) {
            setCategories(data.categories)
          } else {
            // Fallback categories
            setCategories([
              'AGRICULTURE', 'EDUCATION', 'HEALTH', 'TECHNOLOGY',
              'ENVIRONMENT', 'BUSINESS', 'FINANCE', 'SECURITY',
              'TRANSPORTATION', 'WATER_AND_HYGIENE', 'TOURISM',
              'BLUE_ECONOMY', 'RENEWABLE_ENERGY', 'FINTECH', 'OTHERS'
            ])
          }
        }
      } catch {
        // Fallback categories if API fails
        setCategories([
          'AGRICULTURE', 'EDUCATION', 'HEALTH', 'TECHNOLOGY',
          'ENVIRONMENT', 'BUSINESS', 'FINANCE', 'SECURITY',
          'TRANSPORTATION', 'WATER_AND_HYGIENE', 'TOURISM',
          'BLUE_ECONOMY', 'RENEWABLE_ENERGY', 'FINTECH', 'OTHERS'
        ])
      } finally {
        setFetching(false)
      }
    }
    fetchCategories()
  }, [])

  // Get user from localStorage
  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  // Submit idea
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title || !category || !description) {
      setMessage('Please fill in all fields')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const user = getUser()
      const token = localStorage.getItem('token')
      
      // FIX: Use the correct endpoint and data format
      const res = await fetch(`${API}/idea`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: category,
          userId: user?.id  // FIX: Use userId (not user_id)
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to post')
      }

      setMessage('✅ Idea posted successfully!')
      setTitle('')
      setCategory('')
      setDescription('')
      
      setTimeout(() => navigate('/dashboard'), 1500)

    } catch (error) {
      setMessage('❌ Failed to post idea: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Get category emoji
  const getEmoji = (cat) => {
    const map = {
      'AGRICULTURE': '🌾', 'EDUCATION': '🎓', 'HEALTH': '🏥',
      'TECHNOLOGY': '💡', 'ENVIRONMENT': '🌿', 'BUSINESS': '💼',
      'FINANCE': '💰', 'SECURITY': '🔒', 'TRANSPORTATION': '🚍',
      'WATER_AND_HYGIENE': '💧', 'TOURISM': '🏖️',
      'BLUE_ECONOMY': '🌊', 'RENEWABLE_ENERGY': '⚡',
      'FINTECH': '📱', 'OTHERS': '📌'
    }
    return map[cat] || '📌'
  }

  // Format category name
  const formatCategory = (cat) => {
    if (!cat) return ''
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  // Show loading while fetching categories
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
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">💡 Post Your Idea</h1>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm">
          ← Back
        </button>
      </div>

      {/* Form */}
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
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                  <label>📌 Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's your idea?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🏷️ Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {getEmoji(cat)} {formatCategory(cat)}
                        </option>
                      ))
                    ) : (
                      <option value="">No categories available</option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>📝 Description</label>
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
                    {loading ? 'Posting...' : '🚀 Post Idea'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg px-4 ml-2"
                    onClick={() => {
                      setTitle('')
                      setCategory('')
                      setDescription('')
                      setMessage('')
                    }}
                  >
                    Clear
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