/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {Link } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';


export default function SignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister= async(e)=>{
        e.preventDefault();
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          if (user){
            await setDoc(doc(db, "Users", user.uid),{
                email: user.email,
                name: name.replace(/\s+/g, "_"),
                token: "",
                photo: 'https://getstream.io/random_svg/?id=oliver&name=' + name,
            });
          }
          window.location.href = "/";
          console.log("User registered successfully");
        } catch(error){
            console.log(error.message);
        }

    }

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
                    {/* <div className="mb-3">
                        <label>Token <a href="/token" target='_blank'>?</a></label>
                        <input
                        type="text"
                        className='sign-input'
                        onChange={(e) => setToken(e.target.value)}
                        />
                    </div> */}
                    <div className="social">
                        <div onClick={googleLogin} className="go">
                            <i className="fab fa-google" /> 
                        </div>
                        <div onClick={facebookLogin} className="fb">
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