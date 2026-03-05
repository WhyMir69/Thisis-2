import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pitchesAPI } from '../services/api';
import SessionCard from '../components/SessionCard';
import './PitchHistory.css';

const PitchHistory = () => {
  const navigate = useNavigate();
  const [pitchSessions, setPitchSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const pitches = await pitchesAPI.getAllPitches();
        // Transform backend data to match SessionCard format
        const transformedPitches = pitches.map(pitch => ({
          id: pitch.id,
          date: new Date(pitch.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          type: pitch.pitch_type || 'Pitch',
          duration: pitch.duration || 'N/A',
          score: pitch.score ? pitch.score.toFixed(1) : 'N/A',
          grade: calculateGrade(pitch.score),
          pitch_data: pitch
        }));
        setPitchSessions(transformedPitches.reverse()); // Show newest first
      } catch (err) {
        console.error('Failed to fetch pitches:', err);
        setError('Failed to load pitch history');
      } finally {
        setLoading(false);
      }
    };
    fetchPitches();
  }, []);

  const calculateGrade = (score) => {
    if (!score) return 'N/A';
    if (score >= 9) return 'A';
    if (score >= 8) return 'B+';
    if (score >= 7) return 'B';
    if (score >= 6) return 'C+';
    if (score >= 5) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <div className="pitch-history-container">
        <div className="history-header">
          <h2>Your Pitch History</h2>
          <p>Loading your pitch sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pitch-history-container">
        <div className="history-header">
          <h2>Your Pitch History</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pitch-history-container">
      <div className="history-header">
        <h2>Your Pitch History</h2>
        <p>Review your past pitches and track your improvement over time</p>
      </div>

      {pitchSessions.length === 0 ? (
        <div className="empty-state">
          <p>No pitch sessions yet. Start your first pitch!</p>
          <button className="btn-primary" onClick={() => navigate('/pitch/type')}>
            Start a Pitch
          </button>
        </div>
      ) : (
        <div className="sessions-list">
          {pitchSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PitchHistory;
