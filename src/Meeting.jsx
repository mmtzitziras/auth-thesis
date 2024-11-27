/* eslint-disable no-unused-vars */
import NavBar from './Navbar.jsx'; // Navigation bar component for the meeting page.
import Chat from './Chat.jsx'; // Chat component to enable messaging during the meeting.
import Call from './Call'; // Video call component for handling video meetings.
import React, { useEffect, useState } from 'react'; // React library and hooks for managing state and effects.


export default function Meeting(){

// State to store the call ID
const [callId, setCallId] = useState("");

// Function to handle data passed from the Call component
function handleDataFromCall(data) {
    setCallId(data);
}
    
    return(
        <div className='meeting-container'>
            {/* Navigation bar section */}
            <div className="nav-bar">
                <NavBar/>
            </div>
            {/* Main body of the meeting page */}
            <div className="main-body">
                {/* Section for video call */}
                <div className="video-call">
                    {/* Call component with data passed as a prop to handle call data */}
                    <div className='video'>
                        <Call sendData={handleDataFromCall}/>
                    </div>
                </div>
                 {/* Chat component linked to the callId, allowing communication within the current call */}
                <Chat room={callId}/>
            </div>
        </div>
        
    );
}