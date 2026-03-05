import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand-logo-container">
          <img src="/pitchWiselogo.png" alt="PitchWise Logo" className="brand-logo-image" />
          <h2 className="welcome-text">Welcome</h2>
          <p className="signin-text">Sign in to your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <MdEmail className="input-icon" />
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <MdLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" classname="forgot-password-link">Forgot password?</Link>
          </div>
          <button type="submit" className="btn-primary signin-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
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
        <p className="signup-text">
          Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;