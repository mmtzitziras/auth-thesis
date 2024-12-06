// import React, { useState } from "react";

// const Recordings = ({ call }) => {
//   const [recordings, setRecordings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch recordings for the given call
//   const fetchRecordings = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await call.queryRecordings(); // Fetch recordings from the API
//       setRecordings(response.recordings);
//       console.log("Recordings fetched:", response.recordings);
//     } catch (err) {
//       console.error("Error fetching recordings:", err.message);
//       setError("Failed to fetch recordings. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle download of a recording
//   const handleDownload = (url, index) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `call-recording-${index + 1}.mp4`; // Customize file name if needed
//     link.click();
//   };

//   return (
//     <div className="recordings-container">
//       <h3>Recordings</h3>

//       {/* Button to Fetch Recordings */}
//       <button onClick={fetchRecordings} className="btn fetch-recordings-btn">
//         Fetch Recordings
//       </button>

//       {/* Loading State */}
//       {loading && <p>Loading recordings...</p>}

//       {/* Error State */}
//       {error && <p className="error">{error}</p>}

//       {/* Recordings List */}
//       {recordings.length > 0 ? (
//         <ul className="recordings-list">
//           {recordings.map((rec, index) => (
//             <li key={index} className="recording-item">
//               <p>Recording {index + 1}</p>
//               {/* Play the recording */}
//               <a
//                 href={rec.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn"
//               >
//                 Play
//               </a>
//               {/* Download the recording */}
//               <button
//                 onClick={() => handleDownload(rec.url, index)}
//                 className="btn"
//               >
//                 Download
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         !loading && !error && <p>No recordings found for this call.</p>
//       )}
//     </div>
//   );
// };

// export default Recordings;


import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebase"; // Import Firebase config and auth
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

const LoadRecordings = ({ call }) => {
  const [recordings, setRecordings] = useState([]); // Store recordings
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentUser, setCurrentUser] = useState(null); // Store current user details

  // Fetch the current user from Firebase Auth
  const fetchCurrentUser = () => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser({
        id: user.uid,
        name: user.displayName,
        email: user.email,
      });
    } else {
      console.error("No user is currently signed in.");
    }
  };

  // Fetch recordings and save new ones to Firestore
  const fetchRecordings = async () => {
    if (!currentUser) {
      console.error("Current user not found.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await call.queryRecordings();
      console.log(response);
      const newRecordings = response.recordings;

      if (newRecordings.length > recordings.length) {
        console.log("New recordings detected!");
        const newEntries = newRecordings; // Get only the new recordings
        await saveRecordingsToFirestore(newEntries);
        setRecordings(newRecordings); // Update state with all recordings
      }
    } catch (err) {
      console.error("Error fetching recordings:", err.message);
      setError("Failed to fetch recordings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save recordings to Firestore under the current user's subcollection
  const saveRecordingsToFirestore = async (recordingsList) => {
    if (!currentUser) {
      console.error("Current user not found.");
      return;
    }

    try {
      const recordingsCollection = collection(
        db,
        "Users",
        currentUser.id,
        "Recordings"
      );

      for (const recording of recordingsList) {
        // Validate recording properties
        if (!recording || !recording.url) {
          console.warn("Skipping invalid recording:", recording);
          continue;
        }

        // Check if the recording already exists in Firestore to avoid duplicates
        const querySnapshot = await getDocs(
          query(recordingsCollection, where("filename", "==", recording.filename))
        );

        if (querySnapshot.empty) {
          const start = new Date(recording.start_time);
          const end =  new Date(recording.end_time);
          const durationMins = (end - start)/(1000 * 60);
          await addDoc(recordingsCollection, {
            filename: recording.filename,
            recordedBy: currentUser.id,
            url: recording.url,
            duration: Math.round(durationMins) || null,
            createdAt: new Date(),
            callId: call.id,
          });

          console.log(`Recording saved to Firestore: ${recording.url}`);
        } else {
          console.log(`Recording already exists in Firestore: ${recording.url}`);
        }
      }
    } catch (error) {
      console.error("Error saving recordings to Firestore:", error.message);
    }
  };

  // Fetch current user when the component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Poll for new recordings periodically
  useEffect(() => {
    const POLLING_INTERVAL = 5000; // 5 seconds
    const intervalId = setInterval(fetchRecordings, POLLING_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [currentUser, recordings]);

  // Handle download of a recording
  const handleDownload = (url, index) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `call-recording-${index + 1}.mp4`; // Customize file name if needed
    link.click();
  }; 
}
export default LoadRecordings;


