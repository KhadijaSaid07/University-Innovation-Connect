import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const categoryOptions = [
  { value: 'TECHNOLOGY', label: 'Technology & Software', icon: 'fas fa-microchip' },
  { value: 'EDUCATION', label: 'Education & E-Learning', icon: 'fas fa-graduation-cap' },
  { value: 'HEALTH', label: 'Health & Healthcare', icon: 'fas fa-heartbeat' },
  { value: 'AGRICULTURE', label: 'Agriculture & Food Security', icon: 'fas fa-seedling' },
  { value: 'ENVIRONMENT', label: 'Environment & Climate', icon: 'fas fa-leaf' },
  { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy', icon: 'fas fa-solar-panel' },
  { value: 'FINTECH', label: 'FinTech & Digital Payments', icon: 'fas fa-wallet' },
  { value: 'BUSINESS', label: 'Business & Entrepreneurship', icon: 'fas fa-briefcase' },
  { value: 'FINANCE', label: 'Finance & Economics', icon: 'fas fa-chart-line' },
  { value: 'TRANSPORTATION', label: 'Transportation & Logistics', icon: 'fas fa-shuttle-van' },
  { value: 'WATER_AND_HYGIENE', label: 'Water & Sanitation', icon: 'fas fa-tint' },
  { value: 'BLUE_ECONOMY', label: 'Blue Economy & Marine', icon: 'fas fa-water' },
  { value: 'TOURISM', label: 'Tourism & Hospitality', icon: 'fas fa-compass' },
  { value: 'SECURITY', label: 'Cyber & Physical Security', icon: 'fas fa-shield-alt' },
  { value: 'OTHERS', label: 'Other Innovation', icon: 'fas fa-lightbulb' }
]

const quickCategories = ['TECHNOLOGY', 'EDUCATION', 'HEALTH', 'AGRICULTURE', 'ENVIRONMENT', 'FINTECH']

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
      setMessage('Please complete all required fields before submitting.')
      setMessageType('error')
      return
    }

    if (description.trim().length > 250) {
      setMessage('Please keep your summary description under 250 characters.')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const user = getUser()

      if (!user) {
        setMessage('Please sign in to submit an idea.')
        setMessageType('error')
        setLoading(false)
        return
      }

      if (user.role !== 'STUDENT') {
        setMessage('Only student accounts can submit new ideas.')
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
        setMessage('Your idea has been submitted successfully. Redirecting to your ideas...')
        setMessageType('success')
        setTitle('')
        setCategory('')
        setDescription('')

        setTimeout(() => {
          navigate('/my-ideas')
        }, 1400)
      }
    } catch (error) {
      let errorMsg = 'Failed to submit idea. Please try again.'
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid submission details. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMsg = 'Please sign in to submit an idea.'
      } else if (error.response?.status === 403) {
        errorMsg = 'Only students can submit ideas.'
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
            <span className="uic-section-eyebrow">New Proposal</span>
            <h2 className="uic-form-card-title">Submit an Innovation Idea</h2>
            <p className="uic-form-card-subtitle">
              Present a clear problem statement and proposed solution for faculty review and student voting.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="uic-btn-secondary"
          >
            <i className="fas fa-arrow-left" />
            <span>Back to Feed</span>
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
              Proposal Title <span className="uic-required">*</span>
            </label>
            <input
              id="idea-title"
              type="text"
              className="uic-input"
              placeholder="e.g., Smart Campus Solar Microgrid Monitoring"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <span className="uic-field-hint">
              Keep your title concise and descriptive ({title.length}/120 characters).
            </span>
          </div>

          <div className="uic-field-group">
            <label className="uic-field-label" htmlFor="idea-category">
              Innovation Domain / Category <span className="uic-required">*</span>
            </label>

            <div className="uic-category-pills">
              {quickCategories.map((catValue) => {
                const catObj = categoryOptions.find((c) => c.value === catValue)
                const isSelected = category === catValue
                return (
                  <button
                    key={catValue}
                    type="button"
                    className={`uic-category-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setCategory(catValue)}
                  >
                    <i className={catObj?.icon || 'fas fa-tag'} />
                    <span>{catObj?.label || catValue}</span>
                  </button>
                )
              })}
            </div>

            <select
              id="idea-category"
              className="uic-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category from all domains...</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="uic-field-group">
            <div className="uic-label-row">
              <label className="uic-field-label" htmlFor="idea-description">
                Proposal Summary & Impact <span className="uic-required">*</span>
              </label>
              <span className={`uic-char-counter ${description.length > 230 ? 'warn' : ''}`}>
                {description.length}/250
              </span>
            </div>
            <textarea
              id="idea-description"
              className="uic-textarea"
              rows="5"
              maxLength={250}
              placeholder="Describe the core problem, how your proposed solution works, and who benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <span className="uic-field-hint">
              Summarize the problem, methodology, and expected university or community impact.
            </span>
          </div>

          <div className="uic-guidelines-box">
            <div className="uic-guidelines-title">
              <i className="fas fa-info-circle" />
              <span>Submission Guidelines</span>
            </div>
            <ul className="uic-guidelines-list">
              <li>New proposals start in <strong>Pending</strong> status and are visible to students and faculty.</li>
              <li>Lecturers can provide structured academic feedback and approve proposals for implementation.</li>
              <li>You can edit or refine your proposal anytime while it is Pending or Under Review.</li>
            </ul>
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
              Reset Form
            </button>

            <button
              type="submit"
              className="uic-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" />
                  <span>Submit Proposal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostIdeaPage
