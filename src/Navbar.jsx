/* eslint-disable no-unused-vars */
import './Navbar.css'
import React, { useEffect, useState } from 'react'
import accountLogo from './assets/account.svg'
import { auth, db } from './firebase/firebase';
import { getDoc, doc } from 'firebase/firestore';
import tholosLogoWhite from './assets/tholos-logo-transparent-white.png'

  
  import '@stream-io/video-react-sdk/dist/css/styles.css';


export default function Navbar(){

    const [userDetails, setUserDetails] = useState(null);
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
                console.log(docSnap.data());
                console.log(docSnap.data().name);
            } else {
                console.log("User is not logged in");
            }
        });
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    return ( 
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/main-page" className="logo">
                    <img src={tholosLogoWhite} alt="tholos" />
                </a>
            </div>
            
            <div className="navbar-right">
                <p href="/profile" className="user-icon">{userDetails ? userDetails.name : ' '}</p>
                <a className='navbar-profile-pic' href="/profile"><img width={"45%"} style={{borderRadius: "50%"}} src={userDetails ? userDetails.photo : accountLogo} alt="account-image" className='user-icon' /></a>
            </div>
        </nav>  
    );
}
