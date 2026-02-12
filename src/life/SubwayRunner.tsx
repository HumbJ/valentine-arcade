import { useEffect, useRef, useState, useCallback } from "react";
import "./SubwayRunner.css";

interface SubwayRunnerProps {
  title?: string;
  subtitle?: string;
  onDone: (score?: number) => void;
}

type Lane = 0 | 1 | 2; // Three lanes: left, middle, right

interface Player {
  lane: Lane;
  isJumping: boolean;
  jumpProgress: number; // 0 to 1, for animation
}

interface Obstacle {
  id: number;
  lane: Lane;
  z: number; // Distance from player (0 = at player, positive = ahead)
  type: "barrier" | "sign"; // Different obstacle types
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const LANE_WIDTH = 150;
const INITIAL_SPEED = 4;
const SPEED_INCREMENT = 0.3; // Speed increase every 10 points
const OBSTACLE_SPAWN_DISTANCE = 80;
const JUMP_DURATION = 500; // ms
const LANE_SWITCH_SPEED = 0.15; // How fast to move between lanes

export function SubwayRunner({
  title = "Subway Runner",
  subtitle,
  onDone,
}: SubwayRunnerProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "complete">("intro");
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunningRef = useRef(false);
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const playerRef = useRef<Player>({
    lane: 1,
    isJumping: false,
    jumpProgress: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstacleIdRef = useRef(0);
  const targetLaneRef = useRef<Lane>(1);
  const jumpStartTimeRef = useRef(0);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    playerRef.current = {
      lane: 1,
      isJumping: false,
      jumpProgress: 0,
    };
    targetLaneRef.current = 1;
    obstaclesRef.current = [];
    nextObstacleIdRef.current = 0;
    isRunningRef.current = true;
    setPhase("playing");
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunningRef.current) return;

      const player = playerRef.current;

      // Lane switching with A/D or Arrow keys
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (targetLaneRef.current > 0) {
          targetLaneRef.current = (targetLaneRef.current - 1) as Lane;
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (targetLaneRef.current < 2) {
          targetLaneRef.current = (targetLaneRef.current + 1) as Lane;
        }
      } else if (
        (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") &&
        !player.isJumping
      ) {
        // Jump
        player.isJumping = true;
        player.jumpProgress = 0;
        jumpStartTimeRef.current = Date.now();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

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
      const deltaTime = now - lastTime;
      lastTime = now;

      if (!isRunningRef.current) return;

      // Update player lane position (smooth transition)
      const player = playerRef.current;
      const targetLane = targetLaneRef.current;
      if (player.lane !== targetLane) {
        const diff = targetLane - player.lane;
        const step = Math.sign(diff) * Math.min(LANE_SWITCH_SPEED, Math.abs(diff));
        player.lane = (player.lane + step) as Lane;

        // Snap to target if close enough
        if (Math.abs(targetLane - player.lane) < 0.01) {
          player.lane = targetLane;
        }
      }

      // Update jump progress
      if (player.isJumping) {
        const jumpElapsed = now - jumpStartTimeRef.current;
        player.jumpProgress = Math.min(1, jumpElapsed / JUMP_DURATION);

        if (player.jumpProgress >= 1) {
          player.isJumping = false;
          player.jumpProgress = 0;
        }
      }

      // Move obstacles closer
      const speed = speedRef.current;
      obstaclesRef.current = obstaclesRef.current.map((obs) => ({
        ...obs,
        z: obs.z - speed,
      }));

      // Remove obstacles that have passed the player
      obstaclesRef.current = obstaclesRef.current.filter((obs) => {
        if (obs.z < -20) {
          // Passed the player - score point
          scoreRef.current += 1;
          setScore(scoreRef.current);

          // Increase speed every 10 points
          if (scoreRef.current % 10 === 0) {
            speedRef.current += SPEED_INCREMENT;
          }

          return false;
        }
        return true;
      });

      // Spawn new obstacles - check if last obstacle has moved far enough
      const lastObstacle = obstaclesRef.current[obstaclesRef.current.length - 1];
      const shouldSpawn = !lastObstacle || lastObstacle.z < CANVAS_HEIGHT - OBSTACLE_SPAWN_DISTANCE;

      if (shouldSpawn) {
        const randomLane = Math.floor(Math.random() * 3) as Lane;
        const randomType = Math.random() > 0.5 ? "barrier" : "sign";

        obstaclesRef.current.push({
          id: nextObstacleIdRef.current++,
          lane: randomLane,
          z: CANVAS_HEIGHT,
          type: randomType,
        });
      }

      // Check collisions
      const playerLane = Math.round(player.lane) as Lane;
      const hitObstacle = obstaclesRef.current.some((obs) => {
        // Check if obstacle is in collision range (z position)
        if (obs.z > 20 || obs.z < -20) return false;

        // Check if same lane
        if (obs.lane !== playerLane) return false;

        // Check if player is jumping (can avoid low obstacles)
        if (player.isJumping && player.jumpProgress > 0.2 && player.jumpProgress < 0.8) {
          return false;
        }

        return true;
      });

      if (hitObstacle) {
        isRunningRef.current = false;
        setPhase("complete");
        return;
      }

      // Draw everything
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background (subway tracks)
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw lane lines
      ctx.strokeStyle = "#ffcc00";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);

      for (let i = 1; i < 3; i++) {
        const x = LANE_WIDTH * i + (CANVAS_WIDTH - LANE_WIDTH * 3) / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw obstacles
      obstaclesRef.current.forEach((obs) => {
        const perspective = 1 - obs.z / CANVAS_HEIGHT;
        const size = 30 + perspective * 30;
        const x = LANE_WIDTH * obs.lane + LANE_WIDTH / 2 + (CANVAS_WIDTH - LANE_WIDTH * 3) / 2;
        const y = CANVAS_HEIGHT - 80 - (CANVAS_HEIGHT - obs.z) * 0.5;

        if (obs.type === "barrier") {
          ctx.fillStyle = "#ff4444";
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        } else {
          ctx.fillStyle = "#44ff44";
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw player
      const playerX = LANE_WIDTH * player.lane + LANE_WIDTH / 2 + (CANVAS_WIDTH - LANE_WIDTH * 3) / 2;
      const jumpHeight = player.isJumping ? Math.sin(player.jumpProgress * Math.PI) * 40 : 0;
      const playerY = CANVAS_HEIGHT - 80 - jumpHeight;

      ctx.fillStyle = "#4488ff";
      ctx.fillRect(playerX - 20, playerY - 30, 40, 40);

      // Draw score
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);
      ctx.fillText(`Speed: ${speedRef.current.toFixed(1)}x`, 10, 55);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [phase]);

  return (
    <div className="subway-runner-wrapper">
      <div className="subway-runner-container">
        <div className="subway-runner-header">
          <h2 className="subway-runner-title">{title}</h2>
          {subtitle && <p className="subway-runner-subtitle">{subtitle}</p>}
        </div>

        <div className="subway-runner-content">
          {phase === "intro" && (
            <div className="subway-runner-intro">
              <p className="subway-runner-instructions">
                🚇 Dodge obstacles on the subway tracks!
              </p>
              <p className="subway-runner-instructions">
                Use <strong>A/D</strong> or <strong>←/→</strong> to switch lanes
              </p>
              <p className="subway-runner-instructions">
                Use <strong>W/↑/Space</strong> to jump
              </p>
              <button className="subway-runner-btn primary" onClick={startGame}>
                Start Running! 🏃
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="subway-runner-game">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="subway-runner-canvas"
              />
            </div>
          )}

          {phase === "complete" && (
            <div className="subway-runner-complete">
              <div className="subway-runner-final-score">
                Final Score: {score}
              </div>
              <div className="subway-runner-complete-text">
                {score >= 50
                  ? "Subway Master! You can't be stopped! 🏆"
                  : score >= 30
                  ? "Amazing run through the city! 🚇"
                  : score >= 15
                  ? "Great reflexes! Getting better! 🏃"
                  : score >= 5
                  ? "Nice try! The subway is tricky! 🎯"
                  : "The subway beat us this time! 🚊"}
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="subway-runner-btn primary" onClick={startGame}>
                  Try again 🏃
                </button>
                <button className="subway-runner-btn primary" onClick={() => onDone(score)}>
                  Back to exploring →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
