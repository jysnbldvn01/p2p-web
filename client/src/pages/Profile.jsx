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
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [viewAs, setViewAs] = useState(false);
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

  const yearLevels = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
    'Masteral Degree',
    'Professor'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        const initialSubjects = res.data.subject ? res.data.subject.split(',') : [];
        setSelectedSubjects(initialSubjects);
        setForm({
          ...res.data,
          role: res.data.role || 'Skill Learner',
          year_level: res.data.year_level || ''
        });
        if (res.data.avatar) {
          setAvatarPreview(`http://localhost:5000/uploads/${res.data.avatar}`);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile/subjects');
        setSubjectCategories(res.data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchProfile();
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'role' && e.target.value === 'Skill Learner') {
      setSelectedSubjects([]); // Clear subjects for learners
    }
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
    const formWithSubjects = {
      ...form,
      subject: form.role === 'Skill Learner' ? '' : selectedSubjects.join(',')
    };

    Object.keys(formWithSubjects).forEach(key => {
      if (formWithSubjects[key]) formData.append(key, formWithSubjects[key]);
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
          <button 
            className={`view-btn ${viewAs ? 'active' : ''}`}
            onClick={() => setViewAs(!viewAs)}
          >
            View As Public
          </button>
            {editMode ? (
              <>
                <button className="cancel-btn" onClick={() => setEditMode(false)}><FiX /> Cancel</button>
                <button className="save-btn" onClick={handleSave}><FiSave /> Save Changes</button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}><FiEdit /> Edit Profile</button>
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
                  <div className="avatar-placeholder"><FiUser size={32} /></div>
                )}
                {showAvatarEdit && (
                  <label className="avatar-edit-icon">
                    <FiEdit className="edit-icon" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
              {avatarFile && (
                <div className="avatar-actions">
                  <button className="avatar-save-btn" onClick={handleAvatarSave}><FiSave /> Save</button>
                  <button className="avatar-cancel-btn" onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(profile?.avatar ? `http://localhost:5000/uploads/${profile.avatar}` : '');
                  }}><FiX /> Cancel</button>
                </div>
              )}
            </div>

            <div className="profile-header-info">
              <h1>{profile?.username || 'User'}</h1>
              <p className="profile-title">{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>

          {profile && (
            <div className="profile-sections">
              <div className="profile-section">
                <h3><FiUser /> Personal Information</h3>
                {editMode ? (
                  <div className="form-grid">
                    {/* Standard editable fields */}
                    <div className="form-group">
                      <label>Username</label>
                      <input type="text" name="username" value={form.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" />
                    </div>
                    <div className="form-group">
                      <label>Birthday</label>
                      <input type="date" name="birthday" value={form.birthday?.split('T')[0]} onChange={handleChange} />
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
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" value={form.role} onChange={handleChange}>
                        <option value="Skill Learner">Skill Learner</option>
                        <option value="Skill Sharer">Skill Sharer</option>
                        <option value="Skill Sharer & Learner">Skill Sharer & Learner</option>
                      </select>
                    </div>

                    {/* Conditional subject selection */}
                    {(form.role !== 'Skill Learner') && (
                      <div className="form-group">
                        <label>Subjects</label>
                        <select name="subject" onChange={handleSubjectSelect}>
                          <option value="">Select Subject</option>
                          {subjectCategories.map(category => (
                            <optgroup key={category.id} label={category.name}>
                              {category.subjects.map(subject => (
                                !selectedSubjects.includes(subject.name) && (
                                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                                )
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="selected-subjects">
                          {selectedSubjects.map((subject, i) => (
                            <span key={i} className="subject-tag">
                              {subject}
                              <button onClick={() => removeSubject(subject)} className="remove-subject">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
                ) : (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Username</span>
                      <span className="info-value">{profile.username}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bio</span>
                      <span className="info-value">{profile.bio || 'No bio yet'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Birthday</span>
                      <span className="info-value">{profile.birthday?.split('T')[0] || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender</span>
                      <span className="info-value">{profile.gender || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role</span>
                      <span className="info-value">{profile.role}</span>
                    </div>
                    {(profile.role !== 'Skill Learner') && (
                      <div className="info-item">
                        <span className="info-label">Subjects</span>
                        <div className="info-value">
                          {profile.subject ? profile.subject.split(',').map((subj, i) => (
                            <span key={i} className="subject-tag">{subj.trim()}</span>
                          )) : 'Not specified'}
                        </div>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="info-label">Year Level</span>
                      <span className="info-value">{profile.year_level || 'Not specified'}</span>
                    </div>
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
          )}
        </div>
      </div>
      {viewAs && profile && (
        <div className="modal-overlay" onClick={() => setViewAs(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setViewAs(false)}>×</button>

            <div className="modal-avatar-container">
              {profile.avatar && (
                <img
                  src={`http://localhost:5000/uploads/${profile.avatar}`}
                  alt="Avatar"
                  className="modal-avatar"
                />
              )}
              <div className="modal-rating">⭐ {profile.rating || 'N/A'}</div>
            </div>

            <div className="modal-main">
              <h3>{profile.username}</h3>
              <p className="modal-role">{profile.role || 'N/A'}</p>
              <p className="modal-bio">{profile.bio || 'No bio yet'}</p>

              <div className="modal-section">
                <h4>Subject Expertise</h4>
                {profile.subject && profile.role !== 'Skill Learner' ? (
                  <div className="subject-tags">
                    {profile.subject.split(',').map((subject, i) => (
                      <span key={i} className="subject-tag">{subject.trim()}</span>
                    ))}
                  </div>
                ) : <p>N/A</p>}
              </div>

              <div className="modal-section">
                <h4>Year Level</h4>
                <p>{profile.year_level || 'N/A'}</p>
              </div>

              {profile.social_links && (
                <div className="modal-section">
                  <h4>Social Links</h4>
                  <div className="modal-social-links">
                    {profile.social_links.split('\n').map((link, i) => (
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
                  {profile.contact_number ? (
                    <a href={`tel:${profile.contact_number}`} className="contact-link">
                      📞 {profile.contact_number}
                    </a>
                  ) : 'Not provided'}
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

export default Profile;
