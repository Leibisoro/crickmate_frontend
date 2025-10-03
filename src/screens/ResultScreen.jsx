import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, BarChart3, Settings } from 'lucide-react';
import './ResultScreen.css';

const ResultScreen = ({ 
  resultType = 'victory',   // 'victory', 'lose', 'draw'
  playerScore = 0,
  computerScore = 0,
  winMargin = { type: 'runs', value: 0 },
  onBackToHome,
  onPlayAgain,
  onLeaderboard
}) => {
  const [showStats, setShowStats] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // ✅ state for settings panel

  // Settings states
  const [overs, setOvers] = useState('2 Overs');
  const [difficulty, setDifficulty] = useState('Medium');
  const [sound, setSound] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowStats(true), 2000);
    const timer2 = setTimeout(() => setShowButtons(true), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getResultText = () => {
    if (resultType === 'victory') {
      return winMargin?.value > 0
        ? `🎉 You Won by ${winMargin.value} ${winMargin.type}`
        : '🎉 You Won';
    }
    if (resultType === 'lose') {
      return winMargin?.value > 0
        ? `😢 You Lost by ${winMargin.value} ${winMargin.type}`
        : '😢 You Lost';
    }
    if (resultType === 'draw') {
      return '🤝 Match Drawn';
    }
    return '';
  };

  const getCenterpieceImage = () => {
    switch (resultType) {
      case 'victory': return '/images/trophy.png';
      case 'lose': return '/images/sad.png';
      case 'draw': return '/images/scale.png';
      default: return '/images/trophy.png';
    }
  };

  return (
    <div className="result-screen">
      {/* Background */}
      <div className="result-background" />

      {/* Confetti on victory */}
      {resultType === 'victory' && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Dark overlay on lose */}
      {resultType === 'lose' && <div className="dark-overlay" />}

      {/* Main Content */}
      <div className="result-content">
        {/* Centerpiece Image */}
        <div className={`centerpiece centerpiece-${resultType}`}>
          <img 
            src={getCenterpieceImage()} 
            alt={resultType}
            className="centerpiece-image big-trophy"
          />
        </div>

        {/* Result Text */}
        <div className={`result-text result-text-${resultType}`}>
          {getResultText()}
        </div>

        {/* Stats Panel */}
        {!showSettings && ( // hide stats when settings open
          <div className={`stats-panel ${showStats ? 'stats-visible' : ''}`}>
            <div className="stats-card">
              <h3>Match Statistics</h3>
              
              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Your Score</span>
                  <span className="stat-value">{playerScore}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Computer Score</span>
                  <span className="stat-value">{computerScore}</span>
                </div>
              </div>

              {/* Extra dummy stats */}
              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Overs Played</span>
                  <span className="stat-value">2.0</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Run Rate</span>
                  <span className="stat-value">7.5</span>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Fours</span>
                  <span className="stat-value">3</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sixes</span>
                  <span className="stat-value">2</span>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Wickets Lost</span>
                  <span className="stat-value">1</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-card">
              <h3>⚙️ Game Settings</h3>

              <div className="settings-item">
                <label>Overs:</label>
                <select value={overs} onChange={(e) => setOvers(e.target.value)}>
                  <option>1 Over</option>
                  <option>2 Overs</option>
                  <option>5 Overs</option>
                </select>
              </div>

              <div className="settings-item">
                <label>Difficulty:</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="settings-item">
                <label>
                  <input
                    type="checkbox"
                    checked={sound}
                    onChange={() => setSound(!sound)}
                  />
                  Sound On/Off
                </label>
              </div>

              <button 
                className="close-settings-btn"
                onClick={() => setShowSettings(false)}
              >
                Close Settings
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`action-buttons ${showButtons ? 'buttons-visible' : ''}`}>
          <button className="action-btn home-btn" onClick={onBackToHome}>
            <Home size={20} />
            <span>Back to Home</span>
          </button>
          
          <button className="action-btn play-again-btn" onClick={onPlayAgain}>
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>
          
          <button className="action-btn leaderboard-btn" onClick={onLeaderboard}>
            <BarChart3 size={20} />
            <span>Leaderboard</span>
          </button>
          
          <button 
            className="action-btn settings-btn" 
            onClick={() => setShowSettings(true)} // open settings
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;

