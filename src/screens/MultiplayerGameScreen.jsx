import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GameScreen.css";

// ✅ FIXED IMAGE IMPORTS
import gameplayBg from "../assets/images/gameplay.png";
import ball1 from "../assets/images/ball1.png";
import hand1 from "../assets/images/handfinger1.png";
import hand2 from "../assets/images/handfinger2.png";
import hand3 from "../assets/images/handfinger3.png";
import hand4 from "../assets/images/handfinger4.png";
import hand5 from "../assets/images/handfinger5.png";
import hand6 from "../assets/images/handfinger6.png";

// Map hand images
const handImages = {
  1: hand1,
  2: hand2,
  3: hand3,
  4: hand4,
  5: hand5,
  6: hand6,
};

export default function MultiplayerGameScreen({
  onAction,
  gameSettings,
  onGameComplete,
}) {
  // Player names
  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";

  // Game settings
  const overs =
    Number(gameSettings?.overs ?? localStorage.getItem("selectedOvers")) || 1;
  const wicketsLimit =
    Number(gameSettings?.wickets ?? localStorage.getItem("selectedWickets")) ||
    1;
  const batOrBowl =
    gameSettings?.batOrBowl ||
    localStorage.getItem("selectedBatOrBowl") ||
    "bat";

  // State
  const [showRules, setShowRules] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [inning, setInning] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(overs * 6);
  const [target, setTarget] = useState(null);
  const [player1Hand, setPlayer1Hand] = useState(null);
  const [player2Hand, setPlayer2Hand] = useState(null);
  const [player1Msg, setPlayer1Msg] = useState("");
  const [player2Msg, setPlayer2Msg] = useState("");
  const [centerResult, setCenterResult] = useState("");
  const [scoredRun, setScoredRun] = useState(null);
  const [inningOver, setInningOver] = useState(false);
  const [flyingBall, setFlyingBall] = useState(null);
  const [readyText, setReadyText] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [pickPhase, setPickPhase] = useState("batter");

  const isPlayer1Batting =
    (inning === 1 && batOrBowl === "bat") ||
    (inning === 2 && batOrBowl === "bowl");

  const battingLabel = isPlayer1Batting
    ? `${player1Name} is Batting`
    : `${player2Name} is Batting`;

  const oversBowled = () => {
    const ballsBowled = overs * 6 - balls;
    return `${Math.floor(ballsBowled / 6)}.${ballsBowled % 6}/${overs}`;
  };

  const currentBatterName = isPlayer1Batting ? player1Name : player2Name;
  const currentBowlerName = isPlayer1Batting ? player2Name : player1Name;

  // MAIN PICK HANDLER
  const handlePick = (num) => {
    if (inningOver || balls <= 0 || flyingBall || buttonsDisabled) return;
    setButtonsDisabled(true);

    // Batter pick phase
    if (pickPhase === "batter") {
      if (isPlayer1Batting) {
        setPlayer1Hand(num);
        setPlayer1Msg(`${currentBatterName} chose ${num}`);
      } else {
        setPlayer2Hand(num);
        setPlayer2Msg(`${currentBatterName} chose ${num}`);
      }
      setPickPhase("bowler");
      setButtonsDisabled(false);
      return;
    }

    // Bowler pick phase
    let batterPick = isPlayer1Batting ? player1Hand : player2Hand;

    if (isPlayer1Batting) {
      setPlayer2Hand(num);
      setPlayer2Msg(`${currentBowlerName} chose ${num}`);
    } else {
      setPlayer1Hand(num);
      setPlayer1Msg(`${currentBowlerName} chose ${num}`);
    }

    setFlyingBall(num);

    setTimeout(() => {
      if (num === batterPick) {
        setCenterResult("OUT!");
        setWickets((w) => w + 1);
      } else {
        const runs = batterPick;
        setCenterResult(`${runs} Runs!`);
        setScoredRun(runs);

        setTimeout(() => {
          if (isPlayer1Batting)
            setPlayer1Score((s) => s + runs);
          else
            setPlayer2Score((s) => s + runs);
          setScoredRun(null);
        }, 800);
      }

      setBalls((b) => b - 1);
      setFlyingBall(null);

      setTimeout(() => {
        setCenterResult("");
        setReadyText(true);
        setPickPhase("batter");

        setTimeout(() => {
          setReadyText(false);
          setButtonsDisabled(false);
        }, 1000);
      }, 1000);
    }, 900);
  };

  // CHECK INNINGS END
  useEffect(() => {
    if (balls === 0 || wickets >= wicketsLimit) {
      if (inning === 1) {
        const firstScore = isPlayer1Batting ? player1Score : player2Score;
        setTarget(firstScore + 1);
        setInningOver(true);
      } else {
        setInningOver(true);
      }
    }

    if (inning === 2 && target !== null) {
      if (
        (isPlayer1Batting && player1Score >= target) ||
        (!isPlayer1Batting && player2Score >= target)
      ) {
        setInningOver(true);
      }
    }
  }, [
    balls,
    wickets,
    player1Score,
    player2Score,
    inning,
    target,
    isPlayer1Batting,
  ]);

  const startSecondInnings = () => {
    setInning(2);
    setBalls(overs * 6);
    setWickets(0);
    setInningOver(false);
    setPlayer1Hand(null);
    setPlayer2Hand(null);
    setCenterResult("");
    setPlayer1Msg("");
    setPlayer2Msg("");
    setPickPhase("batter");
  };

  const restartGame = () => {
    setInning(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWickets(0);
    setBalls(overs * 6);
    setTarget(null);
    setPlayer1Hand(null);
    setPlayer2Hand(null);
    setPlayer1Msg("");
    setPlayer2Msg("");
    setCenterResult("");
    setScoredRun(null);
    setInningOver(false);
    setFlyingBall(null);
    setReadyText(false);
    setButtonsDisabled(false);
    setShowSettings(false);
    setPickPhase("batter");
  };

  const battingScore = isPlayer1Batting ? player1Score : player2Score;

  return (
    <div
      className="game-screen"
      style={{
        backgroundImage: `url(${gameplayBg})`, // ✅ FIXED
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* RULES MODAL */}
      <AnimatePresence>
        {showRules && (
          <motion.div className="modal-overlay">
            <motion.div className="modal">
              <h2>📜 Multiplayer Rules</h2>
              <p>Batter picks first (1–6), Bowler picks next.</p>
              <p>Same number = OUT!</p>
              <button onClick={() => setShowRules(false)}>Start Match</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCOREBOARD */}
      <div className="game-scoreboard">
        <div className="gs-row">
          <span>Inning: {inning}</span>
          <div className="batting-info">{battingLabel}</div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙️
          </button>
        </div>

        <div className="gs-big">
          <div className="gs-player">
            <div className="gs-subtitle">
              {isPlayer1Batting ? player1Name : player2Name}
            </div>
            <div className="gs-score">{battingScore}</div>
          </div>

          <div className="gs-vertical-divider"></div>

          <div className="gs-player">
            <div className="gs-subtitle">Wickets</div>
            <div className="gs-score">
              {wickets}/{wicketsLimit}
            </div>
          </div>
        </div>

        <div className="smalls">
          <span>Overs: {oversBowled()}</span>
          <span>Balls Left: {balls}</span>
        </div>

        {inning === 2 && <div className="target">Target: {target}</div>}
      </div>

      {/* PLAY AREA */}
      <div className="play-area">
        {/* PLAYER 1 */}
        <div className={`side player-side ${isPlayer1Batting ? "active" : ""}`}>
          <AnimatePresence>
            {player1Hand && (
              <motion.div>
                <img
                  src={handImages[player1Hand]} // ✅ FIXED
                  alt="P1 hand"
                  className="hand-img"
                />
                <div className="hand-msg player-msg">{player1Msg}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER STAGE */}
        <div className="center-stage">
          <div className="turn-indicator">
            {pickPhase === "batter"
              ? `Batter: ${currentBatterName} — Pick`
              : `Bowler: ${currentBowlerName} — Pick`}
          </div>

          <div className="ball-row">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="ball-slot" key={n}>
                <motion.button
                  className="number-ball-btn"
                  onClick={() => handlePick(n)}
                  disabled={buttonsDisabled}
                >
                  <motion.img
                    src={ball1} // ✅ FIXED
                    alt="ball"
                    className="ball-img-enhanced"
                    animate={
                      flyingBall === n
                        ? {
                            y: -300,
                            scale: 1.8,
                            rotate: 1080,
                            opacity: 0,
                          }
                        : {
                            y: 0,
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                          }
                    }
                  />
                  <span className="ball-number-label">{n}</span>
                </motion.button>
              </div>
            ))}
          </div>

          {/* RESULT */}
          <div className="center-result-wrap">
            <AnimatePresence>
              {centerResult && (
                <motion.div className="center-result">
                  {centerResult}
                </motion.div>
              )}

              {scoredRun && (
                <motion.div className="fly-run">+{scoredRun}</motion.div>
              )}

              {readyText && (
                <motion.div className="ready-text-enhanced">
                  ⚡ Get Ready ⚡
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* PLAYER 2 */}
        <div className={`side computer-side ${!isPlayer1Batting ? "active" : ""}`}>
          <AnimatePresence>
            {player2Hand && (
              <motion.div>
                <img
                  src={handImages[player2Hand]} // ✅ FIXED
                  alt="P2 hand"
                  className="hand-img"
                />
                <div className="hand-msg computer-msg">{player2Msg}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* INNINGS OVER */}
      <AnimatePresence>
        {inningOver && (
          <motion.div className="modal-overlay">
            <motion.div className="modal innings-modal">
              <h2>🏏 INNINGS OVER</h2>
              <div className="innings-score">
                Score: {battingScore}/{wickets}
              </div>

              {inning === 1 ? (
                <>
                  <div className="innings-target">
                    Target: {target} in {overs} overs
                  </div>
                  <button onClick={startSecondInnings}>Start 2nd Innings</button>
                </>
              ) : (
                <button
                  onClick={() =>
                    onGameComplete({
                      resultType:
                        player1Score > player2Score
                          ? "victory"
                          : player1Score < player2Score
                          ? "lose"
                          : "draw",
                      playerScore: player1Score,
                      computerScore: player2Score,
                      winMargin: Math.abs(player1Score - player2Score),
                    })
                  }
                >
                  Show Result
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
