/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { auth, db } from './firebase/firebase';
import { getDoc, doc } from 'firebase/firestore';
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
  CancelCallConfirmButton} from '@stream-io/video-react-sdk';

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


export default function Call(props) {

  const [userDetails, setUserDetails] = useState(null);
  const [callId, setCallId] = useState(null);
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
          setJoinCreate('Join');
          setStartCall(true);
      } catch (error) {
          console.log(error.message);
      }
  };

  const handleCreateCall = async (e) => {
    e.preventDefault();
    try {
      setJoinCreate('Create');
      setStartCall(true);
    } catch (error) {
        console.log(error.message);
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

  if (user.name != ' '){
    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('default', callId);
    if (joinCreate == 'Join'){
      call.join();
    }
    else{
      call.join({create: true});
    }
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout />
        </StreamCall>
      </StreamVideo>
    );
  }

  
  
}

export const MyUILayout = () => {
    const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  
    const callingState = useCallCallingState();
   
    // if (callingState !== CallingState.JOINED) {
    //   return <a className="pulsingButton" href="/">GO BACK</a>;
      
    // }
    async function handleLeave() {
      try {
        window.location.href = "/";
        console.log("User logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }

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
              <CancelCallConfirmButton onClick={handleLeave}></CancelCallConfirmButton>
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


