/* eslint-disable no-unused-vars */
import './Navbar.css'
import React, { useEffect, useState } from 'react'
import accountLogo from './assets/account.svg'
import { auth, db } from './firebase/firebase';
import { getDoc, doc } from 'firebase/firestore';
import tholosLogoWhite from './assets/tholos-logo-transparent-white.png'


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
                <a href="/" className="logo">
                    <img src={tholosLogoWhite} alt="tholos" />
                </a>
            </div>
            
            <div className="navbar-right">
                <p href="/account" className="user-icon">{userDetails.name}</p>
                <a href="/account"><img src={accountLogo} alt="account-image" className='user-icon' /></a>
            </div>
        </nav>  
    );
}