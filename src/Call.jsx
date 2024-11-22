/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { auth, db } from './firebase/firebase';
import { getDoc, doc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, deleteDoc, getFirestore } from "firebase/firestore";
import { 
  CallingState, 
  StreamTheme, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  useCallStateHooks,
  ParticipantView,
  CallControls,
  SpeakerLayout,
  CancelCallConfirmButton,} from '@stream-io/video-react-sdk';

  import {
    CancelCallButton,
    SpeakingWhileMutedNotification,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    RecordCallButton,
  } from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './Call.css'
import { Navigate, redirect, useHref } from 'react-router-dom';


export default function Call({ sendData }) {
  const [call, setCall] = useState (undefined);
  const [userDetails, setUserDetails] = useState(null);
  const [callId, setCallId] = useState("");
  const [joinCreate, setJoinCreate] = useState(" ");
  const [startCall, setStartCall] = useState(false);
  const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
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


  

  const handleJoinCall = async (e) => {
      e.preventDefault();
      try {
        // Αναφορά στο collection activeCalls
        const activeCallsRef = collection(db, "activeCalls");
        const q = query(activeCallsRef, where("callId", "==", callId), where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
    
        // Έλεγχος αν υπάρχει το call
        if (querySnapshot.empty) {
          alert("The call does not exist or is no longer active. Please try again.");
          setCallId(""); // Καθαρισμός του πεδίου εισαγωγής
          return;
        }
    
        // Αν το call είναι ενεργό, ξεκινά η διαδικασία join
        setJoinCreate("Join");
        sendData(callId);
        setStartCall(true);
      } catch (error) {
        console.error("Error joining the call:", error.message);
        alert("An error occurred while trying to join the call. Please try again.");
      }
  };

  const handleCreateCall = async (e) => {
    e.preventDefault();
    try {
      setJoinCreate("Create");
  

      const activeCallsRef = collection(db, "activeCalls");
      const q = query(activeCallsRef, where("callId", "==", callId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { isActive: true, createdAt: new Date(), admin: userDetails.name, });
        });
        console.log("Room reactivated.");
      } else {
       
        await addDoc(activeCallsRef, {
          callId,
          isActive: true,
          createdAt: new Date(),
          admin: userDetails.name,
        });
        console.log("Room created.");
      }
  
      sendData(callId);
      setStartCall(true);
    } catch (error) {
      console.error("Error creating the call:", error.message);
      alert("An error occurred while trying to create the call. Please try again.");
    }
};

 
  const apiKey = 'gznn9kyeap2y';
  const apiSecret = 'v67xefarvsw8dwh2w6gmxnrtwdzmfrgpqjpk6chhw4hznmabff8aynfuacqdsun2';
 
  const user = {
    id: userDetails ? userDetails.name : ' ',
    name: userDetails ? userDetails.name : ' ',
    image: 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
  };

  const token = userDetails ? userDetails.token : ' ';

  if (startCall == false){
    return(
      <div>    
        <form  className='sign-form call-id-form'>
          <h3>Join or Create Call!</h3>        
          <div className="mb-3">
            <label>Call ID</label>
            <input
            type="text"
            className='sign-input'
            placeholder="Enter call id"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
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
    const call = client.call('default', callId);
    console.log(call.state.callingState);

    if (joinCreate == 'Join'){
      call.get();
      call.join({create: false});
    }else{
      call.getOrCreate();
      call.join({create: true});
    }

 
    
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout room={callId} call={call} currentUser={userDetails.name}/>
        </StreamCall>
      </StreamVideo>
    );
    
  }

  
  
}

export const MyUILayout = (props) => {
    const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
    const {room} = props;
    const {call} = props;
    const {currentUser} = props;

    async function handleLeave() {
      await call.leave();
    }
   
    async function handleEnd() {
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
        const activeCallsq = query(activeCallsRef, where("callId", "==", room));
        const activeCallsquerySnapshot = await getDocs(activeCallsq);


        let isAdmin = false;
        activeCallsquerySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.admin === currentUser) {
            isAdmin = true;
          }
        });

        if (isAdmin) {
          // Αν ο χρήστης είναι admin, τερματίζει το call
          activeCallsquerySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { isActive: false });
          });
          console.log("Call terminated by admin.");
          await call.endCall(); // Τερματισμός της κλήσης
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
    
      return () => unsubscribe(); // Καθαρισμός listener κατά την αποσύνδεση
    }, [room]);
    

    return (
        
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <div className="str-video__call-controls">
              <SpeakingWhileMutedNotification>
              <ToggleAudioPublishingButton />
              </SpeakingWhileMutedNotification>
              <ToggleVideoPublishingButton />
              <ScreenShareButton></ScreenShareButton>
              <RecordCallButton></RecordCallButton>
              <CancelCallButton onClick={handleEnd}></CancelCallButton>
            </div>
        </StreamTheme>
       
      
    );
};

export const MyParticipantList = ({ participants }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {participants.map((participant) => (
          <ParticipantView participant={participant} key={participant.sessionId} />
        ))}
      </div>
    );
  };



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


