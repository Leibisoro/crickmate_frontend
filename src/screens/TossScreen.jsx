import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

export default function TossScreen({ onAction, setGameSettings }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [userNumber, setUserNumber] = useState(null);
  const [aiNumber, setAiNumber] = useState(null);
  const [playerWon, setPlayerWon] = useState(false);
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [selectedBatBowl, setSelectedBatBowl] = useState(null);

  const handleChoice = (pick) => {
    setChoice(pick);
    setStep(2);
  };

  const handleNumber = (num) => {
    const aiNum = Math.floor(Math.random() * 6) + 1;
    const won = ((num + aiNum) % 2 === 0 ? "even" : "odd") === choice;

    setAiNumber(aiNum);
    setUserNumber(num);
    setPlayerWon(won);
    setStep(3);
  };

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);

    setGameSettings({
      overs,
      wickets,
      batOrBowl: pick,
    });

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

      {/* STEP 0 – SETTINGS */}
      {step === 0 && (
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

      {/* STEP 1 – ODD / EVEN */}
      {step === 1 && (
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

      {/* STEP 2 – PICK NUMBER */}
      {step === 2 && (
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

      {/* STEP 3 – RESULT */}
      {step === 3 && (
        <div className="toss-step3">
          <h1 className={playerWon ? "toss-win-text" : "toss-lose-text"}>
            {playerWon ? "You Won the Toss 🎉" : "AI Won the Toss 🤖"}
          </h1>

          <div className="toss-result-display">
            <div className="toss-player-section">
              <div className="toss-emoji">👦</div>
              <div className="toss-label">You</div>
              <div className="toss-ball-display">{userNumber}</div>
            </div>

            <div className="toss-calculation">
              <span className="calc-num">{userNumber}</span>
              <span className="calc-op">+</span>
              <span className="calc-num">{aiNumber}</span>
              <span className="calc-op">=</span>
              <span className="calc-num">{userNumber + aiNumber}</span>
              <div className="calc-parity">({(userNumber + aiNumber) % 2 === 0 ? 'Even' : 'Odd'})</div>
            </div>

            <div className="toss-player-section">
              <div className="toss-emoji">🤖</div>
              <div className="toss-label">AI</div>
              <div className="toss-ball-display">{aiNumber}</div>
            </div>
          </div>

          <button className="toss-proceed-btn" onClick={() => setStep(4)}>
            Next
          </button>
        </div>
      )}

      {/* STEP 4 – BAT OR BOWL */}
      {step === 4 && (
        <div className="toss-step1">

          {playerWon ? (
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
              <h2 className="toss-title">AI is deciding...</h2>
              <p className="toss-title">
                AI chose {Math.random() > 0.5 ? "BOWL" : "BAT"} first
              </p>

              <button className="toss-proceed-btn" onClick={() => onAction("game")}>
                Continue
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}