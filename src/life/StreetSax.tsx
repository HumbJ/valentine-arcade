import { useEffect, useRef, useState, useCallback } from "react";
import "./StreetSax.css";

interface StreetSaxProps {
  title?: string;
  subtitle?: string;
  onDone: (score?: number) => void;
}

interface Note {
  id: number;
  lane: number; // 0-3
  time: number; // Time in seconds when note should be hit
  y: number; // Current y position (0 = top, 1 = bottom)
  hit: boolean;
}

interface HitResult {
  id: number;
  accuracy: "perfect" | "good" | "miss";
  x: number;
  y: number;
  opacity: number;
}

const LANES = 4;
const NOTE_SPEED = 0.35; // How fast notes fall (fraction of screen per second)
const HIT_ZONE = 0.9; // Y position of hit line (0-1)
const PERFECT_WINDOW = 0.05; // ±5% of screen height for perfect hit
const GOOD_WINDOW = 0.1; // ±10% of screen height for good hit
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

// Lofi jazz melody chart - charted for ~60 seconds at 85 BPM
// Lanes represent different note pitches
const MELODY: Array<{ time: number; lane: number }> = [
  // Intro section (0-8s) - gentle start
  { time: 1.4, lane: 1 },
  { time: 2.1, lane: 2 },
  { time: 2.8, lane: 1 },
  { time: 3.5, lane: 0 },
  { time: 4.2, lane: 2 },
  { time: 4.9, lane: 3 },
  { time: 5.6, lane: 2 },
  { time: 6.3, lane: 1 },
  { time: 7.0, lane: 2 },
  { time: 7.7, lane: 1 },

  // First phrase (8-16s) - melody emerges
  { time: 8.4, lane: 1 },
  { time: 8.7, lane: 1 },
  { time: 9.1, lane: 2 },
  { time: 9.8, lane: 3 },
  { time: 10.5, lane: 2 },
  { time: 11.2, lane: 1 },
  { time: 11.9, lane: 0 },
  { time: 12.6, lane: 1 },
  { time: 13.3, lane: 2 },
  { time: 14.0, lane: 3 },
  { time: 14.7, lane: 2 },
  { time: 15.4, lane: 1 },

  // Second phrase (16-24s) - variation
  { time: 16.1, lane: 0 },
  { time: 16.8, lane: 1 },
  { time: 17.5, lane: 2 },
  { time: 18.2, lane: 3 },
  { time: 18.6, lane: 3 },
  { time: 18.9, lane: 2 },
  { time: 19.6, lane: 1 },
  { time: 20.3, lane: 2 },
  { time: 21.0, lane: 3 },
  { time: 21.7, lane: 2 },
  { time: 22.4, lane: 1 },
  { time: 23.1, lane: 0 },

  // Bridge (24-32s) - rhythmic section
  { time: 24.0, lane: 1 },
  { time: 24.35, lane: 2 },
  { time: 24.7, lane: 1 },
  { time: 25.4, lane: 0 },
  { time: 26.1, lane: 1 },
  { time: 26.8, lane: 2 },
  { time: 27.5, lane: 3 },
  { time: 28.2, lane: 2 },
  { time: 28.9, lane: 1 },
  { time: 29.6, lane: 2 },
  { time: 30.3, lane: 3 },
  { time: 31.0, lane: 2 },
  { time: 31.7, lane: 1 },

  // Third phrase (32-40s) - development
  { time: 32.4, lane: 0 },
  { time: 33.1, lane: 1 },
  { time: 33.8, lane: 2 },
  { time: 34.5, lane: 3 },
  { time: 35.2, lane: 2 },
  { time: 35.9, lane: 1 },
  { time: 36.6, lane: 2 },
  { time: 37.3, lane: 3 },
  { time: 38.0, lane: 2 },
  { time: 38.7, lane: 1 },
  { time: 39.4, lane: 0 },

  // Fourth phrase (40-48s) - climax building
  { time: 40.1, lane: 1 },
  { time: 40.5, lane: 2 },
  { time: 40.8, lane: 1 },
  { time: 41.5, lane: 2 },
  { time: 42.2, lane: 3 },
  { time: 42.9, lane: 2 },
  { time: 43.6, lane: 1 },
  { time: 44.3, lane: 0 },
  { time: 45.0, lane: 1 },
  { time: 45.7, lane: 2 },
  { time: 46.4, lane: 3 },
  { time: 47.1, lane: 2 },

  // Final section (48-60s) - wind down
  { time: 48.0, lane: 1 },
  { time: 48.7, lane: 2 },
  { time: 49.4, lane: 1 },
  { time: 50.1, lane: 0 },
  { time: 50.8, lane: 1 },
  { time: 51.5, lane: 2 },
  { time: 52.2, lane: 3 },
  { time: 52.9, lane: 2 },
  { time: 53.6, lane: 1 },
  { time: 54.3, lane: 0 },
  { time: 55.0, lane: 1 },
  { time: 55.7, lane: 2 },
  { time: 56.4, lane: 1 },
  { time: 57.1, lane: 0 },
  { time: 57.8, lane: 1 },
  { time: 58.5, lane: 2 },
];

