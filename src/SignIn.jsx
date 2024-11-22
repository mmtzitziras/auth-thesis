/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, Link, Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle} from './firebase/auth';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import { useAuth } from './contexts/authContext';
import { auth , db} from './firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';
export default function SignIn(){

    // const {userLoggedIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in Successfully");
            window.location.href = "/";
        } catch (error) {
            console.log(error.message);
        }
    };
    
    function googleLogin(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async(result) => {
            const user = result.user;
            await setDoc(doc(db, "Users", user.uid),{
                email: user.email,
                name: user.displayName,
                token: "",
                photo: user.photoURL,
            });
            console.log(result);
            if(result.user){
                window.location.href = '/';
            }
        })
    }
    return(
        <>
            <div className='sign-in-container'>
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <form onSubmit={handleSubmit} className='sign-form'>
                    <h3>Login</h3>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                        type="email"
                        className='sign-input'
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                        type="password"
                        className='sign-input'
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="social">
                            <div onClick={googleLogin} className="go">
                                <i className="fab fa-google" /> 
                            </div>
                            <div className="fb">
                                <i className="fab fa-facebook" />
                            </div>
                        </div>
                    <div className="d-grid">
                        <button type="submit" className="btn sign-in-btn">
                        Submit
                        </button>
                    </div>
                    <div className='already'><p>Create an account <Link to="/sign-up">HERE!</Link></p></div>
                    {/* <SignInwithGoogle/> */}
                </form>
            </div>
            
        </>)
}