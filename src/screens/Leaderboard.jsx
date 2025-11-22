// src/screens/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

export default function Leaderboard({ API_BASE, onBackToResult }) {
  const base = API_BASE || "http://localhost:8000";

  const [leaders, setLeaders] = useState([]);

  // Fetch initial leaderboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${base}/leaderboard`);
        const data = await res.json();

        if (data.status === "success") {
          setLeaders(data.data);
        } else {
          console.error("Backend error:", data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchData();
  }, [base]);

  // WebSocket for live updates
  useEffect(() => {
    const url = base.replace("http://", "");
    const ws = new WebSocket(`ws://${url}/ws`);

    ws.onmessage = (event) => {
      try {
        const updated = JSON.parse(event.data);
        setLeaders(updated);
      } catch (err) {
        console.error("WS JSON parse error:", err);
      }
    };

    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, [base]);

  return (
    <div className="leaderboard-screen">
      <h2>🏆 Verified Leaderboard</h2>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Rating</th>
            <th>Block Hash</th>
          </tr>
        </thead>

        <tbody>
          {leaders.length > 0 ? (
            leaders.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row.username}</td>
                <td>{row.wins}</td>
                <td>{row.losses}</td>
                <td>{row.rating}</td>
                <td>{row.data_hash ? row.data_hash.slice(0, 10) + "..." : "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No leaderboard data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="back-btn" onClick={onBackToResult}>
        ← Back
      </button>
    </div>
  );
}
