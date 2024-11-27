/* eslint-disable no-unused-vars */
import './Navbar.css'; // Styles specific to the Navbar component.
import React, { useEffect, useState } from 'react'; // React and hooks for managing state and effects.
import accountLogo from './assets/account.svg'; // Default account logo for users without a profile picture.
import { auth, db } from './firebase/firebase'; // Firebase authentication and Firestore database.
import { getDoc, doc } from 'firebase/firestore'; // Firestore functions for fetching user data.
import tholosLogoWhite from './assets/tholos-logo-transparent-white.png'; // Application logo for the navbar.
import '@stream-io/video-react-sdk/dist/css/styles.css'; // Importing styles for video SDK.


export default function Navbar(){

    // State to store user details fetched from Firestore
    const [userDetails, setUserDetails] = useState(null);

    // Function to fetch user data from Firestore based on the currently authenticated user
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
            } else {
                console.log("User is not logged in");
            }
        });
    };
    // Effect to fetch user data when the component is mounted
    useEffect(() => {
        fetchUserData();
    }, []);

    return ( 
        <nav className="navbar">
            {/* Left side of the navbar: logo linking to the main page */}
            <div className="navbar-left">
                <a href="/main-page" className="logo">
                    <img src={tholosLogoWhite} alt="tholos" />
                </a>
            </div>
             {/* Right side of the navbar: user details and profile picture */}
            <div className="navbar-right">
                <p href="/profile" className="user-icon">{userDetails ? userDetails.name : ' '}</p>
                <a className='navbar-profile-pic' href="/profile"><img width={"45%"} style={{borderRadius: "50%"}} 
                src={userDetails ? userDetails.photo : accountLogo} alt="account-image" className='user-icon' /></a>
            </div>
        </nav>  
    );
}
