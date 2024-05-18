/* eslint-disable no-unused-vars */
import './VideoCall.css'
import React, {useRef, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import playButton from './assets/play-circle.svg'
import stopButton from './assets/stop-circle.svg'
import Call from './Call'



export default function VideoCall(){

    const videoRef = useRef(null);
    
    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({video:{width: 1920, height:1080}
            })
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error(err);
            })

    }

    const stopVideo = () => {
        const video = videoRef.current;
        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            video.srcObject = null;
        }
    }


    useEffect(() => {
        getVideo();
    }, [videoRef])


   
   

    return (
        <div className="video-call">
            {/* <video ref={videoRef}></video> */}
            <div className='video'>
                <Call/>
            </div>
        </div>
    );
}