/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import NavBar from './Navbar.jsx'
import Chat from './Chat.jsx'
import VideoCall from './VideoCall.jsx'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="nav-bar">
        <NavBar/>
      </div>
      <div className="main-body">
        <VideoCall/>
        <Chat/>
      </div>
    </>
  )
}

export default App
