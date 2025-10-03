import React from "react";
import "./IntroScreen.css";

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen">
      {/* Stadium glow effect */}
      <div className="stadium-glow"></div>

      <div className="intro-content">
        <h1 className="game-title">CrickMate</h1>
        <button className="play-btn" onClick={onStart}>
          ▶ Play
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
