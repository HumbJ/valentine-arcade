import { useState, useCallback, useEffect, useRef } from "react";
import "./WaterfallHop.css";

type GamePhase = "intro" | "playing" | "complete";

interface Rock {
  id: number;
  position: number; // 0-2 (left, center, right)
  distance: number; // vertical position (0-100%)
}

export function WaterfallHop({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [playerPosition, setPlayerPosition] = useState(1); // 0=left, 1=center, 2=right
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const speedRef = useRef(1); // Rocks per second
  const nextRockIdRef = useRef(0);

  const GAME_DURATION = 30000; // 30 seconds
  const startTimeRef = useRef(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);

  // Generate next rock position
  const generateRock = useCallback((): Rock => {
    const position = Math.floor(Math.random() * 3); // 0, 1, or 2
    return {
      id: nextRockIdRef.current++,
      position,
      distance: 0, // Start at top
    };
  }, []);

  // Handle player movement
  const handleMove = (direction: "left" | "right") => {
    if (phase !== "playing" || failed) return;

    setPlayerPosition((prev) => {
      if (direction === "left") return Math.max(0, prev - 1);
      if (direction === "right") return Math.min(2, prev + 1);
      return prev;
    });
  };

  // Check collisions
  const checkCollision = useCallback((rockList: Rock[], playerPos: number) => {
    const COLLISION_ZONE_START = 85; // When rock reaches 85% it enters landing zone
    const COLLISION_ZONE_END = 95; // When rock reaches 95% it exits landing zone

    for (const rock of rockList) {
      // Check if player successfully caught a rock in the landing zone
      if (rock.distance >= COLLISION_ZONE_START && rock.distance <= COLLISION_ZONE_END) {
        if (rock.position === playerPos) {
          // Success! Player landed on rock
          return { success: true, rockId: rock.id };
        }
      }

      // Check if a rock passed the landing zone without being caught (miss)
      if (rock.distance > COLLISION_ZONE_END) {
        // Any rock that passes the zone is a fail
        return { success: false, rockId: rock.id };
      }
    }
    return null;
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    startTimeRef.current = Date.now();
    lastSpawnRef.current = 0;
    nextRockIdRef.current = 0;
    speedRef.current = 1;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setPhase("complete");
        return;
      }

      // Increase difficulty over time
      const difficulty = Math.min(2.5, 1 + elapsed / 15000);
      speedRef.current = difficulty;

      // Spawn rocks
      if (now - lastSpawnRef.current > 1000 / speedRef.current) {
        setRocks((prev) => [...prev, generateRock()]);
        lastSpawnRef.current = now;
      }

      // Move rocks down and remove off-screen rocks
      setRocks((prev) => {
        const updated = prev
          .map((rock) => ({
            ...rock,
            distance: rock.distance + 0.8 * difficulty, // Speed increases with difficulty
          }))
          .filter((rock) => rock.distance < 110); // Remove rocks past bottom

        // Check collisions
        const collision = checkCollision(updated, playerPosition);
        if (collision) {
          if (collision.success) {
            setScore((s) => s + 1);
          } else {
            setFailed(true);
            setTimeout(() => {
              setPhase("complete");
            }, 1000);
          }
          // Remove the rock that was jumped on/missed
          return updated.filter((r) => r.id !== collision.rockId);
        }

        return updated;
      });

      if (!failed) {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [phase, playerPosition, failed, generateRock, checkCollision]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        handleMove("left");
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handleMove("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, failed]);

  // Start game
  const startGame = () => {
    setPhase("playing");
    setPlayerPosition(1);
    setRocks([]);
    setScore(0);
    setFailed(false);
    setTimeRemaining(GAME_DURATION);
  };

  return (
    <div className="wh-overlay">
      <div className="wh-wrap">
        <div className="wh-content">
          <div className="wh-title">{title ?? "Waterfall Hop"}</div>
          <div className="wh-subtitle">
            {subtitle ?? "Jump across the rocks!"}
          </div>

          {phase === "intro" && (
            <div className="wh-intro">
              <div className="wh-intro-text">
                The waterfall roars beside us, mist in the air. Time to hop
                across the rocks and see how far we can get!
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Use arrow keys or tap buttons to move left/right
                <br />
                • Land on the rocks as they pass
                <br />
                • Don't miss any rocks!
                <br />• Survive 30 seconds!
              </div>
              <button className="wh-btn primary" onClick={startGame}>
                Start hopping! 💧
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="wh-playing">
              <div className="wh-stats">
                <div className="wh-stat">
                  <span className="wh-stat-label">Score:</span>
                  <span className="wh-stat-value">{score}</span>
                </div>
                <div className="wh-stat">
                  <span className="wh-stat-label">Time:</span>
                  <span className="wh-stat-value">
                    {Math.ceil(timeRemaining / 1000)}s
                  </span>
                </div>
              </div>

              <div className="wh-game-area">
                {/* Rocks */}
                {rocks.map((rock) => (
                  <div
                    key={rock.id}
                    className="wh-rock"
                    style={{
                      left: rock.position === 0 ? "15%" : rock.position === 1 ? "50%" : "85%",
                      top: `${rock.distance}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    🪨
                  </div>
                ))}

                {/* Player */}
                <div
                  className={`wh-player ${failed ? "failed" : ""}`}
                  style={{
                    left: playerPosition === 0 ? "15%" : playerPosition === 1 ? "50%" : "85%",
                  }}
                >
                  🧍
                </div>

                {/* Landing zone indicator */}
                <div className="wh-landing-zone"></div>
              </div>

              <div className="wh-controls">
                <button className="wh-control-btn" onClick={() => handleMove("left")}>
                  ← Left
                </button>
                <button className="wh-control-btn" onClick={() => handleMove("right")}>
                  Right →
                </button>
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="wh-complete">
              <div className="wh-complete-emoji">
                {failed ? "💦" : "🎉"}
              </div>
              <div className="wh-final-score">
                {failed ? `Made it ${score} hops!` : `Perfect! ${score} hops!`}
              </div>
              <div className="wh-complete-text">
                {failed
                  ? "The mist got you, but what a ride! The waterfalls were worth it! 💧"
                  : score >= 50
                  ? "Incredible! You're a waterfall hopping champion! 🏆"
                  : score >= 30
                  ? "Amazing hops! Those rocks didn't stand a chance! 💪"
                  : "You survived the waterfalls! What an adventure! ✨"}
              </div>
              <button className="wh-btn primary" onClick={onDone}>
                Back to dry land →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
