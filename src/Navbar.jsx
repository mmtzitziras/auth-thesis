/* eslint-disable no-unused-vars */
import './Navbar.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import accountLogo from './assets/account.svg'


export default function Navbar(){
    return ( 
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">
                    Meetings App
                </a>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                <li>
                    <a href="/products">Start a Meeting</a>
                </li>
                <li>
                    <a href="/about">About Us</a>
                </li>
                </ul>
            </div>
            <div className="navbar-right">
                <p href="/account" className="user-icon">UserName</p>
                <a href="/account"><img src={accountLogo} alt="account-image" className='user-icon' /></a>
            </div>
        </nav>  
    );
}