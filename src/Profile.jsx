import React, { useEffect, useState } from "react";
import { auth, db } from './firebase/firebase';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, Link, Navigate } from "react-router-dom";
import './Profile.css'
import { text } from "@fortawesome/fontawesome-svg-core";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState("");
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/sign-in";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
    <>
        <div className='sign-in-container'>
            <div className="lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="profile-form">
                {userDetails ? (
                        <>
                        <h1>Welcome!</h1>
                        <img className="profile-image" src={userDetails.photo} width={"40%"} style={{borderRadius: "50%"}} alt="user_photo" />
                        <div>
                            <p>Email: {userDetails.email}</p>
                            <p>Name: {userDetails.name}</p>
                            {userDetails.token && userDetails.token.trim() !== "" ? (
                            <p style={{color:"green", textAlign:"center", marginTop: "20px"}}>Token is set! <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault(); // Prevent the default link behavior
                              try {
                                const user = auth.currentUser; // Get the current user
                                if (user) {
                                  await updateDoc(doc(db, "Users", user.uid), { token: "" }); // Update the token to an empty string
                                  window.location.reload(); // Optionally reload the page or reset the state
                                }
                              } catch (error) {
                                console.error("Error deleting token:", error.message);
                              }
                            }}
                            style={{
                              color: "red",
                              cursor: "pointer",
                              textDecoration: "underline",
                              marginLeft: "10px",
                            }}
                          >
                            Delete!
                          </a></p>
                            
                          ) : (
                            // If the token is empty, show the form
                            <form
                              onSubmit={ async(e) => {
                                e.preventDefault();
                                try {
                                  console.log(token)
                                  const user = auth.currentUser;
                                  if (user){
                                    await updateDoc(doc(db, "Users", user.uid),{
                                        token: token,
                                    });
                                  }
                                  window.location.href = "/";
                                } catch(error){
                                    console.log(error.message);
                                }
                              }}
                            >
                              <p style={{textAlign: "center", color: "yellow", marginTop: "20px"}}>Please provide your token:<a style={{color:"yellow"}} href="/token" target='_blank'>?</a></p>
                              <input
                                type="text"
                                name="token"
                                placeholder="Enter your token"
                                onChange={(e) => setToken(e.target.value)}
                                required
                                style={{
                                  padding: "10px",
                                  margin: "10px 0",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                  color: "black"
                                }}
                              />
                              <button
                                type="submit"
                                style={{
                                  padding: "10px 20px",
                                  borderRadius: "4px",
                                  border: "none",
                                  backgroundColor: "#007bff",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                Submit
                              </button>
                            </form>
                          )}
                        </div>
                        <div className="d-grid">
                            <button className="btn sign-out-btn" onClick={handleLogout}>
                                Logout
                            </button>
                            <button className="btn main-menu-btn">
                                <Link to="/main-page">Main Menu</Link>
                            </button>
                        </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
            </div>
                
        </div>
    </>
   );
}
export default Profile;