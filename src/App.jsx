/* eslint-disable no-unused-vars */
import './App.css'; // Styles specific to the main App component.
import './Meeting.css'; // Styles specific to the Meeting component.
import './Sign.css'; // Styles specific to SignIn and SignUp components.
import SignIn from './SignIn.jsx'; // Component for user sign-in functionality.
import SignUp from './SignUp.jsx'; // Component for user registration.
import Token from './Token.jsx'; // Component to handle token page.
import Chat from './Chat.jsx'; // Component for chat functionality.
import { toast, ToastContainer } from "react-toastify";
import Recordings from './Recordings.jsx';
import LandingPage from './LandingPage.jsx'; // Component for the application's main landing page.
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Routing utilities from React Router.
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome styles for icons.
import React, { Suspense, lazy } from 'react'; // React core and lazy loading support.
import Profile from './Profile.jsx'; // Component for user profile management.
import { auth } from './firebase/firebase'; // Firebase authentication module.
import { useState, useEffect } from "react"; // React hooks for state and side effects.
import "react-toastify/dist/ReactToastify.css";

// Lazy loading the Meeting component so it won't load at start
const Meeting = lazy(() => import('./Meeting.jsx'));

function App() {

  // State to manage the current user
  const [user, setUser] = useState();

  // Effect to monitor authentication state changes
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  
  return (
    <>
      <div className="app">
      <ToastContainer />
        <Router>
          <Routes>
            <Route
                path='/'
                element={user ? <Navigate to="/profile" /> : <SignIn />}
            />
            <Route path='/token' element={<Token/>}></Route>
            <Route path='/chat' element={<Chat/>}></Route>
            <Route path='/main-page' element={<LandingPage/>}></Route>
            <Route path='/sign-in' element={<SignIn/>}></Route>
            <Route path='/recordings' element={<Recordings/>}></Route>
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
