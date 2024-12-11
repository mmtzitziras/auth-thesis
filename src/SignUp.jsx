/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // React and hooks for managing state.
import { Link } from "react-router-dom"; // React Router for navigation.
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from 'firebase/auth'; // Firebase methods for user authentication.
import { auth, db } from './firebase/firebase'; // Firebase authentication and Firestore database.
import { getDoc, setDoc, doc } from 'firebase/firestore'; // Firestore functions to interact with user data.
import { toGreeklish } from 'greek-utils';



export default function SignUp(){

  // States to manage form inputs: name, email, and password.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");


  /**
   * Handles user registration using email and password.
   * On successful registration, the user is stored in Firestore and redirected to the homepage.
   */
  const handleRegister= async(e)=>{
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user){
          await setDoc(doc(db, "Users", user.uid),{
              email: user.email,
              name: toGreeklish(name).replace(/\s+/g, "_"),
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
                name: toGreeklish(user.displayName).replace(/\s+/g, "_"), // Replace spaces with underscores
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
                  name: toGreeklish(user.displayName).replace(/\s+/g, "_"), // Replace spaces with underscores
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
            {/* Decorative lines for styling */}
              <div className="lines">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
              </div>

              {/* Sign-up form */}
              <form onSubmit={handleRegister} className='sign-form'>
                  <h3>Sign Up</h3>
                  {/* Name input field */}
                  <div className="mb-3">
                      <label>Name</label>
                      <input
                      type="text"
                      className='sign-input'
                      onChange={(e) => setName(e.target.value)}
                      required
                      />
                  </div>

                  {/* Email input field */}
                  <div className="mb-3">
                      <label>Email address</label>
                      <input
                      type="email"
                      className='sign-input'
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      />
                  </div>
                  {/* Password input field */}
                  <div className="mb-3">
                      <label>Password</label>
                      <input
                      type="password"
                      className='sign-input'
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                      <button type="submit" className="btn register-btn">
                      Sign Up
                      </button>
                  </div>
                  <div className='already'><p>Already have an account? <Link to="/sign-in">LOG IN!</Link></p></div>
              </form>
      </div>
  </>);
}