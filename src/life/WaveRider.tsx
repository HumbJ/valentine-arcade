import { useState, useEffect, useRef, useCallback } from "react";
import "./WaveRider.css";

type GamePhase = "intro" | "playing" | "complete";

interface Wave {
  id: number;
  x: number; // position from left
  gapY: number; // center of the gap (0-1)
  gapSize: number; // size of the gap
  passed: boolean; // has the surfer passed through this wave?
}

interface Surfer {
  y: number; // vertical position (0-1, where 0 is top, 1 is bottom)
  velocity: number; // vertical velocity
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const SURFER_X = 100; // Fixed x position for surfer
const SURFER_SIZE = 0.05; // Surfer hitbox size as fraction of canvas (40px / 400px ≈ 0.1, but we use 0.05 for margin)
const GRAVITY = 0.0015;
const FLAP_POWER = -0.035;
const WAVE_WIDTH = 80;
const INITIAL_WAVE_SPEED = 3;
const WAVE_SPAWN_DISTANCE = 250; // pixels between waves
const GAP_SIZE = 0.25; // size of gap as fraction of canvas height

export function WaveRider({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const wavesRef = useRef<Wave[]>([]);
  const surferRef = useRef<Surfer>({ y: 0.5, velocity: 0 });
  const nextWaveIdRef = useRef(0);
  const isRunningRef = useRef(false);
  const isPressedRef = useRef(false);
  const scoreRef = useRef(0);
  const waveSpeedRef = useRef(INITIAL_WAVE_SPEED);
  const lastWaveXRef = useRef(CANVAS_WIDTH);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    wavesRef.current = [];
    surferRef.current = { y: 0.5, velocity: 0 };
    nextWaveIdRef.current = 0;
    isRunningRef.current = true;
    isPressedRef.current = false;
    scoreRef.current = 0;
    waveSpeedRef.current = INITIAL_WAVE_SPEED;
    lastWaveXRef.current = CANVAS_WIDTH;
  };

  const flap = useCallback(() => {
    if (phase !== "playing" || !isRunningRef.current) return;
    isPressedRef.current = true;
  }, [phase]);

  const stopFlap = useCallback(() => {
    isPressedRef.current = false;
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = Date.now();

    const gameLoop = () => {
      if (!isRunningRef.current) return;

      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Spawn new waves
      const lastWave = wavesRef.current[wavesRef.current.length - 1];
      const shouldSpawn = !lastWave || lastWave.x < lastWaveXRef.current - WAVE_SPAWN_DISTANCE;

      if (shouldSpawn) {
        const wave: Wave = {
          id: nextWaveIdRef.current++,
          x: CANVAS_WIDTH,
          gapY: 0.3 + Math.random() * 0.4, // Random gap position between 0.3 and 0.7
          gapSize: GAP_SIZE,
          passed: false,
        };
        wavesRef.current.push(wave);
        lastWaveXRef.current = CANVAS_WIDTH;
      }

      // Update waves
      wavesRef.current = wavesRef.current.filter((wave) => {
        wave.x -= waveSpeedRef.current;

        // Check if surfer passed through the wave
        if (!wave.passed && wave.x + WAVE_WIDTH / 2 < SURFER_X) {
          wave.passed = true;
          scoreRef.current++;
          setScore(scoreRef.current);

          // Increase speed every 5 points
          if (scoreRef.current % 5 === 0) {
            waveSpeedRef.current += 0.5;
          }
        }

        return wave.x + WAVE_WIDTH > 0; // Remove waves that are off screen
      });

      // Update surfer physics
      const surfer = surferRef.current;

      // Apply flap or gravity
      if (isPressedRef.current) {
        surfer.velocity = FLAP_POWER;
      } else {
        surfer.velocity += GRAVITY * deltaTime;
      }

      surfer.y += surfer.velocity * deltaTime;

      // Check for collisions (with margin for surfer size)
      const hitTopOrBottom = surfer.y <= SURFER_SIZE || surfer.y >= (1 - SURFER_SIZE);

      const hitWave = wavesRef.current.some((wave) => {
        const surferInWaveX = SURFER_X > wave.x - 20 && SURFER_X < wave.x + WAVE_WIDTH + 20;
        if (!surferInWaveX) return false;

        const gapTop = wave.gapY - wave.gapSize / 2;
        const gapBottom = wave.gapY + wave.gapSize / 2;
        const surferInGap = surfer.y > gapTop && surfer.y < gapBottom;

        return !surferInGap; // Collision if NOT in gap
      });

      if (hitTopOrBottom || hitWave) {
        isRunningRef.current = false;
        setPhase("complete");
        return;
      }

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ocean background
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(0.7, "#4A90E2");
      gradient.addColorStop(1, "#2E5C8A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw waves with gaps
      wavesRef.current.forEach((wave) => {
        const gapTopY = wave.gapY * CANVAS_HEIGHT - (wave.gapSize * CANVAS_HEIGHT) / 2;
        const gapBottomY = wave.gapY * CANVAS_HEIGHT + (wave.gapSize * CANVAS_HEIGHT) / 2;

        ctx.fillStyle = "#3A7BD5";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;

        // Top wave section
        ctx.beginPath();
        ctx.rect(wave.x, 0, WAVE_WIDTH, gapTopY);
        ctx.fill();
        ctx.stroke();

        // Bottom wave section
        ctx.beginPath();
        ctx.rect(wave.x, gapBottomY, WAVE_WIDTH, CANVAS_HEIGHT - gapBottomY);
        ctx.fill();
        ctx.stroke();
      });

      // Draw surfer
      const surferY = surfer.y * CANVAS_HEIGHT;
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏄", SURFER_X, surferY);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // Handle mouse/touch/keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        flap();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        stopFlap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [flap, stopFlap]);

  return (
    <div className="wr-overlay">
      <div className="wr-wrap">
        <div className="wr-content">
          <div className="wr-title">{title ?? "Wave Rider"}</div>
          <div className="wr-subtitle">
            {subtitle ?? "Navigate through the waves!"}
          </div>

          {phase === "intro" && (
            <div className="wr-intro">
              <div className="wr-intro-text">
                Surf through the gaps in the waves! The ocean gets faster as you score more points.
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Hold to rise up
                <br />
                • Release to fall down
                <br />
                • Navigate through the wave gaps
                <br />
                • Don't hit the waves or edges!
              </div>
              <button className="wr-btn primary" onClick={startGame}>
                Start surfing! 🌊
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="wr-playing">
              <div className="wr-hud">
                <div className="wr-score">Score: {score}</div>
              </div>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="wr-canvas"
                onMouseDown={flap}
                onMouseUp={stopFlap}
                onTouchStart={flap}
                onTouchEnd={stopFlap}
              />
              <div className="wr-instructions">
                Hold mouse/tap or press SPACE to rise!
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="wr-complete">
              <div className="wr-final-score">
                Final Score: {score}
              </div>
              <div className="wr-complete-text">
                {score >= 30
                  ? "Legendary! You're a wave master! 🏆"
                  : score >= 20
                  ? "Amazing surfing! The ocean couldn't stop you! 🌊"
                  : score >= 10
                  ? "Great run! You're getting the hang of it! 🏄"
                  : score >= 5
                  ? "Nice try! The waves are tricky! 🌴"
                  : "The ocean is tough, but we had fun! 🐚"}
              </div>
              <button className="wr-btn primary" onClick={onDone}>
                Back to the boat →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
