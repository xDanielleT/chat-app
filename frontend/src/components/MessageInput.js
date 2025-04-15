// src/components/MessageInput.js
import React, { useState, useEffect } from 'react';

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    if (typingTimeout) clearTimeout(typingTimeout);
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTyping(false);
      if (typingTimeout) clearTimeout(typingTimeout);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type your message..."
        className="message-input"
      />
      <button type="submit" className="send-button">Send</button>
    </form>
  );
}

export default MessageInput;