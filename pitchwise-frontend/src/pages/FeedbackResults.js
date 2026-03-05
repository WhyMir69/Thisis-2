import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdRefresh } from 'react-icons/md';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import './FeedbackResults.css';

const FeedbackResults = () => {
  const navigate = useNavigate();

  // Mock feedback data
  const overallScore = 8.7;
  const feedback = {
    clarity: { score: 9.0, comment: 'Your pitch was very clear and easy to understand.' },
    confidence: { score: 8.5, comment: 'You demonstrated good confidence, but could improve eye contact.' },
    engagement: { score: 8.5, comment: 'Great storytelling! The audience would be engaged.' },
  };

  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        i <= score ? (
          <AiFillStar key={i} className="star-filled" />
        ) : (
          <AiOutlineStar key={i} className="star-empty" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="feedback-results-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <MdArrowBack className="back-icon" /> Back
      </button>

      <div className="feedback-header">
        <h2>Your Pitch Feedback</h2>
        <p>Here's how you did!</p>
      </div>

      <div className="overall-score-section">
        <h3>Overall Score</h3>
        <div className="score-display">
          <span className="score-number">{overallScore}</span>
          <span className="score-denominator">/10</span>
        </div>
        <div className="stars">{renderStars(Math.round(overallScore))}</div>
      </div>

      <div className="detailed-feedback">
        <h3>Detailed Feedback</h3>
        
        <div className="feedback-item">
          <div className="feedback-header-item">
            <h4>Clarity</h4>
            <span className="feedback-score">{feedback.clarity.score}/10</span>
          </div>
          <p>{feedback.clarity.comment}</p>
        </div>

        <div className="feedback-item">
          <div className="feedback-header-item">
            <h4>Confidence</h4>
            <span className="feedback-score">{feedback.confidence.score}/10</span>
          </div>
          <p>{feedback.confidence.comment}</p>
        </div>

        <div className="feedback-item">
          <div className="feedback-header-item">
            <h4>Engagement</h4>
            <span className="feedback-score">{feedback.engagement.score}/10</span>
          </div>
          <p>{feedback.engagement.comment}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-primary" onClick={() => navigate('/pitch/type')}>
          Practice Again
        </button>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <MdRefresh /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FeedbackResults;
