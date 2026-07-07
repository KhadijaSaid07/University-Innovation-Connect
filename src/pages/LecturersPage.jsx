import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LecturersPage = () => {
  const navigate = useNavigate()
  
 
  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
      
        // const token = localStorage.getItem('token')
        // 
        // // Fetch all lecturers
        // const response = await fetch('http://localhost:8080/api/users/lecturers', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch lecturers')
        // }
        // 
        // const data = await response.json()
        // setLecturers(data)
        // setLoading(false)


    
        setLecturers([])
        setLoading(false)

      } catch (err) {
        console.error('Error:', err)
        setError('Could not load lecturers')
        setLoading(false)
      }
    }
    
    fetchLecturers()
  }, [])

  
  const goBack = () => {
    navigate('/')
  }

 
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading lecturers...</p>
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
          Lecturers
        </h1>
        <button 
          onClick={goBack} 
          className="btn btn-sm btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      
      <div className="row">
        {lecturers.length === 0 ? (
          
          <div className="col-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem' }}>👨‍🏫</div>
                  <h5 className="text-gray-800 mt-3">No Lecturers Found</h5>
                  <p className="text-muted">
                    Lecturers will appear here once they register.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
         
          lecturers.map((lecturer) => (
            <div className="col-xl-3 col-md-6 mb-4" key={lecturer.id}>
              <div className="card shadow h-100">
                <div className="card-body text-center">
                
                  <div className="mb-3">
                    <div 
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                      style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
                    >
                      {lecturer.profileImage ? (
                        <img 
                          src={lecturer.profileImage} 
                          alt={lecturer.name}
                          className="rounded-circle"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      ) : (
                        <span> </span>
                      )}
                    </div>
                  </div>

              
                  <h5 className="font-weight-bold text-gray-800">{lecturer.name}</h5>
                  
                 
                  <p className="text-muted small mb-2">
                    <i className="fas fa-building" /> {lecturer.department || 'Department'}
                  </p>

               
                  <p className="text-muted small mb-2">
                    <i className="fas fa-envelope" /> {lecturer.email}
                  </p>

                
                  {lecturer.phone && (
                    <p className="text-muted small mb-2">
                      <i className="fas fa-phone" /> {lecturer.phone}
                    </p>
                  )}

          
                  {lecturer.specialization && (
                    <div className="mt-2">
                      <span className="badge badge-primary">
                        {lecturer.specialization}
                      </span>
                    </div>
                  )}

               
                  <hr className="my-2" />

                  
                  <p className="text-muted small mb-0">
                    <i className="fas fa-lightbulb" /> {lecturer.ideasSupported || 0} ideas supported
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LecturersPage