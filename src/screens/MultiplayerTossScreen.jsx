import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

// IMPORT ALL IMAGES HERE
import ground from "../assets/images/ground.png";
import ball from "../assets/images/ball1.png";
import batsmanImg from "../assets/images/batsman1.png";
import bowlerImg from "../assets/images/baller1.png";

export default function TossScreen({ onAction, setGameSettings }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [player1Number, setPlayer1Number] = useState(null);
  const [result, setResult] = useState(null);
  const [player2Number, setPlayer2Number] = useState(null);
  const [player1Won, setPlayer1Won] = useState(false);
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [selectedBatBowl, setSelectedBatBowl] = useState(null);

  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  useEffect(() => {
    const p1 = localStorage.getItem("player1Name") || "Player 1";
    const p2 = localStorage.getItem("player2Name") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
  }, []);

  const handleChoice = (pick) => {
    setChoice(pick);
    setStep(2);
  };

  const handleNumber = (num) => {
    const p2 = Math.floor(Math.random() * 6) + 1;
    const sum = num + p2;
    const outcome = sum % 2 === 0 ? "even" : "odd";

    const won = outcome === choice;
    setPlayer1Won(won);
    setPlayer2Number(p2);

    setResult(won ? `${player1Name} won the toss! 🎉` : `${player2Name} won! 🎉`);

    setPlayer1Number(num);
    setStep(3);
  };

  const validateSettings = () => {
    if (!overs || !wickets) {
      alert("Choose Overs & Wickets first.");
      return false;
    }
    return true;
  };

  const continueToMultiplayerMatch = (final) => {
    if (!validateSettings()) return;

    localStorage.setItem("player1Name", player1Name);
    localStorage.setItem("player2Name", player2Name);

    const settings = {
      overs,
      wickets,
      batOrBowl: final,
      mode: "multiplayer",
    };

    setGameSettings(settings);
  };

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);
    continueToMultiplayerMatch(pick);
  };

  const handleAutoDecideForPlayer2 = () => {
    const pick = Math.random() > 0.5 ? "bat" : "bowl";
    setSelectedBatBowl(pick);

    setTimeout(() => {
      continueToMultiplayerMatch(pick);
    }, 700);
  };

  return (
    <div className="toss-container">
      {/* Stars */}
      <div className="toss-stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="toss-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* FIXED IMAGE PATH */}
      <img src={ground} alt="background" className="toss-background" />

      {/* STEP 0 - SETTINGS */}
      {step === 0 && (
        <div className="toss-step1">
          <h2 className="toss-title">Choose Overs & Wickets</h2>

          {/* OVERS */}
          <h3 className="toss-title">Overs</h3>
          <div className="toss-ball-buttons">
            {[1, 3, 5].map((o) => (
              <motion.button
                key={o}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`toss-setting-btn ${overs === o ? "selected" : ""}`}
                onClick={() => setOvers(o)}
              >
                {o}
              </motion.button>
            ))}
          </div>

          {/* WICKETS */}
          <h3 className="toss-title" style={{ marginTop: 30 }}>Wickets</h3>
          <div className="toss-ball-buttons">
            {[1, 3, 5].map((w) => (
              <motion.button
                key={w}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`toss-setting-btn ${wickets === w ? "selected" : ""}`}
                onClick={() => setWickets(w)}
              >
                {w}
              </motion.button>
            ))}
          </div>

          {overs && wickets && (
            <motion.button
              className="toss-proceed-btn"
              whileHover={{ scale: 1.1 }}
              onClick={() => setStep(1)}
            >
              Confirm & Do Toss
            </motion.button>
          )}
        </div>
      )}

      {/* STEP 1 - ODD EVEN */}
      {step === 1 && (
        <div className="toss-step1">
          <h2 className="toss-title">{player1Name}, Choose Odd or Even</h2>
          <div className="toss-ball-buttons">
            <motion.div
              className="toss-cricket-ball"
              whileHover={{ scale: 1.1 }}
              onClick={() => handleChoice("odd")}
            >
              <img src={ball} className="toss-ball-img" />
              <span className="toss-ball-text">ODD</span>
            </motion.div>

            <motion.div
              className="toss-cricket-ball"
              whileHover={{ scale: 1.1 }}
              onClick={() => handleChoice("even")}
            >
              <img src={ball} className="toss-ball-img" />
              <span className="toss-ball-text">EVEN</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* STEP 2 - NUMBER PICK */}
      {step === 2 && (
        <div className="toss-step2">
          <h2 className="toss-title">Pick a Number (1-6)</h2>

          <div className="toss-number-balls">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div
                key={num}
                className="toss-number-ball"
                whileHover={{ scale: 1.15 }}
                onClick={() => handleNumber(num)}
              >
                <img src={ball} className="toss-ball-img" />
                <span className="toss-number-text">{num}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 - SHOW RESULT */}
      {step === 3 && (
        <div className="toss-step3">
          <div className="toss-battle-arena">
            {/* PLAYER 1 */}
            <div className="toss-player-side">
              <div className="toss-avatar">🧑‍🦱</div>
              <div className="toss-player-label">{player1Name}</div>

              <motion.div className="toss-result-ball" animate={{ opacity: 1 }}>
                <img src={ball} className="toss-ball-img" />
                <span className="toss-result-number">{player1Number}</span>
              </motion.div>
            </div>

            {/* CENTER */}
            <div className="toss-calculation">
              <div className="toss-calc-line">
                {player1Number} + {player2Number} = {player1Number + player2Number}
              </div>
              <div className="toss-calc-result">
                ({(player1Number + player2Number) % 2 === 0 ? "Even" : "Odd"})
              </div>
            </div>

            {/* PLAYER 2 */}
            <div className="toss-ai-side">
              <div className="toss-avatar">👱🏾</div>
              <div className="toss-ai-label">{player2Name}</div>

              <motion.div className="toss-result-ball" animate={{ opacity: 1 }}>
                <img src={ball} className="toss-ball-img" />
                <span className="toss-result-number">{player2Number}</span>
              </motion.div>
            </div>
          </div>

          <h1 className={player1Won ? "toss-win-text" : "toss-lose-text"}>
            {player1Won ? `${player1Name} Won the Toss 🎉` : `${player2Name} Won the Toss 🎉`}
          </h1>

          <button className="toss-proceed-btn" onClick={() => setStep(4)}>
            Next
          </button>
        </div>
      )}

      {/* STEP 4 - BAT OR BOWL */}
      {step === 4 && (
        <div className="toss-step1">
          {player1Won ? (
            <>
              <h2 className="toss-title">{player1Name}, Choose to Bat or Bowl</h2>

              <div className="toss-choice-images">
                <img
                  src={batsmanImg}
                  alt="Bat"
                  className={`choice-img ${selectedBatBowl === "bat" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bat")}
                />

                <img
                  src={bowlerImg}
                  alt="Bowl"
                  className={`choice-img ${selectedBatBowl === "bowl" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bowl")}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="toss-title">{player2Name} is deciding...</h2>

              <p className="toss-title">Choosing automatically...</p>

              <motion.button
                className="toss-proceed-btn"
                whileHover={{ scale: 1.1 }}
                onClick={handleAutoDecideForPlayer2}
              >
                Continue
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
