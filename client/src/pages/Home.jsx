import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
const slides = [
  {
    image: "/images/banner1.png",
    alt: "Share your skills"
  },
  {
    image: "/images/banner1.png",
    alt: "Learn new things"
  },
  {
    image: "/images/banner1.png",
    alt: "Build your network"
  }
];

  useEffect(() => {
    const fetchUsersAndSubjects = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch users
        const usersRes = await axios.get('http://localhost:5000/api/profile/others', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch subject categories
        const subjectsRes = await axios.get('http://localhost:5000/api/profile/subjects');
        setSubjectCategories(subjectsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchUsersAndSubjects();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.subject && user.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!selectedCategory) return matchesSearch;
    
    // Check if user has any subject from the selected category
    const userSubjects = user.subject?.split(',').map(s => s.trim()) || [];
    return matchesSearch && selectedCategory.subjects.some(subject => 
      userSubjects.includes(subject.name)
    );
  });

  return (
    <div className="home-container">
      <div className="header-section">
        <h2>PeerFusion SkillShare</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or subject..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon"></span>
        </div>
      </div>

      {/* Slide Banner */}
      <div className="banner-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.alt} className="banner-image" />
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
      {/* Subject Category Filter */}
            <div className="category-filter">
              <button 
                className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Subjects
              </button>
              {subjectCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory?.id === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.name}
                </button>
              ))}
            </div>
      {/* User Cards */}
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
            <div className="user-rating">⭐ {user.rating || '4.5'}</div>
            <div className="user-info">
              <h3 className="user-name">{user.username}</h3>
              <div className="user-details">
                <p className="user-subject">
                  <span className="detail-label">Subject:</span> {user.subject || 'N/A'}
                </p>
                <p className="user-level">
                  <span className="detail-label">Year Level:</span> {user.year_level || 'N/A'}
                </p>
                <p className="user-role">
                  <span className="detail-label">Role:</span> {user.role || 'N/A'}
                </p>
              </div>

              {user.social_links && (
                <div className="social-links-preview">
                  {user.social_links.split('\n').slice(0, 2).map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                      🔗 {link.length > 20 ? link.substring(0, 20) + '...' : link}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal View */}
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
              <div className="modal-rating">⭐ {selectedUser.rating || '4.5'}</div>
            </div>

            <div className="modal-main">
              <h3>{selectedUser.username}</h3>
              <p className="modal-role">{selectedUser.role || 'N/A'}</p>
              <p className="modal-role">{selectedUser.bio || 'N/A'}</p>
              

              <div className="modal-section">
                <h4>Subject Expertise</h4>
                <div className="subject-tags">
                  {selectedUser.subject?.split(',').map((subject, i) => (
                    <span key={i} className="subject-tag">{subject.trim()}</span>
                  )) || 'N/A'}
                </div>
              </div>

              <div className="modal-section">
                <h4>Year Level</h4>
                <p>{selectedUser.year_level || 'N/A'}</p>
              </div>

              {selectedUser.social_links && (
                <div className="modal-section">
                  <h4>Social Links</h4>
                  <div className="modal-social-links">
                    {selectedUser.social_links.split('\n').map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-social-link"
                      >
                        <span className="link-icon">🔗</span>
                        <span className="link-text">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h4>Contact</h4>
                <p className="contact-info">
                  {selectedUser.contact_number ? (
                    <a href={`tel:${selectedUser.contact_number}`} className="contact-link">
                      📞 {selectedUser.contact_number}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>

              <div className="modal-actions">
                <button className="schedule-btn">📅 Request Session</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;