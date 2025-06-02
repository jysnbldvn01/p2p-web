import React from 'react';
import '../css/page.css';

const Chat = () => {
  return (
   <div className="page-container">
      <h1>Welcome to PeerFusion®</h1>
      
      <div className="page-content">
        <ul className="menu-list">
          <li>Home</li>
          <li className="active">Chat</li>
          <li>Notifications</li>
          <li>Profile</li>
        </ul>
      </div>
    </div>
  );
};

export default Chat;