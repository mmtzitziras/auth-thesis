/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { CallingState, StreamTheme, StreamCall, StreamVideo, StreamVideoClient, useCall, useCallStateHooks,ParticipantView} from '@stream-io/video-react-sdk';
import {
    CallControls,
    SpeakerLayout,
  } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './Call.css'

const apiKey = 'mmhfdzb5evj2'; // the API key can be found in the "Credentials" section
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiR2lsYWRfUGVsbGFlb24iLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dpbGFkX1BlbGxhZW9uIiwiaWF0IjoxNzE2MDI0MTkyLCJleHAiOjE3MTY2Mjg5OTd9.vVq1M0GT36Q1A1Kgz6fT-fPKxs4bxwpsV_Pmh9eMO94'; // the token can be found in the "Credentials" section
const userId = 'Gilad_Pellaeon'; // the user id can be found in the "Credentials" section
const callId = 'pNeSzSuw1GSM'; // the call id can be found in the "Credentials" section

// set up the user object
const user = {
  id: userId,
  name: 'Marios Tzitziras',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export default function Call() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
    const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  
    const callingState = useCallCallingState();
    const localParticipant = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
  
    if (callingState !== CallingState.JOINED) {
      return <div>Loading...</div>;
    }
  
    return (
        
        <StreamTheme>
            {/* <MyParticipantList participants={remoteParticipants} />
            <MyFloatingLocalParticipant participant={localParticipant} /> */}
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


