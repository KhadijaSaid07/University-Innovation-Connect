import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import './PortalLayout.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
const API = `${BASE_URL}/v2/innovationConnect`

const Header = ({ onToggleSidebar = () => {} }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  const [user, setUser] = useState({
    id: null,
    name: 'Student',
    email: '',
    role: 'STUDENT'
  })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState([])

  const loadUser = () => {
    const data = localStorage.getItem('user')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.name || 'Student'
        setUser({
          id: parsed.id || null,
          name: fullName,
          email: parsed.email || '',
          role: parsed.role || 'STUDENT'
        })
        if (parsed.id) {
          const savedRead = localStorage.getItem(`uic_read_notifs_${parsed.id}`)
          if (savedRead) {
            try { setReadIds(JSON.parse(savedRead)) } catch { setReadIds([]) }
          }
        }
      } catch {
        setUser({ id: null, name: 'Student', email: '', role: 'STUDENT' })
      }
    }
  }

  const fetchNotifications = async (studentId) => {
    if (!studentId) return
    try {
      const ideasRes = await axios.get(`${API}/user/${studentId}/ideas`)
      const myIdeas = ideasRes.data || []
      if (myIdeas.length === 0) {
        setNotifications([])
        return
      }

      const items = []

      await Promise.all(
        myIdeas.map(async (idea) => {
          // Status notification if reviewed
          if (idea.status && idea.status !== 'PENDING') {
            items.push({
              key: `status-${idea.id}-${idea.status}`,
              type: 'STATUS',
              title: 'Idea Status Updated',
              text: `Your idea "${idea.title}" is now ${idea.status.replace('_', ' ')}.`,
              date: idea.lastModifiedDate || idea.createdDate || null,
              ideaId: idea.id
            })
          }

          // Lecturer feedback on this student's idea
          try {
            const fbRes = await axios.get(`${API}/feedback/idea/${idea.id}`)
            ;(fbRes.data || []).forEach((fb) => {
              items.push({
                key: `fb-${fb.id || `${idea.id}-${fb.comment}`}`,
                type: 'FEEDBACK',
                title: 'New Lecturer Feedback',
                text: `${fb.lecturerName || 'A Lecturer'} gave feedback on "${idea.title}": "${fb.comment}"`,
                date: fb.createdDate || null,
                ideaId: idea.id
              })
            })
          } catch {
            // ignore
          }

          // Votes on this student's idea
          try {
            const voteRes = await axios.get(`${API}/vote/idea/${idea.id}`)
            const votes = voteRes.data || []
            if (votes.length > 0) {
              votes.forEach((v, idx) => {
                const voterName = v.userName || 'A student'
                items.push({
                  key: `vote-${v.id || `${idea.id}-${idx}`}`,
                  type: 'VOTE',
                  title: 'New Vote Received',
                  text: `${voterName} voted for your idea "${idea.title}".`,
                  date: v.createdDate || null,
                  ideaId: idea.id
                })
              })
            }
          } catch {
            // ignore
          }

          // Comments on this student's idea
          try {
            const cRes = await axios.get(`${API}/comment/idea/${idea.id}`)
            ;(cRes.data || []).forEach((c) => {
              if (c.userId !== studentId) {
                items.push({
                  key: `comment-${c.id || `${idea.id}-${c.message}`}`,
                  type: 'COMMENT',
                  title: 'New Student Comment',
                  text: `${c.userName || 'A student'} commented on "${idea.title}": "${c.message}"`,
                  date: c.createdDate || null,
                  ideaId: idea.id
                })
              }
            })
          } catch {
            // ignore
          }
        })
      )

      // Sort newest first
      items.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return db - da
      })

      setNotifications(items)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadUser()
    setDropdownOpen(false)
    setNotifOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (user.id) {
      fetchNotifications(user.id)
    }
  }, [user.id, location.pathname])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') loadUser()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    if (!user.id) return
    const allKeys = notifications.map(n => n.key)
    setReadIds(allKeys)
    localStorage.setItem(`uic_read_notifs_${user.id}`, JSON.stringify(allKeys))
  }

  const handleNotificationClick = (notif) => {
    if (user.id && !readIds.includes(notif.key)) {
      const updated = [...readIds, notif.key]
      setReadIds(updated)
      localStorage.setItem(`uic_read_notifs_${user.id}`, JSON.stringify(updated))
    }
    setNotifOpen(false)
    navigate('/my-ideas')
  }

  const unreadNotifications = notifications.filter(n => !readIds.includes(n.key))
  const unreadCount = unreadNotifications.length

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setDropdownOpen(false)
    navigate('/login')
  }

  const getPageMeta = () => {
    const params = new URLSearchParams(location.search)
    const status = params.get('status')
    switch (location.pathname) {
      case '/dashboard':
        return status === 'APPROVED'
          ? { title: 'Approved Ideas', subtitle: 'Ideas reviewed and approved by faculty' }
          : { title: 'Innovation Feed', subtitle: 'Browse, discuss, and vote on student proposals' }
      case '/post-idea':
        return { title: 'Post an Idea', subtitle: 'Share a project idea with students and lecturers' }
      case '/my-ideas':
        return { title: 'My Ideas', subtitle: 'Manage your submitted proposals and track review status' }
      case '/leaderboard':
        return { title: 'Leaderboard', subtitle: 'Top-voted student innovations across SUZA' }
      case '/profile':
        return { title: 'Profile Settings', subtitle: 'Update your personal information and password' }
      default:
        return { title: 'University Innovation Connect', subtitle: 'Student Portal' }
    }
  }

  const pageMeta = getPageMeta()
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'S'

  const getNotifIcon = (type) => {
    switch (type) {
      case 'FEEDBACK':
        return { icon: 'fas fa-chalkboard-teacher', cls: 'feedback' }
      case 'VOTE':
        return { icon: 'fas fa-thumbs-up', cls: 'vote' }
      case 'COMMENT':
        return { icon: 'fas fa-comment-dots', cls: 'comment' }
      default:
        return { icon: 'fas fa-check-circle', cls: 'status' }
    }
  }

  return (
    <header className="uic-topbar uic-topbar-static">
      <div className="uic-topbar-left">
        <button
          type="button"
          className="uic-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" />
        </button>

        <div className="uic-page-title-group">
          <h1 className="uic-page-title">{pageMeta.title}</h1>
          <p className="uic-page-subtitle">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="uic-topbar-right">
        {location.pathname !== '/post-idea' && (
          <Link to="/post-idea" className="uic-quick-btn">
            <i className="fas fa-plus" />
            <span>Submit Idea</span>
          </Link>
        )}

        {/* Student Notification Bell for Votes & Lecturer Feedback */}
        <div className="uic-notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className={`uic-notif-btn ${notifOpen ? 'open' : ''}`}
            onClick={() => {
              setNotifOpen(prev => !prev)
              setDropdownOpen(false)
            }}
            aria-label="Notifications"
            title="Notifications for votes and lecturer feedback"
          >
            <i className="fas fa-bell" />
            {unreadCount > 0 && (
              <span className="uic-notif-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="uic-notif-dropdown">
              <div className="uic-notif-header">
                <div>
                  <span className="uic-notif-title">Notifications</span>
                  <span className="uic-notif-subtitle">Votes & Lecturer Feedback on your ideas</span>
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    type="button"
                    className="uic-notif-mark-btn"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="uic-notif-list">
                {unreadNotifications.length === 0 ? (
                  <div className="uic-notif-empty">
                    <i className="fas fa-bell-slash" />
                    <p>No new notifications. When someone votes or a lecturer gives feedback on your idea, it will appear here.</p>
                  </div>
                ) : (
                  unreadNotifications.map((n) => {
                    const meta = getNotifIcon(n.type)
                    return (
                      <button
                        key={n.key}
                        type="button"
                        className="uic-notif-item unread"
                        onClick={() => handleNotificationClick(n)}
                      >
                        <span className={`uic-notif-icon ${meta.cls}`}>
                          <i className={meta.icon} />
                        </span>
                        <div className="uic-notif-body">
                          <div className="uic-notif-item-title">
                            <span>{n.title}</span>
                            <span className="uic-notif-dot" />
                          </div>
                          <p className="uic-notif-item-text">{n.text}</p>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="uic-topbar-user-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`uic-topbar-user-btn ${dropdownOpen ? 'open' : ''}`}
            onClick={() => {
              setDropdownOpen(prev => !prev)
              setNotifOpen(false)
            }}
          >
            <div className="uic-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.82rem' }}>
              {initial}
            </div>
            <div className="uic-topbar-user-text">
              <span className="uic-topbar-user-name">{user.name}</span>
              <span className="uic-topbar-user-role">{user.role.toLowerCase()}</span>
            </div>
            <i className="fas fa-chevron-down uic-topbar-chevron" />
          </button>

          {dropdownOpen && (
            <div className="uic-topbar-dropdown">
              <div className="uic-dropdown-user-header">
                <div className="uic-dropdown-user-name">{user.name}</div>
                {user.email && <div className="uic-dropdown-user-email">{user.email}</div>}
                <span className="uic-dropdown-role-badge">{user.role}</span>
              </div>

              <Link
                to="/profile"
                className="uic-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-user" />
                <span>Profile</span>
              </Link>

              <Link
                to="/my-ideas"
                className="uic-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-folder-open" />
                <span>My Ideas</span>
              </Link>

              <div className="uic-dropdown-divider" />

              <button
                type="button"
                className="uic-dropdown-item danger"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
