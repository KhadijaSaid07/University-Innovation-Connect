import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  
  // ----- STATE -----
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    profileImage: ''
  })
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)

  // ----- FETCH USER DATA FROM DATABASE -----
  useEffect(() => {
    // TODO: Replace with real API calls
    // const fetchData = async () => {
    //   try {
    //     const token = localStorage.getItem('token')
    //     
    //     // Fetch user profile
    //     const userRes = await fetch('http://localhost:8080/api/users/profile', {
    //       headers: { 'Authorization': `Bearer ${token}` }
    //     })
    //     const userData = await userRes.json()
    //     setUser({
    //       name: userData.name,
    //       email: userData.email,
    //       role: userData.role,
    //       profileImage: userData.profileImage || '/img/undraw_profile.svg'
    //     })
    //     
    //     // Fetch notifications
    //     const notifRes = await fetch('http://localhost:8080/api/notifications', {
    //       headers: { 'Authorization': `Bearer ${token}` }
    //     })
    //     const notifData = await notifRes.json()
    //     setNotifications(notifData)
    //     setUnreadNotifications(notifData.filter(n => !n.read).length)
    //     
    //     // Fetch messages
    //     const msgRes = await fetch('http://localhost:8080/api/messages', {
    //       headers: { 'Authorization': `Bearer ${token}` }
    //     })
    //     const msgData = await msgRes.json()
    //     setMessages(msgData)
    //     setUnreadMessages(msgData.filter(m => !m.read).length)
    //     
    //   } catch (error) {
    //     console.error('Error fetching data:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchData()

    // For now - empty data (will come from database)
    setUser({
      name: '',
      email: '',
      role: '',
      profileImage: '/img/undraw_profile.svg'
    })
    setNotifications([])
    setMessages([])
    setUnreadNotifications(0)
    setUnreadMessages(0)
    setLoading(false)
  }, [])

  // ----- MARK NOTIFICATION AS READ -----
  const markNotificationAsRead = async (id) => {
    // TODO: Call API to mark as read
    // try {
    //   const token = localStorage.getItem('token')
    //   await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
    //     method: 'PUT',
    //     headers: { 'Authorization': `Bearer ${token}` }
    //   })
    // } catch (error) {
    //   console.error('Error marking notification:', error)
    // }
    
    // Update local state
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadNotifications(updated.filter(n => !n.read).length)
  }

  // ----- MARK MESSAGE AS READ -----
  const markMessageAsRead = async (id) => {
    // TODO: Call API to mark as read
    // try {
    //   const token = localStorage.getItem('token')
    //   await fetch(`http://localhost:8080/api/messages/${id}/read`, {
    //     method: 'PUT',
    //     headers: { 'Authorization': `Bearer ${token}` }
    //   })
    // } catch (error) {
    //   console.error('Error marking message:', error)
    // }
    
    // Update local state
    const updated = messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    )
    setMessages(updated)
    setUnreadMessages(updated.filter(m => !m.read).length)
  }

  // ----- LOGOUT -----
  const handleLogout = () => {
    // TODO: Call logout API
    // const logout = async () => {
    //   try {
    //     const token = localStorage.getItem('token')
    //     await fetch('http://localhost:8080/api/auth/logout', {
    //       method: 'POST',
    //       headers: { 'Authorization': `Bearer ${token}` }
    //     })
    //   } catch (error) {
    //     console.error('Logout error:', error)
    //   }
    // }
    // logout()
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // ----- HANDLE SEARCH -----
  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) {
      navigate(`/dashboard?search=${query}`)
    }
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      
      {/* Sidebar Toggle */}
      <button 
        id="sidebarToggleTop" 
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars" />
      </button>

      {/* Search Bar */}
      <form 
        className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"
        onSubmit={handleSearch}
      >
        <div className="input-group">
          <input 
            type="text" 
            name="search"
            className="form-control bg-light border-0 small" 
            placeholder="Search ideas..." 
            aria-label="Search"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              <i className="fas fa-search fa-sm" />
            </button>
          </div>
        </div>
      </form>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">

        {/* Mobile Search */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown">
            <i className="fas fa-search fa-fw" />
          </a>
          <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in">
            <form className="form-inline mr-auto w-100 navbar-search">
              <div className="input-group">
                <input type="text" className="form-control bg-light border-0 small" placeholder="Search..." />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        {/* NOTIFICATIONS */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a 
            className="nav-link dropdown-toggle" 
            href="#" 
            id="alertsDropdown" 
            role="button" 
            data-toggle="dropdown"
          >
            <i className="fas fa-bell fa-fw" />
            {unreadNotifications > 0 && (
              <span className="badge badge-danger badge-counter">
                {unreadNotifications}
              </span>
            )}
          </a>
          
          {/* Dropdown - Notifications */}
          <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in">
            <h6 className="dropdown-header">
              Notifications Center
            </h6>
            
            {notifications.length === 0 ? (
              <a className="dropdown-item text-center text-muted" href="#">
                <div className="py-3">
                  <i className="fas fa-bell-slash fa-2x mb-2" />
                  <p className="mb-0">No notifications</p>
                </div>
              </a>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <a 
                  key={notification.id}
                  className={`dropdown-item d-flex align-items-center ${!notification.read ? 'bg-light' : ''}`}
                  href="#"
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="mr-3">
                    <div className={`icon-circle ${notification.type === 'success' ? 'bg-success' : 
                      notification.type === 'warning' ? 'bg-warning' : 
                      notification.type === 'danger' ? 'bg-danger' : 'bg-primary'}`}>
                      <i className={`fas ${notification.icon || 'fa-file-alt'} text-white`} />
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">{notification.time}</div>
                    <span className={!notification.read ? 'font-weight-bold' : ''}>
                      {notification.message}
                    </span>
                  </div>
                </a>
              ))
            )}
            
            {notifications.length > 5 && (
              <a className="dropdown-item text-center small text-gray-500" href="#">
                Show All Notifications
              </a>
            )}
          </div>
        </li>

        {/* MESSAGES */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a 
            className="nav-link dropdown-toggle" 
            href="#" 
            id="messagesDropdown" 
            role="button" 
            data-toggle="dropdown"
          >
            <i className="fas fa-envelope fa-fw" />
            {unreadMessages > 0 && (
              <span className="badge badge-danger badge-counter">
                {unreadMessages}
              </span>
            )}
          </a>
          
          {/* Dropdown - Messages */}
          <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in">
            <h6 className="dropdown-header">
              Message Center
            </h6>
            
            {messages.length === 0 ? (
              <a className="dropdown-item text-center text-muted" href="#">
                <div className="py-3">
                  <i className="fas fa-inbox fa-2x mb-2" />
                  <p className="mb-0">No messages</p>
                </div>
              </a>
            ) : (
              messages.slice(0, 5).map(message => (
                <a 
                  key={message.id}
                  className={`dropdown-item d-flex align-items-center ${!message.read ? 'bg-light' : ''}`}
                  href="#"
                  onClick={() => markMessageAsRead(message.id)}
                >
                  <div className="dropdown-list-image mr-3">
                    <img 
                      className="rounded-circle" 
                      src={message.senderImage || '/img/undraw_profile_1.svg'} 
                      alt={message.sender}
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div className={`status-indicator ${message.status || 'bg-success'}`} />
                  </div>
                  <div className="font-weight-bold">
                    <div className="text-truncate">{message.content}</div>
                    <div className="small text-gray-500">
                      {message.sender} · {message.time}
                    </div>
                  </div>
                </a>
              ))
            )}
            
            {messages.length > 5 && (
              <a className="dropdown-item text-center small text-gray-500" href="#">
                Read More Messages
              </a>
            )}
          </div>
        </li>

        {/* Divider */}
        <div className="topbar-divider d-none d-sm-block" />

        {/* User Information */}
        <li className="nav-item dropdown no-arrow">
          <a 
            className="nav-link dropdown-toggle" 
            href="#" 
            id="userDropdown" 
            role="button" 
            data-toggle="dropdown"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {loading ? 'Loading...' : user.name || 'Guest User'}
            </span>
            <img 
              className="img-profile rounded-circle" 
              src={user.profileImage || '/img/undraw_profile.svg'} 
              alt="Profile"
              style={{ width: '32px', height: '32px' }}
            />
          </a>

          {/* Dropdown - User */}
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in">
            <Link className="dropdown-item" to="/profile">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
              Profile
            </Link>
            <div className="dropdown-divider" />
            <button 
              className="dropdown-item" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
              Logout
            </button>
          </div>
        </li>

      </ul>
    </nav>
  )
}

export default Header