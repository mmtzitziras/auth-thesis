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
  SpeakerLayout} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './Call.css'


// const apiKey = '45dqp56h7thu';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYXV0aC10aGVzaXMifQ.LAuj6HG91ktQ1yjkdPIJBGxins7gk66dDxAX8U9J-Bc';
// const callId = 'default_441ace83-3182-4fcd-9dd9-33199e808dee';
// const userId = 'auth-thesis';

// const fuser = auth.currentUser;
// const user = {
//   id: userId,
//   name: fuser.name,
//   image: 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
// };

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', callId);
// call.join({ create: true });

export default function Call() {

  const [userDetails, setUserDetails] = useState(null);
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

  const apiKey = '45dqp56h7thu';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYXV0aC10aGVzaXMifQ.LAuj6HG91ktQ1yjkdPIJBGxins7gk66dDxAX8U9J-Bc';
  const callId = 'default_441ace83-3182-4fcd-9dd9-33199e808dee';
  const userId = 'auth-thesis';

  const user = {
    id: userId,
    name: userDetails ? userDetails.name : ' ',
    image: 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
  };

  if (user.name != ' '){
    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('default', callId);
    call.join({ create: true });
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

    return (
        
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls />
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


