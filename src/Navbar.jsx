/* eslint-disable no-unused-vars */
import './Navbar.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import accountLogo from './assets/account.svg'

import tholosLogoWhite from './assets/tholos-logo-transparent-white.png'


export default function Navbar(){
    return ( 
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">
                    <img src={tholosLogoWhite} alt="tholos" />
                </a>
            </div>
            
            <div className="navbar-right">
                <p href="/account" className="user-icon">Marios Tzitziras</p>
                <a href="/account"><img src={accountLogo} alt="account-image" className='user-icon' /></a>
            </div>
        </nav>  
    );
}