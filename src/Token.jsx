/* eslint-disable no-unused-vars */
import React, { useState } from 'react';


export default function Token(){

   return(
        <>
            <div className='sign-up-container'>
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <form  className='sign-form'>
                    <h3>How to generate token?</h3>
                    <br />
                    <p>Go to <a href="https://getstream.io/chat/docs/react/token_generator/" target='_blank'>this</a> site and enter the following: </p>
                    <br />
                    <ul>
                        <li>API Secret: v67xefarvsw8dwh2w6gmxnrtwdzmfrgpqjpk6chhw4hznmabff8aynfuacqdsun2</li>
                        <br />
                        <li>User Id: enter your username, which you will use to register. CAUTION: it has to be the same or you will not be able to start or join a call!</li>
                    </ul>
                </form>
        </div>
    </>);
}