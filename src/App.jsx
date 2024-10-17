/* eslint-disable no-unused-vars */
import './App.css'
import './Meeting.css'
import './Sign.css'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Token from './Token.jsx'
import LandingPage from './LandingPage.jsx'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { Suspense, lazy } from 'react';
import Profile from './Profile.jsx'
import { auth} from './firebase/firebase';
import { useState, useEffect } from "react";

const Meeting = lazy(() => import('./Meeting.jsx'));

function App() {

  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route
                path='/'
                element={user ? <Navigate to="/profile" /> : <SignIn />}
            />
            <Route path='/token' element={<Token/>}></Route>
            <Route path='/main-page' element={<LandingPage/>}></Route>
            <Route path='/sign-in' element={<SignIn/>}></Route>
            <Route path='/sign-up' element={<SignUp/>}></Route>
            <Route path='/meeting' element={
            <Suspense fallback={<div>Loading...</div>}>
              <Meeting />
            </Suspense>
          } />
            <Route path='/profile' element={<Profile/>}></Route>
          </Routes>
        </Router>
      </div>
      
    </>
  )
}

export default App
