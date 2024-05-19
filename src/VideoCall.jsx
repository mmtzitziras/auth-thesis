/* eslint-disable no-unused-vars */
import './VideoCall.css'
import React, {useRef, useEffect, useState} from 'react'
import Call from './Call'



export default function VideoCall(){
    return (
        <div className="video-call">
            <div className='video'>
                <Call/>
            </div>
        </div>
    );
}