// src/components/Login.js
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    onLogin(username.trim());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Join the Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Join Chat</button>
        </form>
      </div>
    </div>
  );
}

export default Login;