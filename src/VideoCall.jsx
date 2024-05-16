/* eslint-disable no-unused-vars */
import './VideoCall.css'
import React, {useRef, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader



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
            <video ref={videoRef}></video>
            <button onClick={stopVideo}>STOP</button>
            <button onClick={getVideo}>START</button>
        </div>
    );
}