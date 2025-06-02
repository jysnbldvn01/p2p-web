import React from 'react';
import '../css/page.css';

function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to PeerFusion®</h1>
      
      <div className="page-content">
        <ul className="menu-list">
          <li className="active" >Home</li>
          <li>Chat</li>
          <li>Notifications</li>
          <li>Profile</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;