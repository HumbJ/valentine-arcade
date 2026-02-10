import { useState, useEffect, useRef, useCallback } from "react";
import "./WaveRider.css";

type GamePhase = "intro" | "playing" | "complete";

interface Wave {
  id: number;
  x: number; // position from left
  height: number; // 0-1, where 0.5 is middle
  speed: number; // pixels per frame
  width: number; // wave width
}

interface Surfer {
  x: number; // fixed x position
  y: number; // vertical position (0-1, where 0 is top, 1 is bottom)
  velocity: number; // vertical velocity
  isJumping: boolean;
}

const CANVAS_HEIGHT = 400;
const SURFER_X = 150; // Fixed x position for surfer
const GRAVITY = 0.0008;
const JUMP_POWER = -0.025;
const GAME_DURATION = 30000; // 30 seconds
const WAVE_SPAWN_INTERVAL = 1500; // ms between waves

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
  const [combo, setCombo] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const wavesRef = useRef<Wave[]>([]);
  const surferRef = useRef<Surfer>({ x: SURFER_X, y: 0.7, velocity: 0, isJumping: false });
  const nextWaveIdRef = useRef(0);
  const lastWaveSpawnRef = useRef(0);
  const gameStartTimeRef = useRef(0);
  const lastLandingRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setCombo(0);
    setTimeRemaining(GAME_DURATION);
    wavesRef.current = [];
    surferRef.current = { x: SURFER_X, y: 0.7, velocity: 0, isJumping: false };
    nextWaveIdRef.current = 0;
    lastWaveSpawnRef.current = 0;
    gameStartTimeRef.current = Date.now();
    lastLandingRef.current = null;
    isRunningRef.current = true;
  };

  const jump = useCallback(() => {
    if (phase !== "playing") return;
    if (!surferRef.current.isJumping) {
      surferRef.current.velocity = JUMP_POWER;
      surferRef.current.isJumping = true;
    }
  }, [phase]);

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

      // Update timer
      const elapsed = now - gameStartTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        isRunningRef.current = false;
        setPhase("complete");
        return;
      }

      // Spawn new waves
      if (now - lastWaveSpawnRef.current > WAVE_SPAWN_INTERVAL) {
        lastWaveSpawnRef.current = now;
        const wave: Wave = {
          id: nextWaveIdRef.current++,
          x: canvas.width,
          height: 0.3 + Math.random() * 0.4, // Random height between 0.3 and 0.7
          speed: 2 + Math.random() * 1.5, // Random speed
          width: 80 + Math.random() * 40,
        };
        wavesRef.current.push(wave);
      }

      // Update waves
      wavesRef.current = wavesRef.current.filter((wave) => {
        wave.x -= wave.speed;
        return wave.x + wave.width > 0; // Remove waves that are off screen
      });

      // Update surfer physics
      const surfer = surferRef.current;
      surfer.velocity += GRAVITY * deltaTime;
      surfer.y += surfer.velocity * deltaTime;

      // Check for landing on waves
      const landingWave = wavesRef.current.find((wave) => {
        const surferBottom = surfer.y;
        const waveTop = wave.height;
        const isOnWaveX = Math.abs(surfer.x - wave.x) < wave.width / 2;
        const isAtWaveHeight = Math.abs(surferBottom - waveTop) < 0.05;
        return isOnWaveX && isAtWaveHeight && surfer.velocity >= 0;
      });

      if (landingWave && surfer.isJumping) {
        // Successful landing!
        surfer.y = landingWave.height;
        surfer.velocity = 0;
        surfer.isJumping = false;

        // Check if this is a new landing (not the same wave)
        if (lastLandingRef.current !== landingWave.id) {
          lastLandingRef.current = landingWave.id;

          // Award points based on combo
          const points = 10 + combo * 5;
          setScore((s) => s + points);
          setCombo((c) => c + 1);
        }
      }

      // Check for falling in water (below screen)
      if (surfer.y > 1.0) {
        surfer.y = 1.0;
        surfer.velocity = 0;
        surfer.isJumping = false;
        setCombo(0); // Break combo
        lastLandingRef.current = null;
      }

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ocean background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(0.7, "#4A90E2");
      gradient.addColorStop(1, "#2E5C8A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      wavesRef.current.forEach((wave) => {
        const waveY = wave.height * canvas.height;
        const waveX = wave.x;

        ctx.fillStyle = "#3A7BD5";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(waveX - wave.width / 2, waveY);

        // Draw smooth wave curve
        const cp1x = waveX - wave.width / 4;
        const cp1y = waveY - 20;
        const cp2x = waveX + wave.width / 4;
        const cp2y = waveY - 20;
        const endX = waveX + wave.width / 2;
        const endY = waveY;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.lineTo(endX, canvas.height);
        ctx.lineTo(waveX - wave.width / 2, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Draw surfer
      const surferY = surfer.y * canvas.height;
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏄", surfer.x, surferY);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // Handle click/tap to jump
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  return (
    <div className="wr-overlay">
      <div className="wr-wrap">
        <div className="wr-content">
          <div className="wr-title">{title ?? "Wave Rider"}</div>
          <div className="wr-subtitle">
            {subtitle ?? "Ride the waves! Time your jumps perfectly!"}
          </div>

          {phase === "intro" && (
            <div className="wr-intro">
              <div className="wr-intro-text">
                The ocean swells with perfect waves. Jump from wave to wave and keep your combo alive!
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Tap or press SPACE to jump
                <br />
                • Land on wave peaks for points
                <br />
                • Chain landings for combo multipliers
                <br />
                • Don't fall in the water!
              </div>
              <button className="wr-btn primary" onClick={startGame}>
                Catch some waves! 🌊
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="wr-playing">
              <div className="wr-hud">
                <div className="wr-score">Score: {score}</div>
                <div className="wr-combo">
                  {combo > 0 && `🔥 Combo: x${combo}`}
                </div>
                <div className="wr-timer">Time: {Math.ceil(timeRemaining / 1000)}s</div>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={CANVAS_HEIGHT}
                className="wr-canvas"
                onClick={jump}
              />
              <div className="wr-instructions">
                Tap canvas or press SPACE to jump!
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="wr-complete">
              <div className="wr-final-score">
                Final Score: {score}
              </div>
              <div className="wr-complete-text">
                {score >= 200
                  ? "Legendary! You're a true wave master! 🏆"
                  : score >= 150
                  ? "Amazing! Those waves didn't stand a chance! 🌊"
                  : score >= 100
                  ? "Great riding! The ocean is calling you back! 🏄"
                  : score >= 50
                  ? "Nice work! You're getting the hang of it! 🌴"
                  : "The waves are tricky, but we had fun out there! 🐚"}
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
