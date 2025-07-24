import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/notification.css';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, [activeTab]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const url =
      activeTab === 'archived'
        ? 'http://localhost:5000/api/notifications/archived'
        : 'http://localhost:5000/api/notifications';

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const archiveNotification = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error('Failed to archive notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="account-settings">
      <div className="settings-container">
        {/* Header - Matching Profile Style */}
        <div className="settings-header">
          <h2>Notifications</h2>
          {profile && (
            <div className="header-actions">
              <div className="avatar-wrapper" style={{ width: 50, height: 50 }}>
                <img
                  src={`http://localhost:5000/uploads/${profile.avatar}`}
                  alt="Avatar"
                  className="avatar"
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Bar - Matching Profile Inputs */}
        <div className="notification-search">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍︎</span>
        </div>

        {/* Body - Matching Profile Sections */}
        <div className="profile-sections">
          <div className="profile-section">
            <div className="notification-tabs">
              <button
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Notifications
              </button>
              <button
                className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
                onClick={() => setActiveTab('archived')}
              >
                Archived
              </button>
            </div>

            <div className="notification-list">
              {filteredNotifications.length === 0 ? (
                <div className="empty-state">
                  <p>No notifications found</p>
                  {activeTab === 'archived' ? (
                    <span>Your archived notifications will appear here</span>
                  ) : (
                    <span>You're all caught up!</span>
                  )}
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div className="notification-card" key={notification.id}>
                    <div className="notification-icon">
                      {notification.type === 'request' ? '🤝' : '💬'}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.sender_name}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    {activeTab === 'all' && (
                      <button
                        className="archive-button"
                        onClick={() => archiveNotification(notification.id)}
                        title="Archive notification"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;