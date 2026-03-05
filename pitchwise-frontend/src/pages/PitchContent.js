import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCloudUpload, MdVideocam } from 'react-icons/md';
import { AiFillFileText } from 'react-icons/ai';
import { pitchesAPI } from '../services/api';
import './PitchContent.css';

const PitchContent = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showRubric, setShowRubric] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleStartAnalysis = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload the first file (you can modify to handle multiple files)
      const file = selectedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pitch_type', 'sample-pitch');
      formData.append('title', `User Pitch - ${file.name}`);

      const response = await fetch('http://localhost:8000/pitches/upload-pitch-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Navigate to feedback page with the pitch ID
      navigate(`/pitch/feedback?pitchId=${result.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pitch-content-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <MdArrowBack className="back-icon" /> Back
      </button>

      <div className="pitch-content-cards">
        {/* Left Card - Content Analysis */}
        <div className="content-card">
          <div className="card-icon-header" style={{ backgroundColor: '#6366F1' }}>
            <AiFillFileText />
          </div>
          <h2 className="card-title">Content Analysis</h2>
          <p className="card-description">Upload your files for comprehensive AI analysis</p>

          {error && (
            <div className="error-message" style={{ 
              color: '#ef4444', 
              background: '#fee2e2', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <div className="upload-area" onDragOver={handleDragOver} onDrop={handleDrop}>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              multiple
              style={{ display: 'none' }}
            />
            <MdCloudUpload className="upload-icon-large" />
            <p className="upload-text">Drop files here or click to browse</p>
            <p className="upload-subtext">Support for PDF, DOC, TXT, and more</p>
            <button className="select-files-btn" onClick={handleFileSelect}>Select Files</button>
            
            {selectedFiles.length > 0 && (
              <div className="selected-files-list">
                <p className="selected-files-title">Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selected-file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="supported-files">
            <p className="supported-label">Supported file types:</p>
            <div className="file-types">
              <span className="file-badge">PDF</span>
              <span className="file-badge">DOC</span>
              <span className="file-badge">DOCX</span>
              <span className="file-badge">TXT</span>
              <span className="file-badge">PPT</span>
            </div>
          </div>

          <button className="start-analysis-btn" onClick={handleStartAnalysis} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Start Analysis'}
          </button>
        </div>

        {/* Right Card - Video Simulation */}
        <div className="content-card">
          <div className="card-icon-header" style={{ backgroundColor: '#8B5CF6' }}>
            <MdVideocam />
          </div>
          <h2 className="card-title">Video Simulation</h2>
          <p className="card-description">Interactive AI-powered video content simulation</p>

          <div className="simulation-options-box">
            <button className="simulation-option-btn upload">
              <AiFillFileText className="option-icon" />
              <span>Upload Video</span>
            </button>
            <button className="simulation-option-btn record">
              <MdVideocam className="option-icon" />
              <span>Record Live</span>
            </button>
            <button className="simulation-option-btn text">
              <AiFillFileText className="option-icon" />
              <span>Text Pitch</span>
            </button>
          </div>

          <div className="pitch-info-box">
            <div className="info-icon-box">
              <AiFillFileText />
            </div>
            <div className="info-content">
              <h4>Elevator Pitch</h4>
              <p>30-60 second quick pitch</p>
            </div>
          </div>

          <div className="pitch-description-box">
            <h4>Pitch Description</h4>
            <div className="detail-item">
              <span className="detail-bullet">⏱️</span>
              <span><strong>Duration:</strong> 30-60 seconds</span>
            </div>
            <div className="detail-item">
              <span className="detail-bullet">🎯</span>
              <span><strong>Goal:</strong> Quick value proposition</span>
            </div>
            <div className="detail-item">
              <span className="detail-bullet">👥</span>
              <span><strong>Audience:</strong> General networking</span>
            </div>
            <p className="pitch-desc-text">
              Quick, compelling overview of your business idea in the time it takes to ride an elevator.
            </p>
          </div>

          <button className="start-simulation-btn" onClick={() => navigate('/pitch/feedback')}>
            Start Simulation
          </button>
        </div>
      </div>

      <button className="view-rubric-btn" onClick={() => setShowRubric(true)}>
        📋 View Rubric
      </button>

      {showRubric && (
        <div className="rubric-modal-overlay" onClick={() => setShowRubric(false)}>
          <div className="rubric-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rubric-modal-header">
              <h2>Evaluation Rubric</h2>
              <button className="close-modal-btn" onClick={() => setShowRubric(false)}>×</button>
            </div>
            <div className="rubric-modal-content">
              <div className="rubric-category">
                <h3>📊 Content Quality (25 points)</h3>
                <ul>
                  <li><strong>Clarity:</strong> Clear problem statement and solution</li>
                  <li><strong>Structure:</strong> Logical flow and organization</li>
                  <li><strong>Relevance:</strong> Focused on key value propositions</li>
                  <li><strong>Completeness:</strong> All essential elements covered</li>
                </ul>
              </div>
              <div className="rubric-category">
                <h3>🎤 Delivery (25 points)</h3>
                <ul>
                  <li><strong>Confidence:</strong> Assertive and self-assured presentation</li>
                  <li><strong>Pace:</strong> Appropriate speaking speed</li>
                  <li><strong>Tone:</strong> Engaging and enthusiastic</li>
                  <li><strong>Body Language:</strong> Professional posture and gestures</li>
                </ul>
              </div>
              <div className="rubric-category">
                <h3>💡 Innovation (20 points)</h3>
                <ul>
                  <li><strong>Uniqueness:</strong> Novel approach or solution</li>
                  <li><strong>Market Fit:</strong> Addresses real market needs</li>
                  <li><strong>Differentiation:</strong> Clear competitive advantage</li>
                  <li><strong>Scalability:</strong> Growth potential demonstrated</li>
                </ul>
              </div>
              <div className="rubric-category">
                <h3>🎯 Persuasiveness (15 points)</h3>
                <ul>
                  <li><strong>Call to Action:</strong> Clear next steps</li>
                  <li><strong>Evidence:</strong> Data and facts support claims</li>
                  <li><strong>Emotional Appeal:</strong> Connects with audience</li>
                  <li><strong>Credibility:</strong> Builds trust and authority</li>
                </ul>
              </div>
              <div className="rubric-category">
                <h3>⏱️ Time Management (15 points)</h3>
                <ul>
                  <li><strong>Duration:</strong> Stays within time limits</li>
                  <li><strong>Pacing:</strong> No rushed or dragging sections</li>
                  <li><strong>Prioritization:</strong> Key points emphasized</li>
                  <li><strong>Efficiency:</strong> No unnecessary information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchContent;
