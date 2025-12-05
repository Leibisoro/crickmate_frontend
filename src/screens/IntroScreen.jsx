import React from "react";
import "./IntroScreen.css";

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen">


      {/* Atmosphere layers */}
      <div className="stadium-fog"></div>
      <div className="spotlight-left"></div>
      <div className="spotlight-right"></div>

      <div className="intro-content">
        <h1 className="game-title">CrickMate</h1>

        <button className="play-btn" onClick={onStart}>
          ▶ Play
        </button>
      </div>

      {/* Cricket ball (CSS only) */}
      <div className="cricket-ball"></div>
    </div>
  );
};

export default IntroScreen;

