import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LecturerLeaderboardPage.css'

const LecturerLeaderboardPage = () => {
  const navigate = useNavigate()
  

  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [lecturer, setLecturer] = useState({ name: '' })

 
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

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUser = getLoggedInUser()
        setLecturer({ name: loggedInUser?.name || 'Lecturer' })
        
       
        // const token = localStorage.getItem('token')
        // 
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
        
        // For now 
        setIdeas([])
        setLoading(false)
        
      } catch (err) {
        console.error('Error:', err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

 
  const goBack = () => {
    navigate('/lecturer-dashboard')
  }


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

 
  if (loading) {
    return (
      <div className="lecturer-leaderboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading leaderboard...</p>
      </div>
    )
  }

 
  return (
    <div className="lecturer-leaderboard-page">
      
    
      <header className="lecturer-leaderboard-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Leaderboard</span>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </header>

     
      <div className="lecturer-leaderboard-content">
        <div className="leaderboard-container">
          
        
          <div className="leaderboard-header">
            <h1>🏆 Top Student Ideas</h1>
            <p>Ideas with the most votes from students</p>
          </div>

       
          <div className="leaderboard-card">
            
            {ideas.length === 0 ? (
          
              <div className="empty-state">
                <div style={{ fontSize: '4rem' }}>🏆</div>
                <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
                <p className="text-muted">
                  Ideas will appear here once students start posting and voting.
                </p>
                <button className="btn-back-dash" onClick={goBack}>
                  ← Back to Dashboard
                </button>
              </div>
            ) : (
             
              <div className="table-responsive">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Title</th>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Votes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map((idea, index) => (
                      <tr key={idea.id} className={getRankClass(index)}>
                        <td>
                          <span className="rank-badge">{getRankBadge(index)}</span>
                        </td>
                        <td>{idea.title}</td>
                        <td>{idea.author}</td>
                        <td>{idea.category}</td>
                        <td>
                          <span className="badge-votes">⭐ {idea.votes || 0}</span>
                        </td>
                        <td>
                          <Link to={`/lecturer-idea/${idea.id}`} className="btn-view-idea">
                            <i className="fas fa-eye" /> Review
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

      
      <aside className="lecturer-leaderboard-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link active">
              <i className="fas fa-trophy" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/lecturer-profile" className="sidebar-link">
              <i className="fas fa-user" />
              <span>Profile</span>
            </Link>
            <button className="sidebar-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

    </div>
  )
}

export default LecturerLeaderboardPage