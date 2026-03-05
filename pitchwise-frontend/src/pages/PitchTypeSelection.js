import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaRocket, FaUsers, FaChartLine, FaSeedling, FaLightbulb, FaRobot } from 'react-icons/fa';
import './PitchTypeSelection.css';

const PitchTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedPitch, setSelectedPitch] = useState('elevator');

  const pitchTypes = [
    { 
      id: 'elevator', 
      icon: <FaBriefcase />, 
      title: 'Elevator Pitch', 
      subtitle: '30-60 second quick pitch',
      description: 'Quick, compelling overview of your business idea in the time it takes to ride an elevator.',
      duration: '30-60 seconds',
      goal: 'Quick value proposition',
      audience: 'General networking',
      color: '#3B82F6'
    },
    { 
      id: 'startup', 
      icon: <FaRocket />, 
      title: 'Startup / Investor Pitch', 
      subtitle: 'Comprehensive business pitch',
      description: 'Comprehensive business pitch covering market, solution, team, and financials.',
      duration: '10-15 minutes',
      goal: 'Secure investment',
      audience: 'Investors / VCs',
      color: '#10B981'
    },
    { 
      id: 'problem-solution', 
      icon: <FaLightbulb />, 
      title: 'Problem-Solution Pitch', 
      subtitle: 'Focus on problems and solutions',
      description: 'Present a clear problem and your innovative solution approach.',
      duration: '5-10 minutes',
      goal: 'Demonstrate value',
      audience: 'Stakeholders',
      color: '#F59E0B'
    },
    { 
      id: 'demo', 
      icon: <FaUsers />, 
      title: 'Demo Pitch', 
      subtitle: 'Product demonstration focused',
      description: 'Live demonstration of your product highlighting key features and benefits.',
      duration: '10-20 minutes',
      goal: 'Show product capabilities',
      audience: 'Potential customers',
      color: '#8B5CF6'
    },
    { 
      id: 'pitch-deck', 
      icon: <FaChartLine />, 
      title: 'Pitch Deck Presentation', 
      subtitle: 'Full-slide deck presentation',
      description: 'Structured slide-by-slide pitch deck covering all business aspects.',
      duration: '15-20 minutes',
      goal: 'Comprehensive overview',
      audience: 'Investors / Partners',
      color: '#EF4444'
    },
    { 
      id: 'pre-seed', 
      icon: <FaSeedling />, 
      title: 'Pre-seed / Seed Pitch', 
      subtitle: 'Early stage funding pitch',
      description: 'Focus on vision, team, and early traction to secure initial capital.',
      duration: '3-5 minutes',
      goal: 'Raise early capital',
      audience: 'Angel Investors',
      color: '#14B8A6'
    },
    { 
      id: 'sample-pitch', 
      icon: <FaRobot />, 
      title: 'Sample Pitch', 
      subtitle: 'AI-powered content evaluation',
      description: 'Submit your pitch content for comprehensive AI analysis and feedback.',
      duration: 'Flexible',
      goal: 'Get a Feedback Report',
      audience: 'Practice & Learning',
      color: '#6366F1'
    },
  ];

  const selectedPitchData = pitchTypes.find(p => p.id === selectedPitch);

  return (
    <div className="pitch-setup-container">
      <div className="pitch-setup-header">
        <h2>Setup Your Pitch</h2>
        <p>Choose your pitch type and prepare for your simulation session</p>
      </div>

      <div className="pitch-setup-content">
        <div className="pitch-types-list">
          <h3 className="section-title">Available Pitch Types</h3>
          {pitchTypes.map((type) => (
            <div 
              key={type.id} 
              className={`pitch-type-item ${selectedPitch === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedPitch(type.id)}
            >
              <div className="pitch-type-icon-box" style={{ backgroundColor: type.color }}>
                {type.icon}
              </div>
              <div className="pitch-type-info">
                <h4>{type.title}</h4>
                <p>{type.subtitle}</p>
              </div>
              {selectedPitch === type.id && <div className="selected-indicator"></div>}
            </div>
          ))}
        </div>

        <div className="pitch-description-panel">
          <h3 className="section-title">Pitch Description</h3>
          {selectedPitchData && (
            <>
              <div className="pitch-detail-item">
                <div className="detail-icon" style={{ backgroundColor: selectedPitchData.color + '20', color: selectedPitchData.color }}>⏱️</div>
                <div>
                  <strong>Duration:</strong> {selectedPitchData.duration}
                </div>
              </div>
              <div className="pitch-detail-item">
                <div className="detail-icon" style={{ backgroundColor: selectedPitchData.color + '20', color: selectedPitchData.color }}>🎯</div>
                <div>
                  <strong>Goal:</strong> {selectedPitchData.goal}
                </div>
              </div>
              <div className="pitch-detail-item">
                <div className="detail-icon" style={{ backgroundColor: selectedPitchData.color + '20', color: selectedPitchData.color }}>👥</div>
                <div>
                  <strong>Audience:</strong> {selectedPitchData.audience}
                </div>
              </div>
              <div className="pitch-description-text">
                <p>{selectedPitchData.description}</p>
              </div>
              <button className="btn-primary start-simulation-btn" onClick={() => navigate('/pitch/content')}>
                ▶ Start Simulation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchTypeSelection;
