/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from "react-router-dom";
import { doCreateUserWithEmailPassword } from './firebase/auth';
import { useAuth } from './contexts/authContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';


export default function SignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [token, setToken] = useState("");

    const handleRegister= async(e)=>{
        e.preventDefault();
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          console.log(user)
          if (user){
            await setDoc(doc(db, "Users", user.uid),{
                email: user.email,
                name: name,
                token: token,
            });
          }
          window.location.href = "/";
          console.log("User registered successfully");
        } catch(error){
            console.log(error.message);
        }

    }

    return(
        <>
            <div className='sign-up-container'>
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <form onSubmit={handleRegister} className='sign-form'>
                    <h3>Sign Up</h3>

                    <div className="mb-3">
                        <label>Name</label>
                        <input
                        type="text"
                        className='sign-input'
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                        type="email"
                        className='sign-input'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                        type="password"
                        className='sign-input'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Token <a href="/token" target='_blank'>?</a></label>
                        <input
                        type="text"
                        className='sign-input'
                        onChange={(e) => setToken(e.target.value)}
                        required
                        />
                    </div>
                    <div className="social">
                        <div className="go">
                            <i className="fab fa-google" /> 
                        </div>
                        <div className="fb">
                            <i className="fab fa-facebook" />
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn register-btn">
                        Sign Up
                        </button>
                    </div>
                    <div className='already'><p>Already have an account? <Link to="/sign-in">LOG IN!</Link></p></div>
                </form>
        </div>
    </>);
}