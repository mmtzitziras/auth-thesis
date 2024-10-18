/* eslint-disable no-unused-vars */
import './Chat.css'
import React, { useState , useEffect} from 'react'
import sendButton from './assets/send-button.svg'
import { addDoc, collection, serverTimestamp, doc, getDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase/firebase';
import { text } from '@fortawesome/fontawesome-svg-core';



export default function Chat(props){
  const {room} = props
  const [userDetails, setUserDetails] = useState(null);
  const messagesRef = collection(db, "messages")
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([])


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



    const user = {
      id: userDetails ? userDetails.name : ' ',
      name: userDetails ? userDetails.name : ' ',
      image: 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
    };

    useEffect(() => {
      const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
      if (room != ""){
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
          let messages = [];
          snapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id})
          });
          setMessages(messages);
      });
      return () => unsubscribe();}
      
    }, [room])
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newMessage === "") return;

      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: userDetails.name,
        room,
      });
      setNewMessage("");
    }
    if (user.name != " "){
      return (
        <div className="chat-app">
          <div className="chat-header">
            <h1>Welcome to: {room}</h1>
          </div>
          <div className='messages'>{messages.map((message) => 
            <div className="message" key={message.id}>
              <span className='user'>{message.user}</span>
              {message.text}
            </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className='new-message-form'>
            <input
            className='new-message-input'
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            />
            <button type='submit' className='send-button'><img src={sendButton} alt="buttonimage" /></button>
          </form>
        </div>
      );
    }
  
}