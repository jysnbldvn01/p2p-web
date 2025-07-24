import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Share Your Skills",
      description: "Connect with peers and exchange knowledge in various fields",
      color: "#3498db"
    },
    {
      title: "Learn New Things",
      description: "Discover skills you want to learn from our community",
      color: "#2ecc71"
    },
    {
      title: "Build Your Network",
      description: "Expand your professional circle while sharing expertise",
      color: "#9b59b6"
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/profile/others', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="header-section">
      
        <h2>Skill Share</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or skills..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍︎</span>
        </div>
      </div>

      {/* New Banner Section */}
      <div className="banner-container">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundColor: slide.color }}
          >
            <div className="banner-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        <div className="banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.map(user => (
          <div className="user-card" key={user.id} onClick={() => setSelectedUser(user)}>
            {user.avatar && (
              <img
                src={`http://localhost:5000/uploads/${user.avatar}`}
                alt="Avatar"
                className="user-avatar"
              />
            )}
            <div className="user-rating">
              ⭐ 4.5
            </div>
            <div className="user-info">
              <p><strong>{user.username}</strong></p>
              <p className="skills">{user.skills}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedUser(null)}>×</button>
            
            <div className="modal-avatar-container">
              {selectedUser.avatar && (
                <img
                  src={`http://localhost:5000/uploads/${selectedUser.avatar}`}
                  alt="Avatar"
                  className="modal-avatar"
                />
              )}
              <div className="modal-rating">⭐ 4.5</div>
            </div>

            <div className="modal-main">
              <h3>{selectedUser.username}</h3>
              
              <div className="modal-section">
                <h4>Skills</h4>
                <p className="skills">{selectedUser.skills}</p>
              </div>

              <div className="modal-section">
                <h4>Contact</h4>
                <p>{selectedUser.contact_number || 'Not provided'}</p>
              </div>

              <div className="modal-actions">
                <button className="schedule-btn">📅 Request Session</button>
                <button className="report-btn">🚨 Report User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;