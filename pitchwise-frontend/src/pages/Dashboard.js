import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHistory, MdTipsAndUpdates } from 'react-icons/md';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { authAPI, pitchesAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, analyticsData] = await Promise.all([
          authAPI.getCurrentUser(),
          pitchesAPI.getDashboardAnalytics()
        ]);
        setUser(userData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="welcome-banner">
          <h2 className="welcome-title">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h2 className="welcome-title">Ready to Practice, {user?.full_name || user?.username}?</h2>
        <button className="btn-primary start-pitch-btn" onClick={() => navigate('/pitch/type')}>
          Start a Pitch
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-card-title">Past Sessions</h3>
          <div className="stat-card-content">
            <span className="stat-number">{analytics?.total_pitches || 0}</span>
            <p className="stat-description">Total practice sessions completed</p>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Average Score</h3>
          <div className="stat-card-content">
            <span className="stat-number">
              {analytics?.average_score ? analytics.average_score.toFixed(1) : '0.0'}
              <span className="stat-denominator">/10</span>
            </span>
            <p className="stat-description">Based on your latest performance</p>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Improvement</h3>
          <div className="stat-card-content">
            <span className={`stat-number ${analytics?.improvement >= 0 ? 'improvement-positive' : 'improvement-negative'}`}>
              {analytics?.improvement >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(analytics?.improvement || 0).toFixed(0)}%
            </span>
            <p className="stat-description">Compared to last month</p>
          </div>
        </div>
      </div>

      <div className="action-cards">
        <div className="action-card">
          <MdHistory className="action-icon" />
          <h3>Review History</h3>
          <p>Check your past pitch sessions and track your progress</p>
          <button className="btn-secondary" onClick={() => navigate('/history')}>View History</button>
        </div>
        <div className="action-card">
          <MdTipsAndUpdates className="action-icon" />
          <h3>Tips & Resources</h3>
          <p>Access helpful guides to improve your pitching skills</p>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
