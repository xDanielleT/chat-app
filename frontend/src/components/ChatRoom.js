// src/components/ChatRoom.js
import React from 'react';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatRoom({ username, users, messages, typingUsers, onSendMessage, onTyping }) {
  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2>Users Online</h2>
        <UsersList users={users} currentUser={username} />
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <h2>Chat Room</h2>
          <p>Welcome, {username}!</p>
        </div>
        <MessageList messages={messages} currentUser={username} />
        <div className="typing-indicator">
          {typingUsers.length > 0 && (
            <p>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </p>
          )}
        </div>
        <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
      </div>
    </div>
  );
}

export default ChatRoom;