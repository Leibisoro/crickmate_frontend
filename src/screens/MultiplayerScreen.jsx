// src/screens/MultiplayerScreen.jsx
import React, { useState, useEffect } from "react";
import "./MultiplayerScreen.css";

export default function MultiplayerScreen({ API_BASE, onAction }) {
  const [showRoomPanel, setShowRoomPanel] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const base = API_BASE || "http://localhost:8000";

  useEffect(() => {
    const savedRoom = localStorage.getItem("roomCode");
    const savedHost = localStorage.getItem("isHost");
    const savedInRoom = localStorage.getItem("inRoom");

    if (savedRoom && savedInRoom === "true") {
      setRoomCode(savedRoom);
      setIsHost(savedHost === "true");
      setInRoom(true);
    }

    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setIsLoggedIn(true);
        setShowLoginPanel(false);
        localStorage.setItem("username", username);
        alert("Login successful!");
      } else {
        alert("Login failed: " + (data.detail || JSON.stringify(data)));
      }
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${base}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setIsLoggedIn(true);
        setShowLoginPanel(false);
        localStorage.setItem("username", username);
        alert("Signup successful!");
      } else {
        alert("Signup failed: " + (data.detail || JSON.stringify(data)));
      }
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  // CREATE ROOM
  const handleCreateRoom = async () => {
    if (!isLoggedIn) return alert("Please login first.");

    try {
      const res = await fetch(`${base}/create-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setRoomCode(data.roomCode);
        setIsHost(true);
        setInRoom(true);

        localStorage.setItem("roomCode", data.roomCode);
        localStorage.setItem("isHost", "true");
        localStorage.setItem("inRoom", "true");

        alert("Room created: " + data.roomCode);

        // Go to toss screen
        onAction("multiplayerToss");
      } else {
        alert("Failed to create room");
      }
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  // JOIN ROOM
  const handleJoinRoomBackend = async () => {
    if (!isLoggedIn) return alert("Please login first.");
    if (!roomCode) return alert("Enter room code.");

    try {
      const res = await fetch(`${base}/join-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, roomCode }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setIsHost(false);
        setShowRoomPanel(false);
        setInRoom(true);

        localStorage.setItem("roomCode", roomCode);
        localStorage.setItem("isHost", "false");
        localStorage.setItem("inRoom", "true");

        alert("Joined room: " + roomCode);

        // Go to toss screen
        onAction("multiplayerToss");
      } else {
        alert("Failed to join room");
      }
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied");
  };

  const leaveRoom = () => {
    setInRoom(false);
    setRoomCode("");
    setIsHost(false);
    localStorage.removeItem("roomCode");
    localStorage.removeItem("isHost");
    localStorage.removeItem("inRoom");
  };

  return (
    <div className="multiplayer-container">
      <img src="/images/background2.png" className="background" />
      <img src="/images/stadiumlight.png" className="stadium-lights-left" />
      <img src="/images/stadiumlight1.png" className="stadium-lights-right" />
      <img src="/images/stumps1.png" className="stumps" />

      {/* LOGIN BUTTON */}
      <button
        className="signin-btn"
        onClick={() => {
          if (isLoggedIn) {
            setIsLoggedIn(false);
            localStorage.removeItem("username");
            alert("Logged out");
          } else {
            setShowLoginPanel(true);
          }
        }}
      >
        {isLoggedIn ? "Logout" : "Sign In"}
      </button>

      {/* LOGIN PANEL */}
      {showLoginPanel && (
        <div className="login-panel">
          <button className="close-login" onClick={() => setShowLoginPanel(false)}>
            ✖
          </button>

          {!isSignup ? (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input type="text" placeholder="Username"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="login-btn">Login</button>

              <p className="switch-text">
                Don’t have an account? <span onClick={() => setIsSignup(true)}>Sign up</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2>Sign Up</h2>
              <input type="text" placeholder="Username"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit" className="login-btn">Sign Up</button>

              <p className="switch-text">
                Already have an account? <span onClick={() => setIsSignup(false)}>Login</span>
              </p>
            </form>
          )}
        </div>
      )}

      {/* MAIN BUTTONS */}
      {!inRoom && !showRoomPanel && (
        <div className="buttons">
          <button onClick={handleCreateRoom} className="btn create">➕ CREATE ROOM</button>
          <button onClick={() => setShowRoomPanel(true)} className="btn join">🔑 JOIN ROOM</button>
        </div>
      )}

      {/* LOBBY */}
      {inRoom && (
        <div className="room-lobby">
          <h2>
            Room Code: {roomCode}
            <button className="copy-btn" onClick={copyRoomCode}>📋 Copy</button>
          </h2>

          <div className="profiles">
            <div className="profile host">👤 Host</div>
            <div className="profile guest">👤 {isHost ? "Waiting..." : "You"}</div>
          </div>

          <p className="waiting">
            Waiting to start toss...
          </p>

          <button className="btn close" onClick={leaveRoom}>✖ Leave Room</button>
        </div>
      )}

      {/* JOIN ROOM PANEL */}
      {showRoomPanel && (
        <div className="room-panel show">
          <h2>Enter Room Code</h2>
          <input
            type="text"
            value={roomCode}
            placeholder="ABCDE1"
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button className="btn join" onClick={handleJoinRoomBackend}>JOIN</button>
          <button className="btn close" onClick={() => setShowRoomPanel(false)}>✖ Close</button>
        </div>
      )}
    </div>
  );
}