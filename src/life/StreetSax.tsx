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

// Lofi jazz melody chart - converted from Beat Saber chart at 120 BPM
// Chart synced to actual audio file
const MELODY: Array<{ time: number; lane: number }> = [
  { time: 1.079, lane: 2 },
  { time: 1.160, lane: 1 },
  { time: 2.300, lane: 0 },
  { time: 2.300, lane: 3 },
  { time: 4.870, lane: 1 },
  { time: 4.870, lane: 2 },
  { time: 5.200, lane: 1 },
  { time: 5.200, lane: 2 },
  { time: 8.099, lane: 0 },
  { time: 8.099, lane: 3 },
  { time: 9.370, lane: 1 },
  { time: 9.370, lane: 2 },
  { time: 10.880, lane: 1 },
  { time: 10.880, lane: 2 },
  { time: 13.590, lane: 0 },
  { time: 13.590, lane: 3 },
  { time: 15.379, lane: 1 },
  { time: 15.379, lane: 2 },
  { time: 16.590, lane: 0 },
  { time: 16.879, lane: 3 },
  { time: 18.379, lane: 2 },
  { time: 18.379, lane: 0 },
  { time: 20.230, lane: 1 },
  { time: 20.230, lane: 2 },
  { time: 21.379, lane: 1 },
  { time: 21.379, lane: 2 },
  { time: 23.610, lane: 0 },
  { time: 23.610, lane: 2 },
  { time: 25.879, lane: 0 },
  { time: 25.879, lane: 1 },
  { time: 29.114, lane: 0 },
  { time: 29.114, lane: 1 },
  { time: 31.181, lane: 1 },
  { time: 31.181, lane: 2 },
  { time: 33.130, lane: 1 },
  { time: 33.130, lane: 2 },
  { time: 36.660, lane: 2 },
  { time: 37.199, lane: 1 },
  { time: 38.379, lane: 2 },
  { time: 38.379, lane: 3 },
  { time: 40.100, lane: 0 },
  { time: 40.100, lane: 1 },
  { time: 42.379, lane: 3 },
  { time: 43.660, lane: 0 },
  { time: 45.380, lane: 1 },
  { time: 45.380, lane: 2 },
  { time: 47.619, lane: 0 },
  { time: 47.619, lane: 3 },
  { time: 48.879, lane: 0 },
  { time: 48.879, lane: 1 },
  { time: 51.379, lane: 0 },
  { time: 51.379, lane: 3 },
  { time: 54.370, lane: 1 },
  { time: 54.370, lane: 2 },
  { time: 58.879, lane: 1 },
  { time: 58.879, lane: 2 },
  { time: 60.760, lane: 0 },
  { time: 60.760, lane: 3 },
  { time: 62.761, lane: 1 },
  { time: 62.761, lane: 2 },
  { time: 66.739, lane: 1 },
  { time: 66.739, lane: 2 },
  { time: 69.759, lane: 2 },
  { time: 69.759, lane: 3 },
  { time: 71.261, lane: 0 },
  { time: 72.759, lane: 1 },
  { time: 75.240, lane: 0 },
  { time: 75.240, lane: 1 },
  { time: 76.680, lane: 2 },
  { time: 76.680, lane: 3 },
  { time: 78.741, lane: 1 },
  { time: 78.741, lane: 2 },
  { time: 80.258, lane: 1 },
  { time: 80.258, lane: 2 },
  { time: 81.200, lane: 1 },
  { time: 81.739, lane: 2 },
  { time: 84.741, lane: 3 },
  { time: 87.262, lane: 1 },
  { time: 88.321, lane: 0 },
  { time: 90.759, lane: 2 },
  { time: 90.759, lane: 3 },
  { time: 93.760, lane: 1 },
  { time: 93.760, lane: 2 },
  { time: 95.239, lane: 0 },
  { time: 95.239, lane: 3 },
  { time: 97.760, lane: 0 },
  { time: 97.760, lane: 2 },
  { time: 102.739, lane: 0 },
  { time: 102.739, lane: 3 },
  { time: 150.759, lane: 1 },
  { time: 150.759, lane: 2 },
  { time: 157.782, lane: 0 },
  { time: 157.782, lane: 3 },
  { time: 168.760, lane: 1 },
  { time: 168.760, lane: 2 },
  { time: 174.759, lane: 1 },
  { time: 174.759, lane: 2 },
  { time: 177.762, lane: 1 },
  { time: 177.762, lane: 2 },
  { time: 186.761, lane: 0 },
  { time: 186.761, lane: 3 },
  { time: 189.741, lane: 0 },
  { time: 189.741, lane: 1 },
  { time: 190.722, lane: 1 },
  { time: 190.722, lane: 2 },
  { time: 192.759, lane: 3 },
  { time: 193.799, lane: 1 },
  { time: 193.799, lane: 2 },
  { time: 195.121, lane: 2 },
  { time: 195.121, lane: 3 },
  { time: 195.738, lane: 0 },
  { time: 195.738, lane: 1 },
  { time: 198.761, lane: 3 },
  { time: 201.759, lane: 0 },
  { time: 207.759, lane: 1 },
  { time: 207.759, lane: 2 },
  { time: 213.739, lane: 2 },
  { time: 213.739, lane: 3 },
  { time: 214.760, lane: 0 },
  { time: 214.760, lane: 1 },
  { time: 216.759, lane: 3 },
  { time: 220.258, lane: 0 },
  { time: 220.258, lane: 1 },
  { time: 225.199, lane: 1 },
  { time: 225.199, lane: 2 },
  { time: 231.761, lane: 3 },
  { time: 232.721, lane: 2 },
  { time: 233.320, lane: 1 },
  { time: 234.759, lane: 0 },
  { time: 237.281, lane: 2 },
  { time: 237.758, lane: 3 },
  { time: 238.721, lane: 1 },
  { time: 239.358, lane: 2 },
  { time: 240.760, lane: 0 },
  { time: 240.760, lane: 1 },
  { time: 243.759, lane: 2 },
  { time: 243.759, lane: 3 },
  { time: 244.299, lane: 0 },
  { time: 244.299, lane: 1 },
  { time: 246.760, lane: 0 },
  { time: 246.760, lane: 1 },
  { time: 249.280, lane: 1 },
  { time: 249.280, lane: 3 },
  { time: 250.318, lane: 3 },
  { time: 250.739, lane: 2 },
  { time: 252.278, lane: 3 },
  { time: 252.758, lane: 2 },
  { time: 255.339, lane: 3 },
  { time: 255.760, lane: 2 },
  { time: 256.321, lane: 1 },
  { time: 256.321, lane: 3 },
  { time: 258.741, lane: 0 },
  { time: 258.741, lane: 1 },
  { time: 261.080, lane: 1 },
  { time: 261.080, lane: 2 },
  { time: 261.760, lane: 3 },
  { time: 262.220, lane: 2 },
  { time: 264.762, lane: 0 },
  { time: 264.762, lane: 1 },
  { time: 267.178, lane: 3 },
  { time: 267.761, lane: 2 },
  { time: 269.219, lane: 0 },
  { time: 269.219, lane: 1 },
  { time: 270.759, lane: 0 },
  { time: 270.759, lane: 2 },
  { time: 273.759, lane: 3 },
  { time: 275.258, lane: 0 },
  { time: 279.220, lane: 1 },
  { time: 279.220, lane: 2 },
  { time: 280.180, lane: 2 },
  { time: 280.180, lane: 3 },
  { time: 282.760, lane: 0 },
  { time: 285.259, lane: 3 },
  { time: 286.261, lane: 1 },
  { time: 286.261, lane: 2 },
  { time: 289.760, lane: 0 },
  { time: 289.760, lane: 1 },
  { time: 291.740, lane: 0 },
  { time: 291.740, lane: 3 },
];

const SONG_DURATION = 146; // seconds (~2:26)

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
