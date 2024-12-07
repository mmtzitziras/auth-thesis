import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebase"; // Adjust the import path for Firebase
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Recordings.css";
import Navbar from "./Navbar";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]); // Store all recordings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentUser, setCurrentUser] = useState(null); // Store current user details

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser({
          id: user.uid,
          name: user.displayName,
          email: user.email,
        });
        console.log("User signed in:", user);
      } else {
        // User is signed out
        setCurrentUser(null);
        console.error("No user is currently signed in.");
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch all recordings for the current user sorted by callId
  const fetchRecordings = async () => {
    if (!currentUser) {
      console.error("No user is currently signed in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recordingsCollection = collection(
        db,
        "Users",
        currentUser.id,
        "Recordings"
      );
      const querySnapshot = await getDocs(
        query(recordingsCollection, orderBy("callId"), orderBy("createdAt"))
      );

      const fetchedRecordings = [];
      querySnapshot.forEach((doc) => {
        fetchedRecordings.push(doc.data());
      });

      setRecordings(fetchedRecordings);
      console.log("Recordings fetched:", fetchedRecordings);
    } catch (err) {
      console.error("Error fetching recordings:", err.message);
      setError("Failed to fetch recordings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recordings whenever the current user changes
  useEffect(() => {
    if (currentUser) {
      fetchRecordings();
    }
  }, [currentUser]);

  // Group recordings by callId
  const groupRecordingsByCallId = (recordings) => {
    return recordings.reduce((grouped, recording) => {
      const { callId } = recording;
      if (!grouped[callId]) {
        grouped[callId] = [];
      }
      grouped[callId].push(recording);
      return grouped;
    }, {});
  };

  const groupedRecordings = groupRecordingsByCallId(recordings);

  return (
    <>
      <Navbar />
      <div className="recordings-container">
        <h1>All Recordings</h1>

        {/* Loading State */}
        {loading && <p>Loading recordings...</p>}

        {/* Error State */}
        {error && <p className="error">{error}</p>}

        {/* Render grouped recordings */}
        {!loading && !error && Object.keys(groupedRecordings).length > 0 ? (
          Object.entries(groupedRecordings).map(([callId, recordings]) => (
            <div key={callId} className="call-recordings-group">
              <h3>Call ID: {callId.slice(0, -8)}</h3>
              <ul className="recordings-list">
                {recordings.map((rec, index) => (
                  <li key={index} className="recording-item">
                    <p>Recording {index + 1}</p>
                    {/* Play the recording */}
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      Play
                    </a>
                    {/* Recording metadata */}
                    <p>
                      Duration:{" "}
                      {rec.duration ? `${rec.duration} minutes` : "N/A"}
                    </p>
                    <p>
                      Created At:{" "}
                      {rec.createdAt?.toDate?.().toLocaleString() || "N/A"}
                    </p>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          !loading && !error && <p>No recordings found for this user.</p>
        )}
      </div>
    </>
  );
};

export default Recordings;