const SONG_DURATION = 60; // seconds

// Note frequencies for each lane (saxophone-ish range)
const LANE_FREQUENCIES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
];

export function StreetSax({
  title = "Street Saxophone",
  subtitle,
  onDone,
}: StreetSaxProps) {
  const [phase, setPhase] = useState<"intro" | "countdown" | "playing" | "complete">("intro");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [accuracy, setAccuracy] = useState({ perfect: 0, good: 0, miss: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isRunningRef = useRef(false);
  const notesRef = useRef<Note[]>([]);
  const nextNoteIdRef = useRef(0);
  const spawnedIndicesRef = useRef(new Set<number>());
  const startTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const accuracyRef = useRef({ perfect: 0, good: 0, miss: 0 });
  const hitResultsRef = useRef<HitResult[]>([]);

  // Play a tone for a lane
  const playTone = useCallback((lane: number, duration: number = 0.2) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = LANE_FREQUENCIES[lane];
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  // Load and play the actual audio track
  const playBackgroundMusic = useCallback(() => {
    // Create audio element
    const audio = new Audio();
    audio.src = new URL(
      "../assets/audio/lofi_music_library-lofi-cafe-lofi-music-ambient-jazz-461870.mp3",
      import.meta.url
    ).href;
    audio.volume = 0.5;
    audio.currentTime = 0;

    audioElementRef.current = audio;

    // Play the audio
    audio.play().catch((err) => {
      console.error("Failed to play audio:", err);
    });
  }, []);

  const startGame = useCallback(() => {
    setPhase("countdown");
    setCountdown(3);

    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Countdown 3, 2, 1
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPhase("playing");
          startTimeRef.current = Date.now();
          isRunningRef.current = true;
          spawnedIndicesRef.current.clear();
          notesRef.current = [];
          scoreRef.current = 0;
          comboRef.current = 0;
          accuracyRef.current = { perfect: 0, good: 0, miss: 0 };
          setScore(0);
          setCombo(0);
          setAccuracy({ perfect: 0, good: 0, miss: 0 });

          // Start background music
          playBackgroundMusic();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [playBackgroundMusic]);

  // Handle key presses
  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunningRef.current) return;

      let lane = -1;
      if (e.key === "1" || e.key === "a" || e.key === "A") lane = 0;
      else if (e.key === "2" || e.key === "s" || e.key === "S") lane = 1;
      else if (e.key === "3" || e.key === "d" || e.key === "D") lane = 2;
      else if (e.key === "4" || e.key === "f" || e.key === "F") lane = 3;

      if (lane === -1) return;

      // Find closest unhit note in this lane
      const laneNotes = notesRef.current
        .filter((n) => n.lane === lane && !n.hit)
        .sort((a, b) => Math.abs(a.y - HIT_ZONE) - Math.abs(b.y - HIT_ZONE));

      if (laneNotes.length === 0) return;

      const note = laneNotes[0];
      const distance = Math.abs(note.y - HIT_ZONE);

      let accuracy: "perfect" | "good" | "miss" = "miss";
      let points = 0;

      if (distance < PERFECT_WINDOW) {
        accuracy = "perfect";
        points = 100;
        comboRef.current += 1;
        accuracyRef.current.perfect += 1;
      } else if (distance < GOOD_WINDOW) {
        accuracy = "good";
        points = 50;
        comboRef.current += 1;
        accuracyRef.current.good += 1;
      } else {
        accuracy = "miss";
        comboRef.current = 0;
        accuracyRef.current.miss += 1;
      }

      if (accuracy !== "miss") {
        note.hit = true;
        playTone(lane);
        scoreRef.current += points * (1 + comboRef.current * 0.1);
        setScore(Math.floor(scoreRef.current));
        setCombo(comboRef.current);
        setAccuracy({ ...accuracyRef.current });

        // Add hit result for visual feedback
        hitResultsRef.current.push({
          id: Date.now(),
          accuracy,
          x: lane,
          y: note.y,
          opacity: 1,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, playTone]);

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

      // Spawn notes based on melody chart
      MELODY.forEach((noteData, index) => {
        if (spawnedIndicesRef.current.has(index)) return;

        // Spawn note early so it has time to reach the hit zone
        const spawnTime = noteData.time - (1 / NOTE_SPEED);
        if (gameTime >= spawnTime) {
          notesRef.current.push({
            id: nextNoteIdRef.current++,
            lane: noteData.lane,
            time: noteData.time,
            y: 0,
            hit: false,
          });
          spawnedIndicesRef.current.add(index);
        }
      });

      // Update note positions
      notesRef.current = notesRef.current.map((note) => ({
        ...note,
        y: note.y + NOTE_SPEED * deltaTime,
      }));

      // Remove notes that went past the screen
      notesRef.current = notesRef.current.filter((note) => {
        if (note.y > 1.1 && !note.hit) {
          // Missed note
          comboRef.current = 0;
          accuracyRef.current.miss += 1;
          setCombo(0);
          setAccuracy({ ...accuracyRef.current });
          return false;
        }
        return note.y <= 1.1;
      });

      // Update hit results
      hitResultsRef.current = hitResultsRef.current
        .map((result) => ({
          ...result,
          opacity: result.opacity - deltaTime * 2,
        }))
        .filter((result) => result.opacity > 0);

      // Check if song is over
      if (gameTime >= SONG_DURATION + 2 && notesRef.current.length === 0) {
        isRunningRef.current = false;
        // Stop background music
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.currentTime = 0;
        }
        setPhase("complete");
        return;
      }

      // Draw everything
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw lane dividers
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      const laneWidth = CANVAS_WIDTH / LANES;
      for (let i = 1; i < LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // Draw hit zone line
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, HIT_ZONE * CANVAS_HEIGHT);
      ctx.lineTo(CANVAS_WIDTH, HIT_ZONE * CANVAS_HEIGHT);
      ctx.stroke();

      // Draw notes
      notesRef.current.forEach((note) => {
        if (note.hit) return;

        const x = note.lane * laneWidth + laneWidth / 2;
        const y = note.y * CANVAS_HEIGHT;
        const size = 30;

        ctx.fillStyle = "#00D9FF";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Draw hit results
      hitResultsRef.current.forEach((result) => {
        const x = result.x * laneWidth + laneWidth / 2;
        const y = result.y * CANVAS_HEIGHT;

        ctx.save();
        ctx.globalAlpha = result.opacity;
        ctx.fillStyle =
          result.accuracy === "perfect"
            ? "#FFD700"
            : result.accuracy === "good"
            ? "#00FF00"
            : "#FF0000";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(result.accuracy.toUpperCase(), x, y - 20);
        ctx.restore();
      });

      // Draw combo
      if (comboRef.current > 0) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 30px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${comboRef.current}x COMBO`, CANVAS_WIDTH / 2, 50);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      // Stop background music on cleanup
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      }
    };
  }, [phase]);

  return (
    <div className="streetsax-wrapper">
      <div className="streetsax-container">
        <div className="streetsax-header">
          <h2 className="streetsax-title">{title}</h2>
          {subtitle && <p className="streetsax-subtitle">{subtitle}</p>}
        </div>

        <div className="streetsax-content">
          {phase === "intro" && (
            <div className="streetsax-intro">
              <p className="streetsax-instructions">
                🎷 Feel the rhythm of the city streets!
              </p>
              <p className="streetsax-instructions">
                Hit notes to the beat of the jazz music
              </p>
              <p className="streetsax-instructions">
                Press keys when notes hit the golden line
              </p>
              <div className="streetsax-keys">
                <div className="streetsax-key">1 / A</div>
                <div className="streetsax-key">2 / S</div>
                <div className="streetsax-key">3 / D</div>
                <div className="streetsax-key">4 / F</div>
              </div>
              <button className="streetsax-btn primary" onClick={startGame}>
                Start Playing! 🎵
              </button>
            </div>
          )}

          {phase === "countdown" && (
            <div className="streetsax-countdown">
              <div className="streetsax-countdown-number">{countdown}</div>
            </div>
          )}

          {phase === "playing" && (
            <div className="streetsax-game">
              <div className="streetsax-stats">
                <div className="streetsax-stat">Score: {score}</div>
                <div className="streetsax-stat">Combo: {combo}x</div>
              </div>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="streetsax-canvas"
              />
              <div className="streetsax-accuracy">
                <span>Perfect: {accuracy.perfect}</span>
                <span>Good: {accuracy.good}</span>
                <span>Miss: {accuracy.miss}</span>
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="streetsax-complete">
              <div className="streetsax-final-score">Final Score: {score}</div>
              <div className="streetsax-final-accuracy">
                <div>✨ Perfect: {accuracy.perfect}</div>
                <div>👍 Good: {accuracy.good}</div>
                <div>❌ Miss: {accuracy.miss}</div>
              </div>
              <div className="streetsax-complete-text">
                {accuracy.miss === 0
                  ? "Perfect Performance! You're a street legend! 🎷✨"
                  : score >= 3000
                  ? "Amazing rhythm! The crowd loved it! 🎵"
                  : score >= 2000
                  ? "Great performance! Keep grooving! 🎶"
                  : score >= 1000
                  ? "Nice job! You're finding your rhythm! 🎼"
                  : "Keep practicing! The streets await! 🎺"}
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="streetsax-btn primary" onClick={startGame}>
                  Play again 🎷
                </button>
                <button
                  className="streetsax-btn primary"
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
