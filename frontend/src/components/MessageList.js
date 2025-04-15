// src/components/MessageList.js
import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messages-container">
      <ul className="messages-list">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`message ${message.isNotification ? 'notification' : 
              message.user === currentUser ? 'own-message' : 'other-message'}`}
          >
            {!message.isNotification && (
              <div className="message-header">
                <span className="message-user">{message.user === currentUser ? 'You' : message.user}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            )}
            <div className="message-text">{message.text}</div>
            <div ref={messagesEndRef} />
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;