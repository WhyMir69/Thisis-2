import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { MdEdit, MdEmail, MdPerson, MdLogout, MdCameraAlt } from 'react-icons/md';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setEditForm({
          full_name: userData.full_name || '',
          username: userData.username || '',
          email: userData.email || ''
        });
        // Load profile image from localStorage or use backend image
        const savedImage = localStorage.getItem(`profile_image_${userData.id}`);
        if (savedImage) {
          setImagePreview(savedImage);
        } else if (userData.profile_image) {
          setImagePreview(userData.profile_image);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview and save immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);
        // Save to localStorage immediately
        if (user?.id) {
          localStorage.setItem(`profile_image_${user.id}`, imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form if canceling
      setEditForm({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        full_name: editForm.full_name,
        username: editForm.username,
      };
      
      // Include profile image if changed
      if (imagePreview && imagePreview !== user.profile_image) {
        updateData.profile_image = imagePreview;
      }
      
      // Call backend API to update user
      const updatedUser = await authAPI.updateCurrentUser(updateData);
      
      // Update local state with response from backend
      setUser(updatedUser);
      setIsEditing(false);
      
      // Update localStorage for profile image
      if (updatedUser.profile_image) {
        localStorage.setItem(`profile_image_${updatedUser.id}`, updatedUser.profile_image);
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large" onClick={handleImageClick}>
              <img 
                src={imagePreview || `https://ui-avatars.com/api/?name=${user?.full_name || user?.username || 'User'}&size=120&background=3b82f6&color=fff&bold=true`}
                alt={user?.full_name || user?.username}
              />
              <div className="avatar-overlay">
                <MdCameraAlt className="camera-icon" />
                <span>Change Photo</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <h3 className="profile-name">{user?.full_name || user?.username}</h3>
            <p className="profile-member-since">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>

          <div className="profile-info-section">
            <div className="profile-info-header">
              <h4>Account Information</h4>
              <button className="btn-edit" onClick={handleEditToggle}>
                <MdEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="profile-info-grid">
              <div className="info-field">
                <label>
                  <MdPerson className="field-icon" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={editForm.full_name}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{user?.full_name || 'Not set'}</p>
                )}
              </div>

              <div className="info-field">
                <label>
                  <MdPerson className="field-icon" />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{user?.username}</p>
                )}
              </div>

              <div className="info-field">
                <label>
                  <MdEmail className="field-icon" />
                  Email Address
                </label>
                <p>{user?.email}</p>
              </div>
            </div>

            {isEditing && (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <h4>Your Statistics</h4>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Total Pitches</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Avg Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Hours Practiced</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <MdLogout /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
