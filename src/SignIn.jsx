/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider  } from 'firebase/auth';
import { auth , db} from './firebase/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
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

    function facebookLogin(){
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider).then(async(result) => {
            const user = result.user;
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const userRef = doc(db, "Users", user.uid);
            try {
                const docSnap = await getDoc(userRef);
          
                if (!docSnap.exists()) {
                  // If user doesn't exist, create a new document
                  await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName.replace(/\s+/g, "_"), // Replace spaces with underscores
                    token: "",
                    photo: 'https://getstream.io/random_svg/?id=oliver&name=' + user.displayName.replace(/\s+/g, "_"),
                  });
                  console.log("New user created in Firestore.");
                } else {
                  console.log("User already exists in Firestore.");
                }
          
                // Redirect the user
                if (result.user) {
                  window.location.href = "/";
                }
              } catch (error) {
                console.error("Error checking/creating user in Firestore:", error.message);
              }
        })
    }
    
    function googleLogin(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async(result) => {
            const user = result.user;
            const userRef = doc(db, "Users", user.uid);
            try {
                const docSnap = await getDoc(userRef);
          
                if (!docSnap.exists()) {
                  // If user doesn't exist, create a new document
                  await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName.replace(/\s+/g, "_"), // Replace spaces with underscores
                    token: "",
                    photo: user.photoURL,
                  });
                  console.log("New user created in Firestore.");
                } else {
                  console.log("User already exists in Firestore.");
                }
          
                // Redirect the user
                if (result.user) {
                  window.location.href = "/";
                }
              } catch (error) {
                console.error("Error checking/creating user in Firestore:", error.message);
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
                        <div onClick={facebookLogin} className="fb">
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
