import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.email || !form.password) {
    setError('Please fill in all fields');
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', form);
    const token = res.data.token;
    localStorage.setItem('token', token);

    // ✅ Check if profile is already set up
    const profileRes = await axios.get('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLoading(false);
    alert('Login successful!');

    // ✅ Redirect based on profile
    if (profileRes.data && profileRes.data.username) {
      navigate('/home');
    } else {
      navigate('/setup-account');
    }

  } catch (err) {
    setLoading(false);
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to PeerFusion</h2>
          <p>Sign in to your account</p>
        </div>
        
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className={`error-message ${error ? 'show' : ''}`}>
              {error}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <a href="/register" onClick={(e) => { 
              e.preventDefault(); 
              navigate('/register'); 
            }}>Register now</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}