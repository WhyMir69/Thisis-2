import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdHistory, MdPerson, MdSettings, MdHelp } from 'react-icons/md';
import { authAPI } from '../services/api';
import './Sidebar.css';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        // Load custom profile image from localStorage
        const savedImage = localStorage.getItem(`profile_image_${userData.id}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src="/pitchWiselogo.png" alt="PitchWise Logo" className="brand-logo-image" />
      </div>
      <div className="user-profile">
        <img src={profileImage || `https://ui-avatars.com/api/?name=${user?.full_name || user?.username || 'User'}&background=random`} alt={user?.full_name || user?.username} className="user-avatar" />
        <div className="user-info">
          <h3 className="user-name">{user?.full_name || user?.username || 'Loading...'}</h3>
          <p className="user-email">{user?.email || 'Loading...'}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MdDashboard className="nav-icon" /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MdHistory className="nav-icon" /> <span>Pitch History</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MdPerson className="nav-icon" /> <span>My Profile</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MdSettings className="nav-icon" /> <span>Settings</span>
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MdHelp className="nav-icon" /> <span>Help</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;