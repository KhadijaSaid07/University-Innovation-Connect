import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const categoryOptions = [
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HEALTH', label: 'Health & Healthcare' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'ENVIRONMENT', label: 'Environment' },
  { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy' },
  { value: 'FINTECH', label: 'FinTech' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'WATER_AND_HYGIENE', label: 'Water & Hygiene' },
  { value: 'BLUE_ECONOMY', label: 'Blue Economy' },
  { value: 'TOURISM', label: 'Tourism' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'OTHERS', label: 'Others' }
]

const PostIdeaPage = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const getUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try { return JSON.parse(data) } catch { return null }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !category || !description.trim()) {
      setMessage('Please fill in all fields.')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const user = getUser()

      if (!user) {
        setMessage('Please login to post an idea.')
        setMessageType('error')
        setLoading(false)
        return
      }

      if (user.role !== 'STUDENT') {
        setMessage('Only students can post ideas.')
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

      const res = await axios.post(`${API}/idea`, requestData)

      if (res.data) {
        setMessage('Idea posted successfully.')
        setMessageType('success')
        setTitle('')
        setCategory('')
        setDescription('')

        setTimeout(() => {
          navigate('/dashboard')
        }, 1200)
      }
    } catch (error) {
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

      setMessage(errorMsg)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="uic-centered-page">
      <div className="uic-form-card">
        <div className="uic-form-card-header">
          <div>
            <h2 className="uic-form-card-title">Post an Idea</h2>
            <p className="uic-form-card-subtitle">
              Share your project idea with students and lecturers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="uic-btn-secondary"
          >
            <i className="fas fa-arrow-left" />
            <span>Back</span>
          </button>
        </div>

        {message && (
          <div className={`uic-alert ${messageType === 'success' ? 'uic-alert-success' : 'uic-alert-error'}`}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="uic-proposal-form">
          <div className="uic-field-group">
            <label className="uic-field-label" htmlFor="idea-title">
              Title
            </label>
            <input
              id="idea-title"
              type="text"
              className="uic-input"
              placeholder="Enter idea title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="uic-field-group">
            <label className="uic-field-label" htmlFor="idea-category">
              Category
            </label>
            <select
              id="idea-category"
              className="uic-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category...</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="uic-field-group">
            <label className="uic-field-label" htmlFor="idea-description">
              Description
            </label>
            <textarea
              id="idea-description"
              className="uic-textarea"
              rows="5"
              maxLength={250}
              placeholder="Describe the problem your idea solves and how it works..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="uic-form-actions">
            <button
              type="button"
              className="uic-btn-ghost"
              onClick={() => {
                setTitle('')
                setCategory('')
                setDescription('')
                setMessage('')
                setMessageType('')
              }}
              disabled={loading}
            >
              Clear
            </button>

            <button
              type="submit"
              className="uic-btn-primary"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostIdeaPage
