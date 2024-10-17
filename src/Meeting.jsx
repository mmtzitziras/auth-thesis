/* eslint-disable no-unused-vars */
import NavBar from './Navbar.jsx'
import Chat from './Chat.jsx'
import Call from './Call'
import React, {useEffect, useState} from 'react';





export default function Meeting(){
    
    return(
        <div className='meeting-container'>
            <div className="nav-bar">
                <NavBar/>
            </div>
            <div className="main-body">
                <div className="video-call">
                    <div className='video'>
                        <Call/>
                    </div>
                </div>
                <Chat/>
            </div>
        </div>
        
    );
}