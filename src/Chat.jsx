/* eslint-disable no-unused-vars */
import './Chat.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import sendButton from './assets/send-button.svg'



export default function Chat(){
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'User',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <div className="chat-app">
    
        <div className="messages">
        
            {messages.map((message) => (
            <div key={message.id} className={message.sender === 'User' ? 'user-message' : 'other-message'}>
                <div className='message-text'>{message.text}</div>
                <div className="timestamp">{message.timestamp}</div>
            </div>
            ))}
        </div>
        <div className="input-area">
            <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}><img src={sendButton} alt="buttonimage" /></button>
        </div>
    </div>
  );
}