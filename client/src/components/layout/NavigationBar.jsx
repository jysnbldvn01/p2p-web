import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiMessageSquare, FiBell, FiChevronRight } from 'react-icons/fi';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import '../../css/sidebar.css';

const NavigationBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
    <div className={`sidebar ${isCollapsed ? 'collapsed sidebar-collapsed' : 'expanded sidebar-expanded'}`}>
      <button 
        className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
        onClick={toggleSidebar}
        style={{ left: isCollapsed ? '80px' : '250px' }}
      >
        <FiChevronRight className={`toggle-icon ${isCollapsed ? '' : 'rotated'}`} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        {!isCollapsed && (
          <div className="sidebar-header">
            <img src="/logo.png" alt="SkillShare Logo" className="logo" />
            <h2>SkillShare</h2>
          </div>
        )}

        <nav className="sidebar-nav">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FiHome className="icon" />
            {!isCollapsed && <span>Home</span>}
          </NavLink>

          <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FiMessageSquare className="icon" />
            {!isCollapsed && <span>Chat</span>}
          </NavLink>

          <NavLink to="/notifications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FiBell className="icon" />
            {!isCollapsed && <span>Notifications</span>}
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FiUser className="icon" />
            {!isCollapsed && <span>Profile</span>}
          </NavLink>
          
          <div className={`logout-container ${isCollapsed ? 'collapsed' : ''}`}>
            <button onClick={handleLogout} className="logout-btn">
              <RiLogoutCircleRLine className="icon" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>
      </div>
    </>
  );
};

export default NavigationBar;