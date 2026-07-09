import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    idNumber: '',
    profileImage: ''
  })
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)

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
        // // Fetch user profile
        // const userRes = await fetch('http://localhost:8080/api/users/profile', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const userData = await userRes.json()
        // setUser({
        //   name: userData.name,
        //   email: userData.email,
        //   role: userData.role,
        //   idNumber: userData.idNumber,
        //   profileImage: userData.profileImage || '/img/undraw_profile.svg'
        // })
        // 
        // // Fetch notifications
        // const notifRes = await fetch('http://localhost:8080/api/notifications', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const notifData = await notifRes.json()
        // setNotifications(notifData)
        // setUnreadNotifications(notifData.filter(n => !n.read).length)
        // 
        // // Fetch messages
        // const msgRes = await fetch('http://localhost:8080/api/messages', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // })
        // const msgData = await msgRes.json()
        // setMessages(msgData)
        // setUnreadMessages(msgData.filter(m => !m.read).length)
        // 
        // setLoading(false)
        

        if (loggedInUser) {
          setUser({
            name: loggedInUser.name || '',
            email: loggedInUser.email || '',
            role: loggedInUser.role || '',
            idNumber: loggedInUser.idNumber || '',
            profileImage: loggedInUser.profileImage || '/img/undraw_profile.svg'
          })
        } else {
          
          const fallbackUser = {
            name: '',
            email: '',
            role: '',
            idNumber: '',
            profileImage: '/img/undraw_profile.svg'
          }
          setUser(fallbackUser)
        }
        
        setNotifications([])
        setMessages([])
        setUnreadNotifications(0)
        setUnreadMessages(0)
        setLoading(false)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

 
  const markNotificationAsRead = async (id) => {
   
    // const token = localStorage.getItem('token')
    // await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
   
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadNotifications(updated.filter(n => !n.read).length)
  }

  const markMessageAsRead = async (id) => {
 
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
    
    // const token = localStorage.getItem('token')
    // await fetch('http://localhost:8080/api/auth/logout', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  
  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) {
      navigate(`/dashboard?search=${query}`)
    }
  }

 
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      
      
      <button 
        id="sidebarToggleTop" 
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars" />
      </button>

     
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

     
      <ul className="navbar-nav ml-auto">

       
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

  
        <div className="topbar-divider d-none d-sm-block" />

        {/* ===== USER INFORMATION - SHOWS REAL USER DATA ===== */}
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
           
            <span 
              className="img-profile rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '700'
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </a>

          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in">
            {/* ✅ Show user details in dropdown */}
            <div className="dropdown-header">
              <div className="font-weight-bold">{user.name || 'User'}</div>
              <div className="small text-muted">{user.email || 'No email'}</div>
              <div className="small text-muted">
                <span className="badge badge-primary">
                  {user.role || 'Role'}
                </span>
                {user.idNumber && (
                  <span className="badge badge-secondary ml-1">
                    {user.idNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="dropdown-divider" />
            <Link className="dropdown-item" to="/profile">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
              Profile
            </Link>
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