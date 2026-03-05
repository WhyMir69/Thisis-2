import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionCard.css';

const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  const { date, type, duration, score, grade, id } = session;

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="session-card">
      <div className="session-info">
        <h4 className="session-date">{date}</h4>
        <span className="session-type-tag">{type}</span>
        <span className="session-duration-tag">{duration}</span>
      </div>
      <div className="session-stats">
        <div className="stat-item">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Grade:</span>
          <span className={`grade-badge ${getGradeColor(grade)}`}>{grade}</span>
        </div>
      </div>
      <div className="session-actions">
        <button className="btn-feedback" onClick={() => navigate('/pitch/feedback')}>View Feedback</button>
        <button className="btn-replay">Replay</button>
      </div>
    </div>
  );
};

export default SessionCard;