/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import './LandingPage.css'


function LandingPage() {
  return (
    
      <div >
        <div className='landing-page-navbar'>
            <Navbar/>
        </div>
        <div className="landing-page-container">
             <a className="pulsingButton" href="/meeting">START</a>
        </div>
        <div></div>
        
      </div>
    
  )
}

export default LandingPage