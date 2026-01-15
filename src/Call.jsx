/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { auth, db } from './firebase/firebase';
import { toGreeklish } from 'greek-utils';
import LoadRecordings from './LoadRecordings';
import { getDoc, doc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { 
  CallingState, 
  StreamTheme, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  useCallStateHooks,
  ParticipantView,
  SpeakerLayout, 
  } from '@stream-io/video-react-sdk'; // Video call SDK components.

  import {
    CancelCallButton,
    SpeakingWhileMutedNotification,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    RecordCallButton,
  } from '@stream-io/video-react-sdk'; // Video call SDK components.

import '@stream-io/video-react-sdk/dist/css/styles.css'; // Styles for the video SDK.
import './Call.css' // Styles specific to the Call component.


export default function Call({ sendData }) {
  
  const [userDetails, setUserDetails] = useState(null); // State for storing authenticated user details.
  const [callName, setCallName] = useState(""); // State to store the current call Name.
  const [callId, setCallId] = useState(""); // State to store the current call ID.
  const [joinCreate, setJoinCreate] = useState(" "); // Indicates if the user is joining or creating a call.
  const [startCall, setStartCall] = useState(false); // Indicates if the call is started.
  
  // Fetch user details from Firestore
  const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
            } else {
                console.log("User is not logged in");
            }
        });
    };
    useEffect(() => {
        fetchUserData();
    }, []);

  
    const generateUniqueId = (callName) => {
      // Get the current timestamp in milliseconds
      const timestamp = Date.now().toString(36); // Convert to base-36 for compactness
    
      // Take the last 7 characters of the timestamp and append it to the call name
      return `${callName}-${timestamp.substring(timestamp.length - 7)}`;
    };


  // Handle joining an existing call
  const handleJoinCall = async (e) => {
      e.preventDefault();
      try {
        
        setCallId(toGreeklish(callName));
        const activeCallsRef = collection(db, "activeCalls");
        const q = query(activeCallsRef, where("callId", "==", toGreeklish(callName)), where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
    
        // Check if the call already exists.
        if (querySnapshot.empty || toGreeklish(callName) === "") {
          toast.error("The call does not exist or is no longer active. Please try again.")
          setCallName(""); // Clear the input field.
          return;
        }
    
        
        setJoinCreate("Join");
        sendData(toGreeklish(callName));
        setStartCall(true);
      } catch (error) {
        console.error("Error joining the call:", error.message);
        alert("An error occurred while trying to join the call. Please try again.");
      }
  };


  // Handle creating a new call
  const handleCreateCall = async (e) => {
    e.preventDefault();
    try {

      if (callName === "") {
        toast.error("Invalid call name. Please try again.");
        setCallName(""); // Clear the input field.
        return;
      }
      setJoinCreate("Create");
      const greeklishId = toGreeklish(callId);
      const greeklishName = toGreeklish(callName);

      const activeCallsRef = collection(db, "activeCalls");
      const q = query(activeCallsRef, where("callId", "==", toGreeklish(callId)));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { isActive: true, createdAt: new Date(), admin: userDetails.name, });
        });
        console.log("Room reactivated.");
      } else {
        
        
        await addDoc(activeCallsRef, {
          callId: greeklishId,
          callName: greeklishName,
          isActive: true,
          createdAt: new Date(),
          admin: userDetails.name,
        });
        console.log("Room created.");
      }
  
      sendData(greeklishId);
      setStartCall(true);
    } catch (error) {
      console.error("Error creating the call:", error.message);
      alert("An error occurred while trying to create the call. Please try again.");
    }
};

  // Stream Video client configuration
  const apiKey = 'gznn9kyeap2y';
 
  const user = {
    id: userDetails ? userDetails.name : ' ',
    name: userDetails ? userDetails.name : ' ',
    image: userDetails ? userDetails.photo : 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
  };

  const token = userDetails ? userDetails.token : ' ';



  // Conditional rendering based on whether the call has started
  // If the call isn't started the a form is rendered for the user to join or create a call.
  if (startCall == false){
    return(
      <div>    
        <form  className='sign-form call-id-form'>
          <h3>Join or Create Call!</h3>        
          <div className="mb-3">
            <label>Call Name</label>
            <input
            type="text"
            className='sign-input'
            placeholder="Enter call name"
            value={callName}
            onChange={(e) =>{ 
              setCallName(e.target.value.replace(/\s+/g, "_"));
              const uniqueId = generateUniqueId(e.target.value);
              setCallId(uniqueId);
            }}
            />
          </div>
          <div className="d-grid">
            <button onClick={handleJoinCall} className="btn sign-in-btn">
              Join Call
            </button>
          </div>
          <div className="d-grid">
            <button onClick={handleCreateCall} className="btn sign-in-btn">
            Create Call
            </button>
          </div>   
        </form>
      </div>
            
    );
  }

  else if (user.name != ' '){
    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('default', toGreeklish(callId));

    if (joinCreate == 'Join'){
      call.get();
      call.join({create: false});
    }else{
      call.getOrCreate();
      call.join({create: true});
    }

 
    // All call components.
    return (
      <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout room={toGreeklish(callId)} call={call} currentUser={userDetails.name}/>
        </StreamCall>
      </StreamVideo>
      </>
    );
    
  }

  
  
}

