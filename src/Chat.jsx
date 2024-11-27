/* eslint-disable no-unused-vars */
import './Chat.css'; // Styles specific to the Chat component.
import React, { useState, useEffect, useRef } from 'react'; // React and hooks for managing state and effects.
import sendButton from './assets/send-button.svg'; // Send button image.
import { 
  addDoc, collection, serverTimestamp, doc, getDoc, onSnapshot, query, where, orderBy 
} from 'firebase/firestore'; // Firestore functions for real-time database interactions.
import { auth, db } from './firebase/firebase'; // Firebase authentication and Firestore database.



export default function Chat(props){
  const {room} = props // Destructure the `room` prop passed to the component.

  // States for managing user details, new messages, and all messages
  const [userDetails, setUserDetails] = useState(null);
  const messagesRef = collection(db, "messages")
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([])

  // Reference to the "messages" collection in Firestore.
  const messagesEndRef = useRef(null);


  // Scroll to the bottom of the messages list whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages change
  }, [messages]);

  // Fetch current user details from Firestore
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


    // User object to represent the current user in messages
    const user = {
      id: userDetails ? userDetails.name : ' ',
      name: userDetails ? userDetails.name : ' ',
      image: 'https://getstream.io/random_svg/?id=oliver&name=' + {name},
    };

    // Fetch messages for the current room in real-time
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
      return () => unsubscribe();} // Query messages specific to the room, ordered by creation time.
      
    }, [room])

    // Handle sending a new message
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newMessage === "") return; // Don't send empty messages.

      await addDoc(messagesRef, {
        text: newMessage, // Message content.
        createdAt: serverTimestamp(), // Timestamp for ordering messages.
        user: userDetails.name, // Name of the user sending the message.
        room, // Room ID to associate the message with.
        timestamp:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false }),
      });
      setNewMessage("");
    }
    if (user.name != " "){
      return (
        <div className="chat-app">
          {/* Chat header displaying the room name */}
          <div className="chat-header">
            <h1>Room: {room}</h1>
          </div>
          {/* Messages section */}
          <div className='messages'>{messages.map((message) => 
            <div className="message-container" key={message.id}>
              <span className='user'>{message.user} </span>
              <span className='message'>{message.text}</span>
              <span className='timestamp'>{message.timestamp}</span>
            </div>
            )}
            <div className='scroll-down' ref={messagesEndRef}></div>
          </div>
          {/* Input area for typing new messages */}
          <form onSubmit={handleSubmit} className='input-area'>
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