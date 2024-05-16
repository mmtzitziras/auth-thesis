/* eslint-disable no-unused-vars */
import './SignIn.css'
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import logo from './assets/UnityMeet-logo.png'

export default function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const navigate = useNavigate();

    // const handleClick = () => {
    //     navigate('./VideoCall.jsx');
    // }


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        setEmail('');
        setPassword('');
    };
    return(
        <>
            <div className="background">
                <div className="shape" />
                <div className="shape" />
            </div>
            <form>
                <h3>Login Here</h3>
                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Email or Phone" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" id="password" />
                <button>Log In</button>
                <div className="social">
                <div className="go">
                    <i className="fab fa-google" /> Google
                </div>
                <div className="fb">
                    <i className="fab fa-facebook" /> Facebook
                </div>
                </div>
            </form>
    </>);
}