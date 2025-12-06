import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

export default function MultiplayerTossScreen({ onAction, setGameSettings, roomCode, isHost, username }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [myNumber, setMyNumber] = useState(null);
  const [opponentNumber, setOpponentNumber] = useState(null);
  const [winner, setWinner] = useState(null);
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [selectedBatBowl, setSelectedBatBowl] = useState(null);
  const [playerCount, setPlayerCount] = useState(1);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [opponentChoice, setOpponentChoice] = useState(null);

  const wsRef = useRef(null);
  const API_BASE = "https://crickmatebackend-production.up.railway.app";

  // Connect to WebSocket
  useEffect(() => {
    const wsUrl = `${API_BASE.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/multiplayer/${roomCode}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected to room:", roomCode);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomCode]);

  const handleWebSocketMessage = (data) => {
    console.log("Received message:", data);

    switch (data.type) {
      case "player_joined":
        setPlayerCount(data.player_count);
        if (data.player_count === 2) {
          setWaitingForOpponent(false);
        }
        break;

      case "player_left":
        setPlayerCount(data.player_count);
        alert("Opponent left the game!");
        break;

      case "toss_choice":
        if (data.player !== username) {
          setOpponentChoice(data.choice);
        }
        break;

      case "toss_number":
        if (data.player !== username) {
          setOpponentNumber(data.number);
          calculateTossResult(myNumber, data.number);
        }
        break;

      case "bat_bowl_choice":
        if (data.player !== username) {
          // Opponent chose, start game
          continueToGame(data.choice === "bat" ? "bowl" : "bat");
        }
        break;
    }
  };

  const sendWebSocketMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handleChoice = (pick) => {
    setChoice(pick);
    sendWebSocketMessage({
      type: "toss_choice",
      player: username,
      choice: pick
    });
    setStep(2);
  };

  const handleNumber = (num) => {
    setMyNumber(num);
    sendWebSocketMessage({
      type: "toss_number",
      player: username,
      number: num
    });
    setWaitingForOpponent(true);
  };

  const calculateTossResult = (player1Num, player2Num) => {
    const sum = player1Num + player2Num;
    const outcome = sum % 2 === 0 ? "even" : "odd";
    const won = outcome === choice;
    
    setWinner(won ? username : "opponent");
    setStep(3);
    setWaitingForOpponent(false);
  };

  useEffect(() => {
    if (myNumber && opponentNumber) {
      calculateTossResult(myNumber, opponentNumber);
    }
  }, [myNumber, opponentNumber]);

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);
    sendWebSocketMessage({
      type: "bat_bowl_choice",
      player: username,
      choice: pick
    });
    continueToGame(pick);
  };

  const continueToGame = (batOrBowl) => {
    const settings = {
      overs,
      wickets,
      batOrBowl,
      mode: "multiplayer",
      roomCode
    };
    setGameSettings(settings);
    setTimeout(() => onAction("game"), 1200);
  };

  return (
    <div className="toss-container">
      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="toss-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Player count indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontSize: '18px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '10px'
      }}>
        Players: {playerCount}/2
        {playerCount === 1 && <div style={{ fontSize: '14px', marginTop: '5px' }}>Waiting for opponent...</div>}
      </div>

      {/* Room code display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontSize: '18px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '10px'
      }}>
        Room: {roomCode}
      </div>

      {/* Wait for player 2 */}
      {playerCount < 2 ? (
        <div className="toss-step1">
          <h2 className="toss-title">Waiting for Player 2...</h2>
          <p className="toss-title" style={{ fontSize: '18px' }}>
            Share room code: <strong>{roomCode}</strong>
          </p>
        </div>
      ) : (
        <>
          {/* STEP 0 - SETTINGS (Host only) */}
          {step === 0 && isHost && (
            <div className="toss-step1">
              <h2 className="toss-title">Choose Overs & Wickets</h2>

              <div className="toss-ball-buttons">
                {[1, 3, 5].map((o) => (
                  <motion.button
                    key={o}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`circle-btn ${overs === o ? "selected" : ""}`}
                    onClick={() => setOvers(o)}
                  >
                    {o}
                  </motion.button>
                ))}
              </div>

              <div className="toss-ball-buttons">
                {[1, 3, 5].map((w) => (
                  <motion.button
                    key={w}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`circle-btn ${wickets === w ? "selected" : ""}`}
                    onClick={() => setWickets(w)}
                  >
                    {w}
                  </motion.button>
                ))}
              </div>

              {overs && wickets && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="toss-proceed-btn"
                  onClick={() => setStep(1)}
                >
                  Confirm & Do Toss
                </motion.button>
              )}
            </div>
          )}

          {step === 0 && !isHost && (
            <div className="toss-step1">
              <h2 className="toss-title">Waiting for host to set game settings...</h2>
            </div>
          )}

          {/* STEP 1 - ODD / EVEN (Host only) */}
          {step === 1 && isHost && (
            <div className="toss-step1">
              <h2 className="toss-title">Choose Odd or Even</h2>

              <div className="toss-ball-buttons">
                <motion.div className="circle-big" onClick={() => handleChoice("odd")}>
                  ODD
                </motion.div>

                <motion.div className="circle-big" onClick={() => handleChoice("even")}>
                  EVEN
                </motion.div>
              </div>
            </div>
          )}

          {step === 1 && !isHost && (
            <div className="toss-step1">
              <h2 className="toss-title">Host is choosing odd or even...</h2>
            </div>
          )}

          {/* STEP 2 - PICK NUMBER */}
          {step === 2 && !waitingForOpponent && (
            <div className="toss-step2">
              <h2 className="toss-title">Pick a Number (1–6)</h2>

              <div className="toss-number-balls">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <motion.div
                    key={num}
                    className="circle-number"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNumber(num)}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && waitingForOpponent && (
            <div className="toss-step1">
              <h2 className="toss-title">Waiting for opponent...</h2>
            </div>
          )}

          {/* STEP 3 - RESULT */}
          {step === 3 && myNumber && opponentNumber && (
            <div className="toss-step3">
              <h1 className={winner === username ? "toss-win-text" : "toss-lose-text"}>
                {winner === username ? "You Won the Toss 🎉" : "Opponent Won the Toss 🎉"}
              </h1>

              <div className="toss-result-display">
                <div className="toss-player-section">
                  <div className="toss-emoji">👤</div>
                  <div className="toss-label">You</div>
                  <div className="toss-ball-display">{myNumber}</div>
                </div>

                <div className="toss-calculation">
                  <span className="calc-num">{myNumber}</span>
                  <span className="calc-op">+</span>
                  <span className="calc-num">{opponentNumber}</span>
                  <span className="calc-op">=</span>
                  <span className="calc-num">{myNumber + opponentNumber}</span>
                  <div className="calc-parity">
                    ({(myNumber + opponentNumber) % 2 === 0 ? 'Even' : 'Odd'})
                  </div>
                </div>

                <div className="toss-player-section">
                  <div className="toss-emoji">👥</div>
                  <div className="toss-label">Opponent</div>
                  <div className="toss-ball-display">{opponentNumber}</div>
                </div>
              </div>

              <button className="toss-proceed-btn" onClick={() => setStep(4)}>
                Next
              </button>
            </div>
          )}

          {/* STEP 4 - BAT OR BOWL */}
          {step === 4 && (
            <div className="toss-step1">
              {winner === username ? (
                <>
                  <h2 className="toss-title">Choose to Bat or Bowl</h2>

                  <div className="toss-ball-buttons">
                    <div
                      className={`choice-rect ${selectedBatBowl === "bat" ? "selected" : ""}`}
                      onClick={() => handleBatBowlChoice("bat")}
                    >
                      BAT
                    </div>
                    <div
                      className={`choice-rect ${selectedBatBowl === "bowl" ? "selected" : ""}`}
                      onClick={() => handleBatBowlChoice("bowl")}
                    >
                      BOWL
                    </div>
                  </div>

                  {selectedBatBowl && <p className="toss-title">Starting match...</p>}
                </>
              ) : (
                <>
                  <h2 className="toss-title">Opponent is deciding...</h2>
                  <p className="toss-title">Waiting for their choice...</p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}