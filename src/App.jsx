/* eslint-disable no-unused-vars */
import './App.css'
import './Meeting.css'
import './Sign.css'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import LandingPage from './LandingPage.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { Suspense, lazy } from 'react';

const Meeting = lazy(() => import('./Meeting.jsx'));

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage/>}></Route>
            <Route path='/sign-in' element={<SignIn/>}></Route>
            <Route path='/sign-up' element={<SignUp/>}></Route>
            <Route path='/meeting' element={
            <Suspense fallback={<div>Loading...</div>}>
              <Meeting />
            </Suspense>
          } />
          </Routes>
        </Router>
      </div>
      
    </>
  )
}

export default App
