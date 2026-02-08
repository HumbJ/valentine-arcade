import { useState, useCallback, useEffect } from "react";
import "./IslandDrive.css";

type GamePhase = "intro" | "watching" | "playing" | "result" | "complete";

interface RouteSign {
  id: string;
  icon: string;
  label: string;
}

const ROUTE_SIGNS: RouteSign[] = [
  { id: "left", icon: "⬅️", label: "Turn Left" },
  { id: "right", icon: "➡️", label: "Turn Right" },
  { id: "straight", icon: "⬆️", label: "Go Straight" },
  { id: "beach", icon: "🏖️", label: "Beach" },
  { id: "volcano", icon: "🌋", label: "Volcano" },
  { id: "palm", icon: "🌴", label: "Palm Trees" },
];

const ROUNDS = 4;

export function IslandDrive({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentRound, setCurrentRound] = useState(0);
  const [route, setRoute] = useState<RouteSign[]>([]);
  const [playerRoute, setPlayerRoute] = useState<RouteSign[]>([]);
  const [showingIndex, setShowingIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  // Generate a random route
  const generateRoute = useCallback((length: number) => {
    const newRoute: RouteSign[] = [];
    for (let i = 0; i < length; i++) {
      const sign = ROUTE_SIGNS[Math.floor(Math.random() * ROUTE_SIGNS.length)];
      newRoute.push(sign);
    }
    return newRoute;
  }, []);

  // Start a round
  const startRound = useCallback(() => {
    const routeLength = 3 + currentRound; // 3, 4, 5, 6 signs
    const newRoute = generateRoute(routeLength);
    setRoute(newRoute);
    setPlayerRoute([]);
    setShowingIndex(0);
    setFeedback(null);
    setPhase("watching");
  }, [currentRound, generateRoute]);

  // Show route sequence
  useEffect(() => {
    if (phase === "watching" && showingIndex < route.length) {
      const timer = setTimeout(() => {
        setShowingIndex(showingIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "watching" && showingIndex >= route.length) {
      setTimeout(() => {
        setPhase("playing");
      }, 800);
    }
  }, [phase, showingIndex, route.length]);

  // Handle player selection
  const handleSignClick = useCallback(
    (sign: RouteSign) => {
      const newPlayerRoute = [...playerRoute, sign];
      setPlayerRoute(newPlayerRoute);

      const expectedSign = route[playerRoute.length];
      if (sign.id !== expectedSign.id) {
        // Wrong!
        setFeedback("wrong");
        setTimeout(() => {
          setPhase("result");
        }, 1200);
        return;
      }

      // Check if route complete
      if (newPlayerRoute.length === route.length) {
        // Correct!
        setFeedback("correct");
        setScore((s) => s + 1);
        setTimeout(() => {
          if (currentRound + 1 >= ROUNDS) {
            setPhase("complete");
          } else {
            setCurrentRound((r) => r + 1);
            setPhase("result");
          }
        }, 1200);
      }
    },
    [playerRoute, route, currentRound]
  );

  // Continue to next round
  const continueToNextRound = () => {
    startRound();
  };

  // Start the game
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    startRound();
  };

  return (
    <div className="id-overlay">
      <div className="id-wrap">
        <div className="id-content">
          <div className="id-title">{title ?? "Island Drive"}</div>
          <div className="id-subtitle">
            {subtitle ?? "Remember the route around the island!"}
          </div>

          {phase === "intro" && (
            <div className="id-intro">
              <div className="id-intro-text">
                Driving around the island, every turn reveals something new. Can you remember the route we took?
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Watch the route signs carefully
                <br />
                • Remember the sequence
                <br />• Tap the signs in the same order!
              </div>
              <button className="id-btn primary" onClick={startGame}>
                Hit the road! 🚗
              </button>
            </div>
          )}

          {phase === "watching" && (
            <div className="id-watching">
              <div className="id-round-info">
                Round {currentRound + 1} / {ROUNDS}
              </div>
              <div className="id-instruction">Watch the route...</div>
              <div className="id-route-display">
                {route.map((sign, index) => (
                  <div
                    key={index}
                    className={`id-sign-display ${index === showingIndex - 1 ? "showing" : ""} ${
                      index < showingIndex ? "shown" : ""
                    }`}
                  >
                    {index < showingIndex && (
                      <>
                        <div className="id-sign-icon">{sign.icon}</div>
                        <div className="id-sign-label">{sign.label}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "playing" && (
            <div className="id-playing">
              <div className="id-round-info">
                Round {currentRound + 1} / {ROUNDS}
              </div>
              <div className="id-instruction">Tap the route in order!</div>

              <div className="id-player-route">
                {playerRoute.map((sign, index) => (
                  <div key={index} className="id-player-sign">
                    {sign.icon}
                  </div>
                ))}
              </div>

              <div className="id-sign-grid">
                {ROUTE_SIGNS.map((sign) => (
                  <button
                    key={sign.id}
                    className="id-sign-btn"
                    onClick={() => handleSignClick(sign)}
                  >
                    <div className="id-sign-icon">{sign.icon}</div>
                    <div className="id-sign-label">{sign.label}</div>
                  </button>
                ))}
              </div>

              {feedback && (
                <div className={`id-feedback ${feedback}`}>
                  {feedback === "correct" ? "Perfect! ✓" : "Wrong turn! ✗"}
                </div>
              )}
            </div>
          )}

          {phase === "result" && feedback === "wrong" && (
            <div className="id-result">
              <div className="id-result-text">
                Oops! Took a wrong turn. But that's part of the adventure!
              </div>
              <div className="id-final-score">
                Rounds completed: {score} / {ROUNDS}
              </div>
              <button className="id-btn primary" onClick={onDone}>
                Keep exploring →
              </button>
            </div>
          )}

          {phase === "result" && feedback === "correct" && (
            <div className="id-result">
              <div className="id-result-text">Perfect! On to the next stretch!</div>
              <button className="id-btn primary" onClick={continueToNextRound}>
                Next route →
              </button>
            </div>
          )}

          {phase === "complete" && (
            <div className="id-complete">
              <div className="id-final-score">
                {score} / {ROUNDS} routes mastered!
              </div>
              <div className="id-complete-text">
                {score === ROUNDS
                  ? "You know this island like a local! 🗺️"
                  : score >= ROUNDS - 1
                  ? "Great navigation! The island is ours. 🌺"
                  : "We found our way, even if we took a few scenic detours! 🌴"}
              </div>
              <button className="id-btn primary" onClick={onDone}>
                Park the car →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
