import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiUser, FiAward, FiFileText, FiCalendar, FiUsers, FiLink, FiPhone, FiSave } from 'react-icons/fi';
import '../css/setup.css';

const SetupAccount = () => {
  const [form, setForm] = useState({
    username: '',
    skills: '',
    bio: '',
    birthday: '',
    gender: '',
    social_links: '',
    contact_number: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.username) {
          navigate('/profile');
        }
      } catch (err) {
        // No profile yet - do nothing
      }
    };
    checkExistingProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await axios.post('http://localhost:5000/api/profile/setup', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to save setup info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <header className="setup-header">
          <h1>Complete Your Profile</h1>
          <p className="setup-subtitle">Let's get to know you better</p>
        </header>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="avatar-upload-section">
            <div className="avatar-preview-container">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <FiUser size={32} />
                </div>
              )}
            </div>
            <label className="avatar-upload-btn">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="avatar-input" 
              />
              <FiUpload className="upload-icon" />
              <span>Upload Photo</span>
            </label>
          </div>

          <div className="form-section">
            <h2 className="section-title"><FiUser /> Basic Information</h2>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                placeholder="Enter your username" 
                required 
              />
            </div>

            <div className="form-group">
              <label><FiFileText /> Bio</label>
              <textarea 
                name="bio" 
                value={form.bio} 
                onChange={handleChange} 
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FiCalendar /> Birthday</label>
                <input 
                  type="date" 
                  name="birthday" 
                  value={form.birthday} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label><FiUsers /> Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><FiAward /> Skills & Expertise</h2>
            <div className="form-group">
              <label>Your Skills (comma separated)</label>
              <textarea 
                name="skills" 
                value={form.skills} 
                onChange={handleChange} 
                placeholder="e.g., JavaScript, Python, Design"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><FiLink /> Contact Information</h2>
            <div className="form-group">
              <label>Social Links (one per line)</label>
              <textarea 
                name="social_links" 
                value={form.social_links} 
                onChange={handleChange} 
                placeholder="https://linkedin.com/yourprofile\nhttps://github.com/yourusername"
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
                placeholder="+(63) 945189326" 
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : (
              <>
                <FiSave /> Complete Profile Setup
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupAccount;