import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import DashboardPage from './DashboardPage'


const HomeLayout = () => {
  return (
    <>
      <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
            <Header />
            <div className="container-fluid">
             
             <Outlet />

            </div>
            </div>
            <Footer />
      </div>
      </div>

    </>
  )
}

export default HomeLayout
