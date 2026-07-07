import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LeaderboardPage.css'

const LeaderboardPage = () => {
  const navigate = useNavigate()
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        
        // const token = localStorage.getItem('token')
        // 
        // // Fetch all ideas sorted by votes (descending)
        // const response = await fetch('http://localhost:8080/api/ideas/leaderboard', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch leaderboard')
        // }
        // 
        // const data = await response.json()
        // setIdeas(data)
        // setLoading(false)
        
        // For now - empty state (will come from database)
        setIdeas([])
        setLoading(false)

      } catch (err) {
        console.error('Error:', err)
        setError('Could not load leaderboard')
        setLoading(false)
      }
    }
    
    fetchLeaderboard()
  }, [])

 
  const goBack = () => {
    navigate('/dashboard')
  }


  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

 
  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

 
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading leaderboard...</p>
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
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      
   
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          🏆 Leaderboard
        </h1>
        <button 
          onClick={goBack} 
          className="btn btn-sm btn-secondary"
        >
           Back to Dashboard
        </button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                🏆 Top Ideas by Votes
              </h6>
            </div>
            <div className="card-body">
              {ideas.length === 0 ? (
               
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem' }}>🏆</div>
                  <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
                  <p className="text-muted">
                    Ideas will appear here once people start voting.
                  </p>
                  <button 
                    className="btn btn-primary mt-2"
                    onClick={() => navigate('/post-idea')}
                  >
                    🚀 Post Your First Idea
                  </button>
                </div>
              ) : (
                /* LEADERBOARD TABLE */
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Votes</th>
                        <th>Comments</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea, index) => (
                        <tr key={idea.id} className={getRankClass(index)}>
                          <td>
                            <span style={{ fontSize: '1.5rem' }}>
                              {getRankBadge(index)}
                            </span>
                          </td>
                          <td>
                            <Link to={`/idea/${idea.id}`} className="text-primary">
                              {idea.title}
                            </Link>
                          </td>
                          <td>{idea.category}</td>
                          <td>{idea.author}</td>
                          <td>
                            <span className="badge badge-success">
                              ⭐ {idea.votes || 0}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-info">
                              💬 {idea.comments || 0}
                            </span>
                          </td>
                          <td>
                            <Link to={`/idea/${idea.id}`} className="btn btn-sm btn-primary">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage