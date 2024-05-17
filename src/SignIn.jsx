/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, Link, Navigate } from "react-router-dom";


export default function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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
        <div className='sign-in-container'>
            <div className="background">
                <div className="shape" />
                <div className="shape" />
            </div>
            <form className='sign-form'>
                <h3>Login Here</h3>
                <label htmlFor="username">Username</label>
                <input className='sign-input' type="text" placeholder="Email or Phone" id="username" />
                <label htmlFor="password">Password</label>
                <input className='sign-input' type="password" placeholder="Password" id="password" />
                <button className='sign-in-btn'>Log In</button>
                <div className="social">
                    <div className="go">
                        <i className="fab fa-google" /> Google
                    </div>
                    <div className="fb">
                        <i className="fab fa-facebook" /> Facebook
                    </div>
                </div>
                <div className='already'><p>Create an account <Link to="/">HERE!</Link></p></div>
            </form>
        </div>);
}