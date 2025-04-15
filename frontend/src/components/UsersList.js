// src/components/UsersList.js
import React from 'react';

function UsersList({ users, currentUser }) {
  return (
    <ul className="users-list">
      {users.map((user, index) => (
        <li key={index} className={user === currentUser ? 'current-user' : ''}>
          {user} {user === currentUser && '(You)'}
        </li>
      ))}
    </ul>
  );
}

export default UsersList;

