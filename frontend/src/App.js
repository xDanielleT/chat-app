import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import './App.css';


const socket = io('https://chat-app-a6si.onrender.com', {
  transports: ['websocket'],
});


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on('userJoined', (data) => {
      setUsers(data.users);
      addNotification(data.message);
    });

    socket.on('userLeft', (data) => {
      addNotification(data.message);
    });

    socket.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userTyping', (data) => {
      setTypingUsers((prevTyping) => {
        if (!prevTyping.includes(data.user)) {
          return [...prevTyping, data.user];
        }
        return prevTyping;
      });
    });

    socket.on('userStoppedTyping', (data) => {
      setTypingUsers((prevTyping) => 
        prevTyping.filter(user => user !== data.user)
      );
    });

    return () => {
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('previousMessages');
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
    socket.emit('join', username);
  };

  const sendMessage = (message) => {
    socket.emit('sendMessage', { message });
  };

  const handleTyping = (isTyping) => {
    if (isTyping) {
      socket.emit('typing');
    } else {
      socket.emit('stopTyping');
    }
  };

  const addNotification = (message) => {
    const notification = {
      id: Date.now().toString(),
      user: 'System',
      text: message,
      isNotification: true,
      timestamp: new Date().toISOString()
    };
    setMessages((prevMessages) => [...prevMessages, notification]);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom
          username={username}
          users={users}
          messages={messages}
          typingUsers={typingUsers}
          onSendMessage={sendMessage}
          onTyping={handleTyping}
        />
      )}
    </div>
  );
}

export default App;
