/* eslint-disable no-unused-vars */
import { useState } from 'react'
import NavBar from './Navbar.jsx'
import Chat from './Chat.jsx'
import VideoCall from './VideoCall.jsx'


export default function Meeting(){
    return(
        <div className='meeting-container'>
            <div className="nav-bar">
                <NavBar/>
            </div>
            <div className="main-body">
                <VideoCall/>
                <Chat/>
            </div>
        </div>
        
    );
}