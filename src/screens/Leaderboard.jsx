// src/screens/Leaderboard.jsx
import React from "react";
import "./Leaderboard.css";

const Leaderboard = ({ onBackToResult }) => {
  return (
    <div className="leaderboard-screen">
      <h2>🏆 Leaderboard</h2>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {/* Dummy static rows */}
          <tr>
            <td>1</td>
            <td>You</td>
            <td>50</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Computer</td>
            <td>40</td>
          </tr>
          <tr>
            <td>3</td>
            <td>---</td>
            <td>---</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <button onClick={onBackToResult} className="back-btn">
          ← Back to Result
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
