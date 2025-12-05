import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TossScreen.css";

// ✅ IMPORT ALL IMAGES PROPERLY
import nightBG from "../assets/images/night.png";
import lightLeft from "../assets/images/stadiumlight.png";
import lightRight from "../assets/images/stadiumlight1.png";
import stumpsImg from "../assets/images/stumps1.png";
import ball1 from "../assets/images/ball1.png";
import batsman1 from "../assets/images/batsman1.png";
import bowler1 from "../assets/images/baller1.png";

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
    const sum = num + aiNum;
    const outcome = sum % 2 === 0 ? "even" : "odd";

    const won = outcome === choice;
    setPlayerWon(won);
    setAiNumber(aiNum);
    setUserNumber(num);

    setStep(3);
  };

  const handleBatBowlChoice = (pick) => {
    setSelectedBatBowl(pick);

    setGameSettings({
      overs,
      wickets,
      batOrBowl: pick,
    });

    setTimeout(() => {
      onAction("game");
    }, 1200);
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
          />
        ))}
      </div>

      {/* Background Images */}
      <img src={nightBG} className="toss-background" alt="background" />
      <img src={lightLeft} className="toss-light-left" alt="light left" />
      <img src={lightRight} className="toss-light-right" alt="light right" />
      <img src={stumpsImg} className="toss-stumps" alt="stumps" />

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
                className={`toss-setting-btn ${overs === o ? "selected" : ""}`}
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
                className={`toss-setting-btn ${wickets === w ? "selected" : ""}`}
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
            <motion.div className="toss-cricket-ball" onClick={() => handleChoice("odd")}>
              <img src={ball1} className="toss-ball-img" alt="ball" />
              <span className="toss-ball-text">ODD</span>
            </motion.div>

            <motion.div className="toss-cricket-ball" onClick={() => handleChoice("even")}>
              <img src={ball1} className="toss-ball-img" alt="ball" />
              <span className="toss-ball-text">EVEN</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* STEP 2 – PICK A NUMBER */}
      {step === 2 && (
        <div className="toss-step2">
          <h2 className="toss-title">Pick a Number (1–6)</h2>

          <div className="toss-number-balls">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div key={num} className="toss-number-ball" onClick={() => handleNumber(num)}>
                <img src={ball1} className="toss-ball-img" alt="ball" />
                <span className="toss-number-text">{num}</span>
              </motion.div> 
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 – RESULT */}
      {step === 3 && (
        <div className="toss-step3">
          <div className="toss-battle-arena">

            <div className="toss-player-side">
              <div className="toss-avatar">🧑‍🦱</div>
              <motion.div className="toss-result-ball">
                <img src={ball1} className="toss-ball-img" alt="ball" />
                <span className="toss-result-number">{userNumber}</span>
              </motion.div>
            </div>

            <div className="toss-calculation">
              <div className="toss-calc-line">
                {userNumber} + {aiNumber} = {userNumber + aiNumber}
              </div>
            </div>

            <div className="toss-ai-side">
              <div className="toss-avatar">🤖</div>
              <motion.div className="toss-result-ball">
                <img src={ball1} className="toss-ball-img" alt="ball" />
                <span className="toss-result-number">{aiNumber}</span>
              </motion.div>
            </div>

          </div>

          <h1 className={playerWon ? "toss-win-text" : "toss-lose-text"}>
            {playerWon ? "You Won the Toss 🎉" : "AI Won the Toss 🤖"}
          </h1>

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

              <div className="toss-choice-images">
                <img
                  src={batsman1}
                  className={`choice-img ${selectedBatBowl === "bat" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bat")}
                  alt="bat"
                />

                <img
                  src={bowler1}
                  className={`choice-img ${selectedBatBowl === "bowl" ? "selected" : ""}`}
                  onClick={() => handleBatBowlChoice("bowl")}
                  alt="bowl"
                />
              </div>

              {selectedBatBowl && (
                <>
                  <img
                    src={selectedBatBowl === "bat" ? batsman1 : bowler1}
                    className="highlight-img"
                    alt="selected"
                  />
                  <p className="toss-title">Starting match...</p>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="toss-title">AI is deciding...</h2>
              <p className="toss-title">AI chose randomly</p>
              <motion.button className="toss-proceed-btn" onClick={() => onAction("game")}>
                Continue to Match
              </motion.button>
            </>
          )}
        </div>
      )}

    </div>
  );
}
