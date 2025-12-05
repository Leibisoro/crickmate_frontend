import React from "react";
import "./HomeScreen.css";

export default function HomeScreen({ onAction }) {
  return (
    <div className="home-container">

      {/* Background Glow */}
      <div className="glow-background"></div>

      {/* Optional emoji character instead of image */}
      <div className="character-emoji">🏏</div>

      <div className="buttons-home">
        <button onClick={() => onAction("toss")} className="btn-home glow-btn">
          <span className="emoji">🤖</span> VS AI
        </button>

        <button onClick={() => onAction("multiplayer")} className="btn-home glow-btn">
          <span className="emoji">🎮</span> MULTIPLAYER
        </button>
      </div>
    </div>
  );
}



