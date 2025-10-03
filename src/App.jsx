import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";       
import MultiplayerScreen from "./screens/MultiplayerScreen";  
import TossScreen from "./screens/TossScreen";           
import GameScreen from "./screens/GameScreen";           
import ResultScreen from "./screens/ResultScreen";       // ✅ fixed path
import Leaderboard from "./screens/Leaderboard";        // ✅ import Leaderboard
import IntroScreen from "./screens/IntroScreen";        // ✅ new import

function App() {
  const [screen, setScreen] = useState("intro");  // ✅ start with intro screen
  const [gameSettings, setGameSettings] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // 🔹 Game finish hone par result screen open karna
  const handleGameComplete = (resultData) => {
    setGameResult(resultData);
    setScreen("result");
  };

  // 🔹 Reset and back to home
  const handleBackToHome = () => {
    setScreen("home");
    setGameSettings(null);
    setGameResult(null);
  };

  // 🔹 Play again → Toss screen pe le jao
  const handlePlayAgain = () => {
    setScreen("toss");
    setGameResult(null);
  };

  // 🔹 Leaderboard open karo
  const handleLeaderboard = () => {
    setScreen("leaderboard");
  };

  // 🔹 Back to Result from Leaderboard
  const handleBackToResult = () => {
    setScreen("result");
  };

  return (
    <>
      {screen === "intro" && <IntroScreen onStart={() => setScreen("home")} />}  {/* ✅ new intro screen */}

      {screen === "home" && <HomeScreen onAction={setScreen} />}

      {screen === "multiplayer" && <MultiplayerScreen onAction={setScreen} />}

      {screen === "toss" && (
        <TossScreen
          onAction={setScreen}
          setGameSettings={setGameSettings}
        />
      )}

      {screen === "game" && (
        <GameScreen
          onAction={setScreen}
          gameSettings={gameSettings}
          onGameComplete={handleGameComplete} // ✅ yahi se result screen trigger hoga
        />
      )}

      {screen === "result" && gameResult && (
        <ResultScreen
          resultType={gameResult.resultType}        // 'victory' | 'lose' | 'draw'
          playerScore={gameResult.playerScore}
          computerScore={gameResult.computerScore}
          winMargin={gameResult.winMargin}
          onBackToHome={handleBackToHome}
          onPlayAgain={handlePlayAgain}
          onLeaderboard={handleLeaderboard}
        />
      )}

      {screen === "leaderboard" && (
        <Leaderboard onBackToResult={handleBackToResult} />
      )}
    </>
  );
}

export default App;

