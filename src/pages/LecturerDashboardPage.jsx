import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LecturerDashboardPage.css'

const LecturerDashboardPage = () => {
  const navigate = useNavigate()
  

  const [lecturer, setLecturer] = useState({
    name: '',
    email: '',
    idNumber: '',
    department: ''
  })
  const [stats, setStats] = useState({
    totalIdeas: 0,
    pendingReviews: 0,
    reviewed: 0,
    totalStudents: 0
  })
  const [recentIdeas, setRecentIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [messages, setMessages] = useState([])
  const [unreadMessages, setUnreadMessages] = useState(0)

  
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
        
      
        // const token = localStorage.getItem('token')
        // 
        // // 1. Get lecturer profile
        // const profileRes = await fetch('http://localhost:8080/api/lecturers/profile', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const profileData = await profileRes.json()
        // setLecturer(profileData)
        // 
        // // 2. Get stats
        // const statsRes = await fetch('http://localhost:8080/api/lecturers/stats', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const statsData = await statsRes.json()
        // setStats(statsData)
        // 
        // // 3. Get recent ideas
        // const ideasRes = await fetch('http://localhost:8080/api/ideas/recent', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const ideasData = await ideasRes.json()
        // setRecentIdeas(ideasData)
        // 
        // // 4. Get notifications
        // const notifRes = await fetch('http://localhost:8080/api/notifications', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const notifData = await notifRes.json()
        // setNotifications(notifData)
        // setUnreadNotifications(notifData.filter(n => !n.read).length)
        // 
        // // 5. Get messages
        // const msgRes = await fetch('http://localhost:8080/api/messages', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const msgData = await msgRes.json()
        // setMessages(msgData)
        // setUnreadMessages(msgData.filter(m => !m.read).length)
        // 
        // setLoading(false)
        
        // For now - empty state (all data from database)
        setLecturer({
          name: loggedInUser?.name || '',
          email: loggedInUser?.email || '',
          idNumber: loggedInUser?.idNumber || '',
          department: loggedInUser?.department || ''
        })
        
        setStats({
          totalIdeas: 0,
          pendingReviews: 0,
          reviewed: 0,
          totalStudents: 0
        })
        
        setRecentIdeas([])
        setNotifications([])
        setUnreadNotifications(0)
        setMessages([])
        setUnreadMessages(0)
        setLoading(false)
        
      } catch (err) {
        console.error('Error:', err)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // ----- MARK NOTIFICATION AS READ -----
  const markNotificationAsRead = (id) => {
    // =============================================
    // TODO: UNCOMMENT WHEN API IS READY
    // =============================================
    // const token = localStorage.getItem('token')
    // await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // =============================================
    
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadNotifications(updated.filter(n => !n.read).length)
  }

 
  const markMessageAsRead = (id) => {

    // const token = localStorage.getItem('token')
    // await fetch(`http://localhost:8080/api/messages/${id}/read`, {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    
    const updated = messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    )
    setMessages(updated)
    setUnreadMessages(updated.filter(m => !m.read).length)
  }

  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }


  if (loading) {
    return (
      <div className="lecturer-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading dashboard...</p>
      </div>
    )
  }

 
  return (
    <div className="lecturer-dashboard">
      
     
      <header className="lecturer-header">
        <div className="header-container">
          <div className="header-left">
            <button className="sidebar-toggle-btn">
              <i className="fas fa-bars" />
            </button>
            <div className="header-brand">
              <span className="brand-icon">👨‍🏫</span>
              <span className="brand-text">Lecturer Portal</span>
            </div>
          </div>
          
          <div className="header-right">
          
            <div className="header-dropdown">
              <button className="dropdown-btn" data-toggle="dropdown">
                <i className="fas fa-bell" />
                {unreadNotifications > 0 && (
                  <span className="badge-counter">{unreadNotifications}</span>
                )}
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <h6 className="dropdown-header">Notifications</h6>
                {notifications.length === 0 ? (
                  <a className="dropdown-item text-center text-muted" href="#">
                    <p className="mb-0">No notifications</p>
                  </a>
                ) : (
                  notifications.slice(0, 5).map(notif => (
                    <a 
                      key={notif.id}
                      className={`dropdown-item ${!notif.read ? 'bg-light' : ''}`}
                      href="#"
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <div className="dropdown-item-content">
                        <div className={`icon-circle ${notif.type === 'success' ? 'bg-success' : notif.type === 'warning' ? 'bg-warning' : 'bg-info'}`}>
                          <i className="fas fa-info-circle text-white" />
                        </div>
                        <div>
                          <div className="small text-gray-500">{notif.time}</div>
                          <span className={!notif.read ? 'font-weight-bold' : ''}>{notif.message}</span>
                        </div>
                      </div>
                    </a>
                  ))
                )}
                {notifications.length > 5 && (
                  <a className="dropdown-item text-center small text-gray-500" href="#">View All</a>
                )}
              </div>
            </div>

         
            <div className="header-dropdown">
              <button className="dropdown-btn" data-toggle="dropdown">
                <i className="fas fa-envelope" />
                {unreadMessages > 0 && (
                  <span className="badge-counter">{unreadMessages}</span>
                )}
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <h6 className="dropdown-header">Messages</h6>
                {messages.length === 0 ? (
                  <a className="dropdown-item text-center text-muted" href="#">
                    <p className="mb-0">No messages</p>
                  </a>
                ) : (
                  messages.slice(0, 5).map(msg => (
                    <a 
                      key={msg.id}
                      className={`dropdown-item ${!msg.read ? 'bg-light' : ''}`}
                      href="#"
                      onClick={() => markMessageAsRead(msg.id)}
                    >
                      <div className="dropdown-item-content">
                        <div className="message-avatar">
                          <i className="fas fa-user-circle" />
                        </div>
                        <div>
                          <div className="small text-gray-500">{msg.sender} · {msg.time}</div>
                          <span className={!msg.read ? 'font-weight-bold' : ''}>{msg.content}</span>
                        </div>
                      </div>
                    </a>
                  ))
                )}
                {messages.length > 5 && (
                  <a className="dropdown-item text-center small text-gray-500" href="#">View All</a>
                )}
              </div>
            </div>

       
            <div className="header-user">
              <div className="user-avatar">
                {lecturer.name ? lecturer.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div className="user-info">
                <span className="user-name">{lecturer.name || 'Lecturer'}</span>
                <span className="user-role">Lecturer</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>
        </div>
      </header>

  
      <div className="lecturer-content">
        <div className="content-container">
          
         
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>👋 Welcome, {lecturer.name || 'Lecturer'}!</h1>
              <p>Review student ideas and provide feedback.</p>
            </div>
            <div className="welcome-badge">
              {lecturer.idNumber && <span>🆔 {lecturer.idNumber}</span>}
              {lecturer.email && <span>📧 {lecturer.email}</span>}
            </div>
          </div>

       
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <h3>{stats.totalIdeas}</h3>
                <p>Total Ideas</p>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingReviews}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.reviewed}</h3>
                <p>Reviewed</p>
              </div>
            </div>
            <div className="stat-card stat-info">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <h3>{stats.totalStudents}</h3>
                <p>Students</p>
              </div>
            </div>
          </div>

         
          <div className="recent-ideas">
            <div className="section-header">
              <h3>📝 Student Ideas for Review</h3>
            </div>
            <div className="table-responsive">
              <table className="ideas-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIdeas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No ideas submitted yet</td>
                    </tr>
                  ) : (
                    recentIdeas.map((idea, index) => (
                      <tr key={idea.id}>
                        <td>{index + 1}</td>
                        <td>{idea.title}</td>
                        <td>{idea.author}</td>
                        <td>{idea.category}</td>
                        <td>{idea.date}</td>
                        <td>
                          <span className={`status-badge ${idea.status === 'Pending' ? 'status-pending' : 'status-reviewed'}`}>
                            {idea.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/lecturer-idea/${idea.id}`} className="btn-review-idea">
                            <i className="fas fa-check-circle" /> Review & Feedback
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <aside className="lecturer-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-brand">
            <span className="brand-icon">👨‍🏫</span>
            <span className="brand-text">Lecturer</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/lecturer-dashboard" className="sidebar-link active">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
            <Link to="/lecturer-leaderboard" className="sidebar-link">
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

export default LecturerDashboardPage