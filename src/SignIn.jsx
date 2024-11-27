/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // React and hooks for state management.
import { Link } from "react-router-dom"; // React Router for navigation.
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth'; // Firebase authentication methods.
import { auth, db } from './firebase/firebase'; // Firebase authentication and Firestore database.
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Firestore functions for managing user data.


export default function SignIn(){

    // States to manage email and password input fields.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


  /**
   * Handles form submission for email/password sign-in.
   * Authenticates the user with Firebase and redirects to the home page on success.
   */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior.
        try {
            await signInWithEmailAndPassword(auth, email, password); // Firebase email/password authentication.
            window.location.href = "/"; // Redirect to the home page on successful login.
        } catch (error) {
            console.log(error.message);
        }
    };


     /**
   * Handles Facebook login via Firebase.
   * Signs the user in using the Facebook popup method and stores their data in Firestore.
   */
    function facebookLogin(){
        const provider = new FacebookAuthProvider(); // Initialize Facebook provider.
        signInWithPopup(auth, provider).then(async(result) => {
            const user = result.user; // Extract the authenticated user.
            const credential = FacebookAuthProvider.credentialFromResult(result); // Get Facebook credential.
            const accessToken = credential.accessToken;
            const userRef = doc(db, "Users", user.uid);
            try {

              // Check if the user already exists in Firestore.
              const docSnap = await getDoc(userRef);
        
              if (!docSnap.exists()) {
                // If user doesn't exist, create a new document
                await setDoc(userRef, {
                  email: user.email,
                  name: user.displayName.replace(/\s+/g, "_"), // Replace spaces with underscores
                  token: "",
                  photo: 'https://getstream.io/random_svg/?id=oliver&name=' 
                  + user.displayName.replace(/\s+/g, "_"),
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
    
    /**
   * Handles Google login via Firebase.
   * Signs the user in using the Google popup method and stores their data in Firestore.
   */
    function googleLogin(){
        const provider = new GoogleAuthProvider(); // Initialize Google provider.
        signInWithPopup(auth, provider).then(async(result) => {
            const user = result.user;
            const userRef = doc(db, "Users", user.uid); // Firestore document reference for the user.
            try {
                const docSnap = await getDoc(userRef); // Check if the user already exists in Firestore.
          
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
              {/* Decorative lines for visual styling */}
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                {/* Login form */}
                <form onSubmit={handleSubmit} className='sign-form'>
                    <h3>Login</h3>
                    {/* Email input field */}
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

                    {/* Password input field */}
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

                    {/* Social login buttons */}
                    <div className="social">
                        <div onClick={googleLogin} className="go">
                            <i className="fab fa-google" /> 
                        </div>
                        <div onClick={facebookLogin} className="fb">
                            <i className="fab fa-facebook" />
                        </div>
                    </div>
                    {/* Submit button */}
                    <div className="d-grid">
                        <button type="submit" className="btn sign-in-btn">
                        Submit
                        </button>
                    </div>
                    <div className='already'><p>Create an account <Link to="/sign-up">HERE!</Link></p></div>
                </form>
            </div>
            
        </>)
}
