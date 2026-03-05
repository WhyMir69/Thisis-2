import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Header.css';

const Header = ({ title }) => {
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
    <header className="header">
      <div className="header-content">
        <div className="brand-section">
          <img 
            src="/pitchWiselogo.png" 
            alt="PitchWise Logo" 
            className="brand-logo-image"
          />
        </div>
        <div className="user-greeting">
          <span className="greeting-text">Welcome, {user?.full_name || user?.username || 'User'}</span>
          <img src={profileImage || `https://ui-avatars.com/api/?name=${user?.full_name || user?.username || 'User'}&background=random`} alt={user?.full_name || user?.username} className="header-avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;