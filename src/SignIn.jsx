/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, Link, Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle} from './firebase/auth';
import { useAuth } from '../../../projects/auth-thesis/src/contexts/authContext';

export default function SignIn(){

    // const {userLoggedIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault();
        if(!isSigningIn){
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
        }
    }

    const onGoogleSignIn = (e) =>{
        e.preventDefault();
        if(!isSigningIn){
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false);
            })
        }
    }
    
    return(
        <div className='sign-in-container'>
            {/* {userLoggedIn && (<Navigate to={'/'} replace={true}/>)} */}
            <div className="lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <form className='sign-form'>
                <h3>Login Here</h3>
                <label htmlFor="username">Username</label>
                <input className='sign-input' type="text" id="username" />
                <label htmlFor="password">Password</label>
                <input className='sign-input' type="password" id="password" />
                <button className='sign-in-btn'>Log In</button>
                <div className="social">
                    <div className="go">
                        <i className="fab fa-google" /> 
                    </div>
                    <div className="fb">
                        <i className="fab fa-facebook" /> 
                    </div>
                </div>
                <div className='already'><p>Create an account <Link to="/sign-up">HERE!</Link></p></div>
            </form>
        </div>);
}