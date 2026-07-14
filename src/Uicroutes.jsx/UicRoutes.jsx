import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

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

const UicRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/mission"
        element={<MissionPage />}
      />

      <Route
        path="/terms"
        element={<TermsPage />}
      />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicyPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route path="/" element={<HomeLayout />}>
        
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/leaderboard"
          element={<LeaderboardPage />}
        />

        <Route
          path="/my-ideas"
          element={<MyIdeasPage />}
        />

        <Route
          path="/post-idea"
          element={<PostIdeaPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

      </Route>

      <Route
        path="/lecturer-dashboard"
        element={<LecturerDashboardPage />}
      />

      <Route
        path="/lecturer-leaderboard"
        element={<LecturerLeaderboardPage />}
      />

      <Route
        path="/lecturer-profile"
        element={<LecturerProfilePage />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboardPage />}
      />

      <Route
        path="/admin-users"
        element={<AdminUsersPage />}
      />

      <Route
        path="/admin-ideas"
        element={<AdminIdeasPage />}
      />

      <Route
        path="/admin-lecturers"
        element={<AdminLecturersPage />}
      />

    </Route>
  )
)

export default UicRoutes