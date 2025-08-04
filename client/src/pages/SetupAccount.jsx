import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiUser, FiAward, FiFileText, FiCalendar, FiUsers, FiLink, FiPhone, FiSave, FiX } from 'react-icons/fi';
import '../css/setup.css';

const SetupAccount = () => {
  const [form, setForm] = useState({
    username: '',
    bio: '',
    birthday: '',
    gender: '',
    social_links: '',
    contact_number: '',
    role: 'Skill Learner',
    year_level: ''
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const subjectOptions = [
    'Entrepreneurial Management',
    'Marketing Principles',
    'Strategic Management',
    'Feasibility Study',
    'Operations Management',
    'Human Resource Management',
    'Financial Management',
    'Business Ethics',
    'E-Commerce',
    'Accounting for Entrepreneurs'
  ];

  const yearLevels = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
    'Masteral Degree',
    'Professor'
  ];

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

  const handleSubjectSelect = (e) => {
    const value = e.target.value;
    if (value && !selectedSubjects.includes(value)) {
      setSelectedSubjects([...selectedSubjects, value]);
    }
    e.target.value = '';
  };

  const removeSubject = (subjectToRemove) => {
    setSelectedSubjects(selectedSubjects.filter(subject => subject !== subjectToRemove));
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
      const formWithSubjects = {
        ...form,
        subject: selectedSubjects.join(',')
      };
      
      for (const key in formWithSubjects) {
        if (formWithSubjects[key]) {
          formData.append(key, formWithSubjects[key]);
        }
      }
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await axios.post('http://localhost:5000/api/profile/setup', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
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

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="Skill Learner">Skill Learner</option>
                  <option value="Skill Sharer">Skill Sharer</option>
                  <option value="Skill Sharer & Learner">Skill Sharer & Learner</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year Level</label>
                <select name="year_level" value={form.year_level} onChange={handleChange}>
                  <option value="">Select Year Level</option>
                  {yearLevels.map((level, index) => (
                    <option key={index} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><FiAward /> Subjects</h2>
            <div className="form-group">
              <label>Subjects</label>
              <div className="subject-select-container">
                <select 
                  name="subject" 
                  onChange={handleSubjectSelect}
                  disabled={form.role === 'Skill Learner'}
                >
                  <option value="">Select Subject</option>
                  {subjectOptions
                    .filter(subject => !selectedSubjects.includes(subject))
                    .map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))
                  }
                </select>
                <div className="selected-subjects">
                  {selectedSubjects.map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                      <button 
                        type="button" 
                        onClick={() => removeSubject(subject)}
                        className="remove-subject"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
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