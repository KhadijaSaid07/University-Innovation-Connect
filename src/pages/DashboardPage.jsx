import React, { useState, useEffect } from 'react'

const DashboardPage = () => {
  // State for real data (will come from database)
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalVotes: 0,
    totalComments: 0,
    totalCategories: 0
  })
  
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate API call to database
  useEffect(() => {
    // This will be replaced with actual API call
    // Example: fetch('/api/ideas').then(res => res.json()).then(data => setIdeas(data))
    
    // For now, empty state - ready for real data
    setStats({
      totalIdeas: 0,
      totalVotes: 0,
      totalComments: 0,
      totalCategories: 0
    })
    setIdeas([])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          🌊 Innovation Dashboard
        </h1>
        <a
          href="/post-idea"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-plus fa-sm text-white-50" /> Post New Idea
        </a>
      </div>

      {/* Stats Cards */}
      <div className="row">
        {/* Total Ideas */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    💡 Total Ideas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalIdeas}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-lightbulb fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Votes */}
        <div className="col-xl-3 col-md-6 mb-4">
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

        {/* Total Comments */}
        <div className="col-xl-3 col-md-6 mb-4">
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

        {/* Categories */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    🏷️ Categories
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCategories}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-tags fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ideas Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                📝 Recent Ideas
              </h6>
            </div>
            <div className="card-body">
              {ideas.length === 0 ? (
                // Empty State - No ideas yet
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '4rem' }}>
                    💡
                  </div>
                  <h5 className="text-gray-800">No Ideas Yet</h5>
                  <p className="text-gray-600">
                    Be the first to share an idea! 
                    Click <strong>"Post New Idea"</strong> to get started.
                  </p>
                  <a href="/post-idea" className="btn btn-primary mt-2">
                    🚀 Post Your First Idea
                  </a>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Votes</th>
                        <th>Comments</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea, index) => (
                        <tr key={idea.id}>
                          <td>{index + 1}</td>
                          <td>
                            <a href={`/idea/${idea.id}`} className="text-primary">
                              {idea.title}
                            </a>
                          </td>
                          <td>
                            <span className="badge badge-light">
                              {idea.category}
                            </span>
                          </td>
                          <td>{idea.author}</td>
                          <td>
                            <span className="badge badge-success">
                              ⭐ {idea.votes}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-info">
                              💬 {idea.comments}
                            </span>
                          </td>
                          <td>{idea.date}</td>
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
    </>
  )
}

export default DashboardPage