// Layout for the call interface
export const MyUILayout = (props) => {
    const {room} = props;
    const {call} = props;
    const {currentUser} = props;

    const handleCopyToClipboard = () => {
      if (room) {
        navigator.clipboard.writeText(room).then(
          () => {
            toast.success("Call ID copied to clipboard!");
          },
          (err) => {
            toast.error("Failed to copy call ID");
            console.error(err);
          }
        );
      } else {
        toast.error("No Call ID to copy!");
      }
    };

    // End the call and handle cleanup.
    // If the user is admin then the call is terminated for all.
    // If the user is not the admin, then he/she leaves.
    const handleEnd = async () => {
      try {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("room", "==", room));
        const querySnapshot = await getDocs(q);
    
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
          deletePromises.push(deleteDoc(doc.ref));
        });
        
        await Promise.all(deletePromises);
        console.log("All messages in the room have been deleted.");
        const activeCallsRef = collection(db, "activeCalls");
        const activeCalls = query(activeCallsRef, where("callId", "==", room));
        const activeCallsquerySnapshot = await getDocs(activeCalls);


        let isAdmin = false;
        activeCallsquerySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.admin === currentUser) {
            isAdmin = true;
          }
        });

        if (isAdmin) {
          activeCallsquerySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { isActive: false });
          });
          console.log("Call terminated by admin.");
          await call.deleteRecording();
          await call.endCall();
        } else {
          console.log("User is not admin. Leaving the call.");
          await call.leave();
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error deleting messages: ", error);
      }
    }



    useEffect(() => {
      const activeCallsRef = collection(db, "activeCalls");
      const q = query(activeCallsRef, where("callId", "==", room));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.isActive) {
            console.log("Call ended by the host.");
            window.location.href = "/";
          }
        });
      });
    
      return () => unsubscribe();
    }, [room]);
    
  

    return (
      <>
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <div className="str-video__call-controls">
            <button className='invite-button' onClick={handleCopyToClipboard} disabled={!room}>
              +
            </button> 
              <SpeakingWhileMutedNotification>
              <ToggleAudioPublishingButton />
              </SpeakingWhileMutedNotification>
              <ToggleVideoPublishingButton />
              <ScreenShareButton></ScreenShareButton>
              <RecordCallButton></RecordCallButton>
              <LoadRecordings call={call} />
              <CancelCallButton onClick={handleEnd}></CancelCallButton>
            </div>
        </StreamTheme>
      </>
    );
};

// This component renders a list of participants in the call.
export const MyParticipantList = ({ participants }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {participants.map((participant) => (
          <ParticipantView participant={participant} key={participant.sessionId} />
        ))}
      </div>
    );
  };


// This component displays the local participant in a floating view, for self-view during a video call.
export const MyFloatingLocalParticipant = ({ participant }) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          width: '240px',
          height: '135px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
          borderRadius: '12px',
        }}
      >
        <ParticipantView participant={participant} />
      </div>
    );
  };


