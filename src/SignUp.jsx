/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, Link, Navigate } from "react-router-dom";


export default function SignUp(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    
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
            <div className='sign-up-container'>
                <div className="background">
                    <div className="shape" />
                    <div className="shape" />
                </div>
                <form className='sign-form'>
                    <h3>Register Here</h3>
                    <label htmlFor="username">Username</label>
                    <input className='sign-input' type="text" placeholder="Username" id="username" />
                    <label htmlFor="username">Email</label>
                    <input className='sign-input' type="text" placeholder="Email" id="username" />
                    <label htmlFor="password">Password</label>
                    <input  className='sign-input'type="password" placeholder="Password" id="password" />
                    <button className='register' onClick={()=>{
                        navigate("/meeting")
                    }}>Register</button>
                    <div className="social">
                        <div className="go">
                            <i className="fab fa-google" /> Google
                        </div>
                        <div className="fb">
                            <i className="fab fa-facebook" /> Facebook
                        </div>
                    </div>
                    <div className='already'><p>Already have an account? <Link to="/signin">LOG IN!</Link></p></div>
                </form>
        </div>
    </>);
}