/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import './Meeting.css'
import './Sign.css'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Meeting from './Meeting.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path='/' element={<SignUp/>}></Route>
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route path='/meeting' element={<Meeting/>}></Route>
          </Routes>
        </Router>
      </div>
      
    </>
  )
}

export default App
