/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import './Meeting.css'
import './Sign.css'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Meeting from './Meeting.jsx'
import Call from './Call.jsx'
import LandingPage from './LandingPage.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage/>}></Route>
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route path='/meeting' element={<Meeting/>}></Route>
            <Route path='/call' element={<Call/>}></Route>
          </Routes>
        </Router>
      </div>
      
    </>
  )
}

export default App
