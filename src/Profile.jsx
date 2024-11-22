import React, { useEffect, useState } from "react";
import { auth, db } from './firebase/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate, Link, Navigate } from "react-router-dom";
import './Profile.css'

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
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
                        <img className="profile-image" src={userDetails.photo} width={"40%"} style={{borderRadius: "50%"}} alt="" />
                        <div>
                            <p>Email: {userDetails.email}</p>
                            <p>Name: {userDetails.name}</p>
                            {/* <p>Last Name: {userDetails.lastName}</p> */}
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
//     <div>
//       {userDetails ? (
//         <>
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <img
//               src={userDetails.photo}
//               width={"40%"}
//               style={{ borderRadius: "50%" }}
//             />
//           </div>
//           <h1>Welcome!</h1>
//           <div>
//             <p>Email: {userDetails.email}</p>
//             <p>Name: {userDetails.name}</p>
//             {/* <p>Last Name: {userDetails.lastName}</p> */}
//           </div>
//           <button className="btn btn-primary" onClick={handleLogout}>
//             Logout
//           </button>
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
   );
}
export default Profile;