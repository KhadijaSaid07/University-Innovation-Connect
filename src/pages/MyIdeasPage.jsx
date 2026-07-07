import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MyIdeasPage = () => {
  const navigate = useNavigate()
  
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    totalVotes: 0,
    totalComments: 0
  })


  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
   
        // const token = localStorage.getItem('token')
        // 
        // // Fetch user's ideas from backend
        // const response = await fetch('http://localhost:8080/api/ideas/my-ideas', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch your ideas')
        // }
        // 
        // const data = await response.json()
        // setIdeas(data)
        // 
        // // Calculate stats
        // const totalVotes = data.reduce((sum, idea) => sum + (idea.votes || 0), 0)
        // const totalComments = data.reduce((sum, idea) => sum + (idea.comments || 0), 0)
        // 
        // setStats({
        //   total: data.length,
        //   totalVotes: totalVotes,
        //   totalComments: totalComments
        // })
        // 
        // setLoading(false)


      
        setIdeas([])
        setStats({
          total: 0,
          totalVotes: 0,
          totalComments: 0
        })
        setLoading(false)

      } catch (err) {
        console.error('Error:', err)
        setError('Could not load your ideas')
        setLoading(false)
      }
    }
    
    fetchMyIdeas()
  }, [])

  
  const goToPostIdea = () => {
    navigate('/post-idea')
  }

  
  const goBack = () => {
    navigate('/')
  }

 
  const deleteIdea = async (id) => {
    if (!window.confirm('Are you sure you want to delete this idea?')) {
      return
    }

    try {
  
      // const token = localStorage.getItem('token')
      // 
      // const response = await fetch(`http://localhost:8080/api/ideas/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to delete idea')
      // }
      // 
      // // Remove from state
      // const updatedIdeas = ideas.filter(idea => idea.id !== id)
      // setIdeas(updatedIdeas)
      // 
      // // Update stats
      // const totalVotes = updatedIdeas.reduce((sum, idea) => sum + (idea.votes || 0), 0)
      // const totalComments = updatedIdeas.reduce((sum, idea) => sum + (idea.comments || 0), 0)
      // 
      // setStats({
      //   total: updatedIdeas.length,
      //   totalVotes: totalVotes,
      //   totalComments: totalComments
      // })
  

     
      const updatedIdeas = ideas.filter(idea => idea.id !== id)
      setIdeas(updatedIdeas)
      
      const totalVotes = updatedIdeas.reduce((sum, idea) => sum + (idea.votes || 0), 0)
      const totalComments = updatedIdeas.reduce((sum, idea) => sum + (idea.comments || 0), 0)
      
      setStats({
        total: updatedIdeas.length,
        totalVotes: totalVotes,
        totalComments: totalComments
      })

    } catch (err) {
      console.error('Error:', err)
      alert('Could not delete idea')
    }
  }


  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading your ideas...</p>
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
          📁 My Ideas
        </h1>
        <div>
          <button 
            onClick={goBack} 
            className="btn btn-sm btn-secondary mr-2"
          >
             Back
          </button>
          <button 
            onClick={goToPostIdea} 
            className="btn btn-sm btn-primary"
          >
            <i className="fas fa-plus fa-sm text-white-50" /> New Idea
          </button>
        </div>
      </div>

      <div className="row">
        {/* Total My Ideas */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    💡 My Ideas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.total}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-lightbulb fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    ⭐ Total Votes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalVotes}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-star fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    💬 Total Comments
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalComments}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                📝 Ideas You've Posted
              </h6>
            </div>
            <div className="card-body">
              {ideas.length === 0 ? (
               
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem' }}>📭</div>
                  <h5 className="text-gray-800 mt-3">No Ideas Yet</h5>
                  <p className="text-muted">
                    You haven't posted any ideas yet.
                  </p>
                  <button 
                    className="btn btn-primary mt-2"
                    onClick={goToPostIdea}
                  >
                    🚀 Post Your First Idea
                  </button>
                </div>
              ) : (
               
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Votes</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea, index) => (
                        <tr key={idea.id}>
                          <td>{index + 1}</td>
                          <td>
                            <Link to={`/idea/${idea.id}`} className="text-primary">
                              {idea.title}
                            </Link>
                          </td>
                          <td>{idea.category}</td>
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
                          <td>{idea.date || 'Just now'}</td>
                          <td>
                            <Link 
                              to={`/idea/${idea.id}`} 
                              className="btn btn-sm btn-primary mr-1"
                            >
                              View
                            </Link>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteIdea(idea.id)}
                            >
                              Delete
                            </button>
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

export default MyIdeasPage