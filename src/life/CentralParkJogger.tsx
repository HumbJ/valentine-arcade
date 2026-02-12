import { useEffect, useRef, useState, useCallback } from "react";
import "./CentralParkJogger.css";

interface CentralParkJoggerProps {
  title?: string;
  subtitle?: string;
  onDone: (score?: number) => void;
}

interface Obstacle {
  id: number;
  x: number; // 0-1, normalized position
  type: "tree" | "bench" | "rock" | "squirrel";
  passed: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const PLAYER_SIZE = 40;
const PLAYER_X = 150;
const GAME_SPEED = 0.3; // Speed obstacles move toward player
const JUMP_VELOCITY = -0.8;
const GRAVITY = 0.03;
const GAME_DURATION = 45; // seconds

const OBSTACLE_EMOJIS = {
  tree: "🌳",
  bench: "🪑",
  rock: "🪨",
  squirrel: "🐿️",
};

export function CentralParkJogger({
  title = "Central Park Jogger",
  subtitle,
  onDone,
}: CentralParkJoggerProps) {
  const [phase, setPhase] = useState<"intro" | "countdown" | "playing" | "complete">("intro");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunningRef = useRef(false);
  const playerYRef = useRef(GROUND_Y);
  const playerVelocityYRef = useRef(0);
  const isJumpingRef = useRef(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstacleIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const startTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const distanceRef = useRef(0);

  const jump = useCallback(() => {
    if (!isRunningRef.current || isJumpingRef.current) return;

    isJumpingRef.current = true;
    playerVelocityYRef.current = JUMP_VELOCITY;
  }, []);

  const startGame = useCallback(() => {
    setPhase("countdown");
    setCountdown(3);

    // Countdown 3, 2, 1
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPhase("playing");
          startTimeRef.current = Date.now();
          isRunningRef.current = true;
          playerYRef.current = GROUND_Y;
          playerVelocityYRef.current = 0;
          isJumpingRef.current = false;
          obstaclesRef.current = [];
          lastSpawnRef.current = 0;
          scoreRef.current = 0;
          distanceRef.current = 0;
          setScore(0);
          setDistance(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, jump]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      if (!isRunningRef.current) return;

      const gameTime = (now - startTimeRef.current) / 1000;

      // Update distance
      distanceRef.current += deltaTime * 10;
      setDistance(Math.floor(distanceRef.current));

      // Spawn obstacles
      const timeSinceLastSpawn = gameTime - lastSpawnRef.current;
      const minSpawnInterval = Math.max(1.5 - gameTime * 0.01, 0.8); // Gets faster over time

      if (timeSinceLastSpawn > minSpawnInterval) {
        const obstacleTypes: Array<"tree" | "bench" | "rock" | "squirrel"> = ["tree", "bench", "rock", "squirrel"];
        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        obstaclesRef.current.push({
          id: nextObstacleIdRef.current++,
          x: 1.1, // Start off-screen to the right
          type: randomType,
          passed: false,
        });

        lastSpawnRef.current = gameTime;
      }

      // Update player physics
      if (isJumpingRef.current) {
        playerVelocityYRef.current += GRAVITY;
        playerYRef.current += playerVelocityYRef.current * 60 * deltaTime;

        // Land on ground
        if (playerYRef.current >= GROUND_Y) {
          playerYRef.current = GROUND_Y;
          playerVelocityYRef.current = 0;
          isJumpingRef.current = false;
        }
      }

      // Update obstacles
      obstaclesRef.current = obstaclesRef.current.map((obs) => ({
        ...obs,
        x: obs.x - GAME_SPEED * deltaTime,
      }));

      // Check for passing obstacles (score points)
      obstaclesRef.current.forEach((obs) => {
        if (!obs.passed && obs.x < PLAYER_X / CANVAS_WIDTH - 0.05) {
          obs.passed = true;
          scoreRef.current += 10;
          setScore(scoreRef.current);
        }
      });

      // Remove off-screen obstacles
      obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.x > -0.2);

      // Collision detection
      const playerLeft = PLAYER_X;
      const playerRight = PLAYER_X + PLAYER_SIZE;
      const playerTop = playerYRef.current - PLAYER_SIZE;
      const playerBottom = playerYRef.current;

      for (const obs of obstaclesRef.current) {
        const obsX = obs.x * CANVAS_WIDTH;
        const obsSize = 50;
        const obsLeft = obsX - obsSize / 2;
        const obsRight = obsX + obsSize / 2;
        const obsTop = GROUND_Y - obsSize;
        const obsBottom = GROUND_Y;

        // Check collision
        if (
          playerRight > obsLeft &&
          playerLeft < obsRight &&
          playerBottom > obsTop &&
          playerTop < obsBottom
        ) {
          // Game over
          isRunningRef.current = false;
          setPhase("complete");
          return;
        }
      }

      // Check if game time is up
      if (gameTime >= GAME_DURATION) {
        isRunningRef.current = false;
        setPhase("complete");
        return;
      }

      // Draw everything
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      skyGradient.addColorStop(0, "#87CEEB");
      skyGradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ground
      ctx.fillStyle = "#90EE90";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

      // Draw ground line
      ctx.strokeStyle = "#228B22";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.stroke();

      // Draw player (running person emoji)
      ctx.font = `${PLAYER_SIZE}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("🏃", PLAYER_X + PLAYER_SIZE / 2, playerYRef.current);

      // Draw obstacles
      obstaclesRef.current.forEach((obs) => {
        const x = obs.x * CANVAS_WIDTH;
        ctx.font = "50px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(OBSTACLE_EMOJIS[obs.type], x, GROUND_Y);
      });

      // Draw score
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);
      ctx.fillText(`Distance: ${Math.floor(distanceRef.current)}m`, 20, 70);

      // Draw time remaining
      const timeLeft = Math.max(0, GAME_DURATION - gameTime);
      ctx.textAlign = "right";
      ctx.fillText(`Time: ${Math.ceil(timeLeft)}s`, CANVAS_WIDTH - 20, 40);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [phase]);

  return (
    <div className="centralparkjogger-wrapper">
      <div className="centralparkjogger-container">
        <div className="centralparkjogger-header">
          <h2 className="centralparkjogger-title">{title}</h2>
          {subtitle && <p className="centralparkjogger-subtitle">{subtitle}</p>}
        </div>

        <div className="centralparkjogger-content">
          {phase === "intro" && (
            <div className="centralparkjogger-intro">
              <p className="centralparkjogger-instructions">
                🏃 Jog through Central Park and avoid obstacles!
              </p>
              <p className="centralparkjogger-instructions">
                Jump over trees, benches, rocks, and squirrels
              </p>
              <p className="centralparkjogger-instructions">
                Press SPACE or ↑ to jump
              </p>
              <p className="centralparkjogger-instructions">
                Survive for 45 seconds!
              </p>
              <button className="centralparkjogger-btn primary" onClick={startGame}>
                Start Jogging! 🏃
              </button>
            </div>
          )}

          {phase === "countdown" && (
            <div className="centralparkjogger-countdown">
              <div className="centralparkjogger-countdown-number">{countdown}</div>
            </div>
          )}

          {phase === "playing" && (
            <div className="centralparkjogger-game">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="centralparkjogger-canvas"
              />
              <div className="centralparkjogger-controls">
                <button
                  className="centralparkjogger-jump-btn"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    jump();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    jump();
                  }}
                >
                  JUMP ⬆️
                </button>
              </div>
              <div className="centralparkjogger-mobile-hint">
                Tap the JUMP button or press SPACE to jump!
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="centralparkjogger-complete">
              <div className="centralparkjogger-final-score">
                <div>Final Score: {score}</div>
                <div>Distance: {distance}m</div>
              </div>
              <div className="centralparkjogger-complete-text">
                {distance >= 400
                  ? "Marathon runner! You crushed that jog! 🏃✨"
                  : distance >= 300
                  ? "Great run! You've got stamina! 🎯"
                  : distance >= 200
                  ? "Nice jog! Keep it up! 💪"
                  : distance >= 100
                  ? "Good effort! Practice makes perfect! 🏃"
                  : "Keep training! The park awaits! 🌳"}
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="centralparkjogger-btn primary" onClick={startGame}>
                  Jog again 🏃
                </button>
                <button
                  className="centralparkjogger-btn primary"
                  onClick={() => onDone(score)}
                >
                  Continue exploring →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
