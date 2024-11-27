import React, { useEffect, useState } from "react"; // React and hooks for state management and effects.
import { auth, db } from './firebase/firebase'; // Firebase authentication and Firestore database.
import { getDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore functions for managing documents.
import { Link } from "react-router-dom"; // Navigation utilities from React Router.
import './Profile.css'; // Styles specific to the Profile component.




function Profile() {
  // States to store user details and token
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState("");

  // Function to fetch user data from Firestore
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
  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Logout function
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
          {/* Decorative lines */}
            <div className="lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            {/* Profile form */}
            <div className="profile-form">
                {userDetails ? (
                        <>
                        <h1>Welcome!</h1>
                        <img className="profile-image" src={userDetails.photo} width={"40%"} style={{borderRadius: "50%"}} alt="user_photo" />
                        <div>
                            <p>Email: {userDetails.email}</p>
                            <p>Name: {userDetails.name}</p>
                            {/* Display token */}
                            {/* If token is already set */}
                            {userDetails.token && userDetails.token.trim() !== "" ? (
                            <p style={{color:"green", textAlign:"center", marginTop: "20px"}}>Token is set! <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                const user = auth.currentUser;
                                if (user) {
                                  await updateDoc(doc(db, "Users", user.uid), { token: "" });
                                  window.location.reload(); 
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
                          /* If token is not set */
                          ) : (
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
                        <p>Loading...</p> // Show loading state while fetching user data
                    )}
            </div>
                
        </div>
    </>
   );
}
export default Profile;