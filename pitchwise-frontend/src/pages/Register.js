import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    
    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.full_name || formData.full_name.length < 2) {
      errors.full_name = 'Please enter your full name';
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Register user
      await authAPI.register(formData);
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      
      // Parse specific error messages
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        // Check for specific field errors
        if (detail.toLowerCase().includes('email') && detail.toLowerCase().includes('already')) {
          setFieldErrors({ email: 'This email is already registered' });
          errorMessage = 'An account with this email already exists. Please login instead.';
        } else if (detail.toLowerCase().includes('username') && detail.toLowerCase().includes('already')) {
          setFieldErrors({ username: 'This username is already taken' });
          errorMessage = 'This username is already taken. Please choose another.';
        } else {
          errorMessage = detail;
        }
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (err.message.includes('validation')) {
        errorMessage = 'Please check your input and try again.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/pitchWiselogo.png" alt="PitchWise Logo" className="brand-logo-image" />
        <h2 className="create-account-text">Create Account</h2>
        <p className="join-text">Join us today and get started</p>
        <form className="register-form" onSubmit={handleSubmit}>
          {success && (
            <div className="success-message">
              ✓ Registration successful! Redirecting to login...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              ⚠ {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className={`input-wrapper ${fieldErrors.username ? 'error' : ''}`}>
              <MdPerson className="input-icon" />
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder="Choose a username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <MdPerson className="input-icon" />
              <input 
                type="text" 
                id="fullName" 
                name="full_name"
                placeholder="Enter your full name" 
                value={formData.full_name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${fieldErrors.email ? 'error' : ''}`}>
              <MdEmail className="input-icon" />
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className={`input-wrapper ${fieldErrors.password ? 'error' : ''}`}>
              <MdLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={`input-wrapper ${fieldErrors.confirmPassword ? 'error' : ''}`}>
              <MdLock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
          </div>
          <div className="form-options">
            <label className="terms-agreement">
              <input type="checkbox" required /> I agree to the <Link to="/terms" className="link">Terms of Service</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>
            </label>
          </div>
          <button type="submit" className="btn-primary create-account-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-login">
            <button type="button" className="social-btn">
              <FcGoogle className="social-icon" /> Google
            </button>
            <button type="button" className="social-btn">
              <AiFillGithub className="social-icon" /> GitHub
            </button>
          </div>
        </form>
        <p className="signin-text-bottom">
          Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;