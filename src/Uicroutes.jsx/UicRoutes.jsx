import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'


import HomeLayout from '../pages/HomeLayout'
import DashboardPage from '../pages/DashboardPage'
import IdeaDetailsPage from '../pages/IdeaDetailsPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import LecturersPage from '../pages/LecturersPage'
import MyIdeasPage from '../pages/MyIdeasPage'
import PostIdeaPage from '../pages/PostIdeaPage'
import ProfilePage from '../pages/ProfilePage'


import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import TermsPage from '../pages/TermsPage'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'
import MissionPage from '../pages/MissionPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'



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
          path="/idea-details"
          element={<IdeaDetailsPage />}
        />

       
        <Route
          path="/leaderboard"
          element={<LeaderboardPage />}
        />

        
        <Route
          path="/lecturers"
          element={<LecturersPage />}
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

    </Route>
  )
)

export default UicRoutes