import React from 'react';
import '../css/page.css';

const Notifications = () => {
  return (
   <div className="page-container">
      <h1>Welcome to PeerFusion®</h1>
      
      <div className="page-content">
        <ul className="menu-list">
          <li>Home</li>
          <li>Chat</li>
          <li className="active">Notifications</li>
          <li>Profile</li>
        </ul>
      </div>
    </div>
  );
};

export default Notifications;