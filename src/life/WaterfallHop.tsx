import { useState, useCallback, useEffect, useRef } from "react";
import "./WaterfallHop.css";

type GamePhase = "intro" | "playing" | "complete";

interface WaterStream {
  id: number;
  position: number; // 0-2 (left, center, right)
  distance: number; // vertical position (0-100%)
  speed: number; // how fast this stream falls
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
  const [waterStreams, setWaterStreams] = useState<WaterStream[]>([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const nextStreamIdRef = useRef(0);
  const playerPositionRef = useRef(1); // Track player position in ref for game loop
  const failedRef = useRef(false);

  const GAME_DURATION = 30000; // 30 seconds
  const startTimeRef = useRef(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);

  // Generate next water stream position (smart spawning to avoid boxing player out)
  const generateStream = useCallback((activeStreams: WaterStream[]): WaterStream => {
    // Check which positions have recent active streams (in upper 40% of screen)
    const blockedPositions = new Set(
      activeStreams
        .filter((s) => s.distance < 40)
        .map((s) => s.position)
    );

    // If all 3 positions would be blocked, pick a random open one
    let position: number;
    if (blockedPositions.size >= 2) {
      // Find available positions
      const available = [0, 1, 2].filter((p) => !blockedPositions.has(p));
      position = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : Math.floor(Math.random() * 3);
    } else {
      position = Math.floor(Math.random() * 3);
    }

    const speed = 0.6 + Math.random() * 0.4; // 0.6-1.0 speed multiplier
    return {
      id: nextStreamIdRef.current++,
      position,
      distance: 0, // Start at top
      speed,
    };
  }, []);

  // Handle player movement
  const handleMove = (direction: "left" | "right") => {
    if (phase !== "playing" || failed) return;

    setPlayerPosition((prev) => {
      const newPos = direction === "left" ? Math.max(0, prev - 1) : direction === "right" ? Math.min(2, prev + 1) : prev;
      playerPositionRef.current = newPos; // Keep ref in sync
      return newPos;
    });
  };

  // Check collisions
  const checkCollision = useCallback((streamList: WaterStream[], playerPos: number) => {
    const PLAYER_ZONE_START = 90; // Very tight hitbox around player
    const PLAYER_ZONE_END = 94;

    for (const stream of streamList) {
      // Check if water stream hits the player zone
      if (stream.distance >= PLAYER_ZONE_START && stream.distance <= PLAYER_ZONE_END) {
        if (stream.position === playerPos) {
          // Hit by water!
          return { hit: true, streamId: stream.id };
        }
      }
    }
    return null;
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    startTimeRef.current = Date.now();
    lastSpawnRef.current = 0;
    nextStreamIdRef.current = 0;
    failedRef.current = false;

    const loop = () => {
      if (failedRef.current) return; // Stop loop if failed

      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      setTimeRemaining(remaining);

      // Score = seconds survived
      setScore(Math.floor(elapsed / 1000));

      if (remaining <= 0) {
        setPhase("complete");
        return;
      }

      // Increase difficulty over time
      const difficulty = Math.min(1.5, 1 + elapsed / 15000);

      // Spawn water streams (faster as game progresses)
      if (now - lastSpawnRef.current > 800 / difficulty) {
        setWaterStreams((prev) => [...prev, generateStream(prev)]);
        lastSpawnRef.current = now;
      }

      // Move streams down and remove off-screen streams
      setWaterStreams((prev) => {
        const updated = prev
          .map((stream) => ({
            ...stream,
            distance: stream.distance + 0.6 * stream.speed * difficulty,
          }))
          .filter((stream) => stream.distance < 110); // Remove streams past bottom

        // Check collisions using ref to avoid dependency
        const collision = checkCollision(updated, playerPositionRef.current);
        if (collision && !failedRef.current) {
          failedRef.current = true;
          setFailed(true);
          setTimeout(() => {
            setPhase("complete");
          }, 1000);
        }

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [phase, generateStream, checkCollision]);

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
    playerPositionRef.current = 1;
    setWaterStreams([]);
    setScore(0);
    setFailed(false);
    failedRef.current = false;
    setTimeRemaining(GAME_DURATION);
  };

  return (
    <div className="wh-overlay">
      <div className="wh-wrap">
        <div className="wh-content">
          <div className="wh-title">{title ?? "Waterfall Dodge"}</div>
          <div className="wh-subtitle">
            {subtitle ?? "Dodge the falling water!"}
          </div>

          {phase === "intro" && (
            <div className="wh-intro">
              <div className="wh-intro-text">
                The waterfall roars beside us, cascading water everywhere. Can you
                dodge the streams and stay dry for 30 seconds?
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Use arrow keys or tap buttons to move left/right
                <br />
                • Avoid the falling water streams
                <br />
                • Stay dry as long as possible!
                <br />• Survive 30 seconds to win!
              </div>
              <button className="wh-btn primary" onClick={startGame}>
                Start dodging! 💧
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="wh-playing">
              <div className="wh-stats">
                <div className="wh-stat">
                  <span className="wh-stat-label">Time Survived:</span>
                  <span className="wh-stat-value">{score}s</span>
                </div>
                <div className="wh-stat">
                  <span className="wh-stat-label">Time Left:</span>
                  <span className="wh-stat-value">
                    {Math.ceil(timeRemaining / 1000)}s
                  </span>
                </div>
              </div>

              <div className="wh-game-area">
                {/* Water streams */}
                {waterStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="wh-water-stream"
                    style={{
                      left: stream.position === 0 ? "15%" : stream.position === 1 ? "50%" : "85%",
                      top: `${stream.distance}%`,
                    }}
                  >
                    <div className="wh-water-gradient"></div>
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

                {/* Player zone indicator (bottom 15%) */}
                <div className="wh-player-zone"></div>
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
                {failed ? `Survived ${score} seconds!` : `Perfect! ${score} seconds!`}
              </div>
              <div className="wh-complete-text">
                {failed
                  ? score >= 20
                    ? "Almost made it! The waterfall was relentless! 💧"
                    : score >= 10
                    ? "Good effort! Those streams are tricky! 🌊"
                    : "The mist got you early, but what a rush! 💦"
                  : "Incredible! You stayed completely dry! You're a waterfall master! 🏆"}
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
