import React from "react";
import "./IntroScreen.css";
import introBg from "../assets/images/intro2.png"; // ✅ FIXED IMAGE PATH

const IntroScreen = ({ onStart }) => {
  return (
    <div
      className="intro-screen"
      style={{ backgroundImage: `url(${introBg})` }} // ✅ NOW WORKS IN DEPLOYMENT
    >
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
