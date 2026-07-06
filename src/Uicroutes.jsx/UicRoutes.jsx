import React from 'react'
import DashboardPage from '../pages/DashboardPage';
import IdeaDetailsPage from '../pages/IdeaDetailsPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import LecturersPage from '../pages/LecturersPage';
import LoginPage from '../pages/LoginPage';
import MyIdeasPage from '../pages/MyIdeasPage';
import PostIdeaPage from '../pages/PostIdeaPage';
import RegisterPage from '../pages/RegisterPage';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import HomeLayout from '../pages/HomeLayout';
import ProfilePage from '../pages/ProfilePage';

const UicRoutes = createBrowserRouter(
    createRoutesFromElements(
        <>

            {/* Protected routes (only HR_MANAGER or ADMIN can access) */}
            <Route path="" element={<HomeLayout />}> 
                <Route
                    path="/"
                    element={
                        <DashboardPage/>
                    }
                />
                <Route
                    path="/idea-details"
                    element={
                        <IdeaDetailsPage/>
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        <LeaderboardPage />
                    }
                />
                {/* <Route
                    path="/perform"
                    element={
                        <Performance />
                    }
                /> */}
                <Route
                    path="/lecturers"
                    element={
                        <LecturersPage />
                    }
                />
                <Route
                    path="/login"
                    element={
                            <LoginPage />
                    }
                />

                 <Route
                    path="/my-ideas"
                    element={
                        < MyIdeasPage />
                    }
                     />

                     <Route
                    path="/post-idea"
                    element={
                        < PostIdeaPage />
                    }
                     />

                   

                     <Route
                    path="/profile"
                    element={
                        < ProfilePage/>
                    }
                     />

                    <Route
                    path="/leave"
                    element={
                        < RegisterPage />
                    }
                     />

            </Route>

        </>
    )
);

export default UicRoutes
