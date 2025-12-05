import { useState } from "react";
import "./MultiplayerScreen.css";

// ✅ IMPORT IMAGES CORRECTLY
import bg from "../assets/images/background2.png";
import stadiumLightLeft from "../assets/images/stadiumlight.png";
import stadiumLightRight from "../assets/images/stadiumlight1.png";

export default function MultiplayerScreen({ onAction }) {
  // STATE ===============================
  const [showRoomPanel, setShowRoomPanel] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [guestName, setGuestName] = useState(null);

  const [selectedWickets, setSelectedWickets] = useState(1);
  const [selectedOvers, setSelectedOvers] = useState(1);

  // FUNCTIONS ===============================

  const generateRoomCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }

    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setInRoom(true);
    setOpponentJoined(false);
    setGuestName(null);

    if (!localStorage.getItem("player1Name"))
      localStorage.setItem("player1Name", "Host");
  };

  const handleJoinRoom = () => {
    if (!isLoggedIn) {
      alert("Please login first. The login option is at the top-right corner.");
      return;
    }
    setShowRoomPanel(true);
  };

  const copyRoomCode = () => {
    if (!roomCode) return alert("No room code to copy");
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied: " + roomCode);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginPanel(false);
  };

  function handleStartClick() {
    localStorage.setItem("selectedWickets", selectedWickets);
    localStorage.setItem("selectedOvers", selectedOvers);

    if (opponentJoined) {
      if (!localStorage.getItem("player1Name"))
        localStorage.setItem("player1Name", "Player 1");

      if (!localStorage.getItem("player2Name") && guestName)
        localStorage.setItem("player2Name", guestName);

      onAction("multiplayerToss");
      return;
    }

    const ok = window.confirm(
      "No opponent has joined yet.\nForce start match for local testing?"
    );
    if (ok) {
      if (!localStorage.getItem("player1Name"))
        localStorage.setItem("player1Name", "Host");

      if (!localStorage.getItem("player2Name"))
        localStorage.setItem("player2Name", "Player 2");

      onAction("multiplayerToss");
    }
  }

  function handleForceStartNow() {
    localStorage.setItem("selectedWickets", selectedWickets);
    localStorage.setItem("selectedOvers", selectedOvers);

    if (!localStorage.getItem("player1Name"))
      localStorage.setItem("player1Name", "Host");

    if (!localStorage.getItem("player2Name"))
      localStorage.setItem("player2Name", "Player 2");

    onAction("multiplayerToss");
  }

  function handleJoinConfirm() {
    setIsHost(false);
    setShowRoomPanel(false);
    setInRoom(true);
    setOpponentJoined(true);

    const name = localStorage.getItem("player2Name") || "Guest";
    setGuestName(name);

    localStorage.setItem("player2Name", name);

    if (!localStorage.getItem("player1Name"))
      localStorage.setItem("player1Name", "Player 1");
  }

  // =============================== UI ===============================
  return (
    <div className="multiplayer-container">

      {/* ✅ FIXED IMAGES */}
      <img src={bg} className="background" alt="bg" />
      <img src={stadiumLightLeft} className="stadium-lights-left" alt="light-left" />
      <img src={stadiumLightRight} className="stadium-lights-right" alt="light-right" />

      <button
        className="login-btn"
        onClick={() => setShowLoginPanel(true)}
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
              <input placeholder="Username" required />
              <input placeholder="Password" type="password" required />
              <button className="btn submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2>Signup</h2>
              <input placeholder="Username" required />
              <input placeholder="Password" type="password" required />
              <button className="btn submit">Signup</button>
            </form>
          )}

          <button
            className="toggle"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account?" : "Create account?"}
          </button>
        </div>
      )}

      {/* MAIN MENU */}
      {!inRoom && !showRoomPanel && (
        <div className="buttons">
          <button onClick={handleCreateRoom} className="btn create">
            Create Room
          </button>

          <button onClick={handleJoinRoom} className="btn join">
            Join Room
          </button>
        </div>
      )}

      {/* ROOM LOBBY */}
      {inRoom && (
        <div className="room-lobby">
          <h2>ROOM CODE: {roomCode}</h2>

          {isHost && (
            <button className="btn copy" onClick={copyRoomCode}>
              Copy Code
            </button>
          )}

          <div className="profiles">
            <div className="profile host">👤 Host</div>
            <div className="profile guest">
              👤 {opponentJoined ? guestName : isHost ? "Waiting..." : "You"}
            </div>
          </div>

          {isHost ? (
            <div className="settings">
              <label>
                Wickets:
                <select
                  value={selectedWickets}
                  onChange={(e) => setSelectedWickets(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </label>

              <label>
                Overs:
                <select
                  value={selectedOvers}
                  onChange={(e) => setSelectedOvers(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </label>

              <button className="btn start" onClick={handleStartClick}>
                Start Match
              </button>
            </div>
          ) : (
            <p className="waiting">
              Waiting for host to set settings & start…
            </p>
          )}

          <button className="btn close" onClick={() => setInRoom(false)}>
            ✖ Leave Room
          </button>

          {/* Force start for local testing */}
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button
              onClick={handleForceStartNow}
              style={{
                padding: "8px 12px",
                background: "#f6b93b",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Force Start Now (test)
            </button>
            <div style={{ fontSize: 12, color: "#6b7c86", marginTop: 6 }}>
              (For local testing)
            </div>
          </div>
        </div>
      )}

      {/* JOIN ROOM PANEL */}
      {showRoomPanel && (
        <div className="room-panel show">
          <h2>Enter Room Code</h2>
          <input placeholder="Room Code" maxLength={6} />

          <button className="btn join" onClick={handleJoinConfirm}>
            JOIN
          </button>

          <button
            className="btn close"
            onClick={() => setShowRoomPanel(false)}
          >
            ✖ Close
          </button>
        </div>
      )}
    </div>
  );
}
