import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const getRoleHomePath = (role) => {
  const normalized = (role || '').toUpperCase()
  if (normalized === 'ADMIN') return '/admin-dashboard'
  if (normalized === 'LECTURER') return '/lecturer-dashboard'
  return '/dashboard'
}

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation()
  const user = getStoredUser()

  if (!user || !user.id) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = (user.role || 'STUDENT').toUpperCase()

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={getRoleHomePath(userRole)} replace />
  }

  return children
}

export default ProtectedRoute

