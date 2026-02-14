import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadSave } from "../life/save";
import {
  getUnlockedFoodMemories,
  getFoodStats,
  getRandomOptions,
  type FoodMemory,
} from "../life/foodRoulette";
import "./FoodRoulettePage.css";

type GameState = "idle" | "spinning" | "showing" | "answered";

export function FoodRoulettePage() {
  const navigate = useNavigate();
  const save = loadSave();
  const stats = getFoodStats(save.completedEvents);
  const unlockedFoods = getUnlockedFoodMemories(save.completedEvents);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentFood, setCurrentFood] = useState<FoodMemory | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);

  const spinWheel = () => {
    if (unlockedFoods.length === 0) return;

    setGameState("spinning");
    setSelectedAnswer(null);

    // Simulate spinning animation
    setTimeout(() => {
      const randomFood = unlockedFoods[Math.floor(Math.random() * unlockedFoods.length)];
      setCurrentFood(randomFood);
      setOptions(getRandomOptions(randomFood.location));
      setGameState("showing");
    }, 2000); // 2 second spin
  };

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== "showing" || !currentFood) return;

    setSelectedAnswer(answer);
    setGameState("answered");
    setTotalPlayed(totalPlayed + 1);

    if (answer === currentFood.location) {
      setScore(score + 1);
    }
  };

  const playAgain = () => {
    setGameState("idle");
    setCurrentFood(null);
    setSelectedAnswer(null);
  };

  if (unlockedFoods.length === 0) {
    return (
      <div className="food-roulette-page">
        <header className="food-header">
          <button className="food-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h1 className="food-title">🍽️ Food Memory Roulette</h1>
        </header>
        <div className="food-empty">
          <p>No food memories unlocked yet!</p>
          <p>Complete trips to unlock food photos.</p>
          <p className="food-stats">
            {stats.unlocked} / {stats.total} unlocked
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="food-roulette-page">
      <header className="food-header">
        <button className="food-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="food-title">🍽️ Food Memory Roulette</h1>
        <p className="food-subtitle">
          {stats.unlocked} / {stats.total} unlocked • Score: {score}/{totalPlayed}
        </p>
      </header>

      <div className="food-content">
        {gameState === "idle" && (
          <div className="food-start">
            <div className="food-wheel-icon">🎡</div>
            <h2>Spin the wheel!</h2>
            <p>Can you remember where we ate each meal?</p>
            <button className="food-spin-btn" onClick={spinWheel}>
              🎲 Spin Wheel
            </button>
          </div>
        )}

        {gameState === "spinning" && (
          <div className="food-spinning">
            <div className="food-wheel-spinner">
              <div className="spinner-emoji">🎡</div>
            </div>
            <p>Spinning...</p>
          </div>
        )}

        {(gameState === "showing" || gameState === "answered") && currentFood && (
          <div className="food-game">
            <div className="food-photo-container">
              <img
                src={currentFood.path}
                alt="Food memory"
                className="food-photo"
              />
            </div>

            <div className="food-question">
              <h2>Where did we eat this?</h2>
              <div className="food-options">
                {options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentFood.location;
                  const showResult = gameState === "answered";

                  let buttonClass = "food-option-btn";
                  if (showResult && isCorrect) {
                    buttonClass += " correct";
                  } else if (showResult && isSelected && !isCorrect) {
                    buttonClass += " incorrect";
                  }

                  return (
                    <button
                      key={option}
                      className={buttonClass}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={gameState === "answered"}
                    >
                      {option}
                      {showResult && isCorrect && " ✓"}
                      {showResult && isSelected && !isCorrect && " ✗"}
                    </button>
                  );
                })}
              </div>
            </div>

            {gameState === "answered" && (
              <div className="food-result">
                {selectedAnswer === currentFood.location ? (
                  <p className="food-result-correct">🎉 Correct!</p>
                ) : (
                  <p className="food-result-wrong">
                    Not quite! It was {currentFood.location}
                  </p>
                )}
                <button className="food-play-again-btn" onClick={playAgain}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
