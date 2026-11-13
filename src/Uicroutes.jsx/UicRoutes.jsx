import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '../components/ProtectedRoute'
import HomeLayout from '../pages/HomeLayout'
import DashboardPage from '../pages/DashboardPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import MyIdeasPage from '../pages/MyIdeasPage'
import PostIdeaPage from '../pages/PostIdeaPage'
import ProfilePage from '../pages/ProfilePage'

import LecturerDashboardPage from '../pages/LecturerDashboardPage'
import LecturerLeaderboardPage from '../pages/LecturerLeaderboardPage'
import LecturerProfilePage from '../pages/LecturerProfilePage'

import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import TermsPage from '../pages/TermsPage'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'
import MissionPage from '../pages/MissionPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminIdeasPage from '../pages/admin/AdminIdeasPage'
import AdminLecturersPage from '../pages/admin/AdminLecturersPage'
import AdminActivityLogPage from '../pages/admin/AdminActivityLogPage'
import AdminProfilePage from '../pages/admin/AdminProfilePage'

const UicRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Student Routes (Shared Sidebar + Navbar via HomeLayout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <HomeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/my-ideas" element={<MyIdeasPage />} />
        <Route path="/post-idea" element={<PostIdeaPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Lecturer Routes */}
      <Route
        path="/lecturer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['LECTURER', 'ADMIN']}>
            <LecturerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer-leaderboard"
        element={
          <ProtectedRoute allowedRoles={['LECTURER', 'ADMIN']}>
            <LecturerLeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer-profile"
        element={
          <ProtectedRoute allowedRoles={['LECTURER', 'ADMIN']}>
            <LecturerProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-ideas"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminIdeasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-lecturers"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLecturersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-activity-logs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminActivityLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
)

export default UicRoutes
