// Backend server setup with Express and Socket.io
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
app.use(cors({
  origin: ["http://localhost:3000", "https://monumental-tarsier-41bacd.netlify.app/"]
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://monumental-tarsier-41bacd.netlify.app/"],
    methods: ["GET", "POST"]
  }
});

// Store connected users and messages
const users = {};
const messages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle user joining
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userJoined', { 
      id: socket.id, 
      username, 
      users: Object.values(users),
      message: `${username} has joined the chat!`
    });
    
    // Send existing messages to new user
    socket.emit('previousMessages', messages);
  });
  
  // Handle new messages
  socket.on('sendMessage', (data) => {
    const message = {
      id: Date.now().toString(),
      user: users[socket.id],
      text: data.message,
      timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    if (messages.length > 100) messages.shift(); // Keep only last 100 messages
    
    io.emit('newMessage', message);
  });
  
  // Handle typing indicator
  socket.on('typing', () => {
    socket.broadcast.emit('userTyping', {
      user: users[socket.id]
    });
  });
  
  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStoppedTyping', {
      user: users[socket.id]
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      io.emit('userLeft', { 
        id: socket.id, 
        username: users[socket.id],
        message: `${users[socket.id]} has left the chat.`
      });
      delete users[socket.id];
    }
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});