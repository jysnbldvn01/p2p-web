import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiSave, FiX, FiUser, FiPhone, FiLink } from 'react-icons/fi';
import '../css/profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({
    username: '',
    skills: '',
    bio: '',
    birthday: '',
    gender: '',
    social_links: '',
    contact_number: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm(res.data);
        if (res.data.avatar) {
          setAvatarPreview(`http://localhost:5000/uploads/${res.data.avatar}`);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      await axios.post('http://localhost:5000/api/profile/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarFile(null);
      alert('Avatar uploaded successfully!'); 

      setShowAvatarEdit(false);
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Avatar update failed:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key]);
    });
    try {
      await axios.post('http://localhost:5000/api/profile/setup', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditMode(false);
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="account-settings">
      <div className="settings-container">
        <div className="settings-header">
          <h2>Account Settings</h2>
          <div className="header-actions">
            {editMode ? (
              <>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  <FiX /> Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  <FiSave /> Save Changes
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <FiEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="settings-body">
          <div className="profile-header">
          <div className="avatar-section">
            <div 
              className="avatar-wrapper"
              onMouseEnter={() => setShowAvatarEdit(true)}
              onMouseLeave={() => !avatarFile && setShowAvatarEdit(false)}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <FiUser size={32} />
                </div>
              )}
              
              {showAvatarEdit && (
                <label className="avatar-edit-icon">
                  <FiEdit className="edit-icon" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    style={{ display: 'none' }} 
                  />
                </label>
              )}
            </div>
            
            {avatarFile && (
              <div className="avatar-actions">
                <button className="avatar-save-btn" onClick={handleAvatarSave}>
                  <FiSave /> Save
                </button>
                <button className="avatar-cancel-btn" onClick={() => {
                  if (profile?.avatar) {
                    setAvatarPreview(`http://localhost:5000/uploads/${profile.avatar}`);
                  } else {
                    setAvatarPreview('');
                  }
                  setAvatarFile(null);
                }}>
                  <FiX /> Cancel
                </button>
              </div>
              )}
            </div>
            
            <div className="profile-header-info">
              <h1>{profile?.username || 'User'}</h1>
              <p className="profile-title">{profile?.bio || 'No bio yet'}</p>
              <div className="profile-stats">
              </div>
            </div>
          </div>

          {profile ? (
            <div className="profile-sections">
              {/* Personal Info Section */}
              <div className="profile-section">
                <h3><FiUser /> Personal Information</h3>
                {editMode ? (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        name="username" 
                        value={form.username} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea 
                        name="bio" 
                        value={form.bio} 
                        onChange={handleChange} 
                        rows="3" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Birthday</label>
                      <input 
                        type="date" 
                        name="birthday" 
                        value={form.birthday?.split('T')[0]} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select name="gender" value={form.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Username</span>
                      <span className="info-value">{profile.username}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bio</span>
                      <p className="info-value">{profile.bio || 'No bio yet'}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Birthday</span>
                      <span className="info-value">{profile.birthday?.split('T')[0] || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender</span>
                      <span className="info-value">{profile.gender || 'Not specified'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="profile-section">
                <h3>Skills & Expertise</h3>
                {editMode ? (
                  <div className="form-group">
                    <label>Skills (comma separated)</label>
                    <input 
                      type="text" 
                      name="skills" 
                      value={form.skills} 
                      onChange={handleChange} 
                    />
                  </div>
                ) : (
                  <div className="skills-display">
                    {profile.skills ? (
                      profile.skills.split(',').map((skill, i) => (
                        <span key={i} className="skill-tag">{skill.trim()}</span>
                      ))
                    ) : (
                      <p className="no-skills">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="profile-section">
                <h3><FiLink /> Contact Information</h3>
                {editMode ? (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Social Links (one per line)</label>
                      <textarea 
                        name="social_links" 
                        value={form.social_links} 
                        onChange={handleChange} 
                        rows="3" 
                      />
                    </div>
                    <div className="form-group">
                      <label><FiPhone /> Contact Number</label>
                      <input 
                        type="text" 
                        name="contact_number" 
                        value={form.contact_number} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Social Links</span>
                      <div className="info-value">
                        {profile.social_links ? (
                          profile.social_links.split('\n').map((link, i) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="social-link">
                              {link}
                            </a>
                          ))
                        ) : 'No links provided'}
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Contact Number</span>
                      <span className="info-value">{profile.contact_number || 'Not specified'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;