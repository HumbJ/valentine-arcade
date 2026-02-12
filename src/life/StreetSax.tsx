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
const AUDIO_OFFSET = 0.1; // Adjust if notes are early (negative) or late (positive)

// Melody chart from Audacity timestamps - manually charted to actual song beats
const MELODY: Array<{ time: number; lane: number }> = [
  { time: 0.317460 + AUDIO_OFFSET, lane: 0 },
  { time: 0.634921 + AUDIO_OFFSET, lane: 1 },
  { time: 0.952381 + AUDIO_OFFSET, lane: 2 },
  { time: 1.360544 + AUDIO_OFFSET, lane: 3 },
  { time: 1.768707 + AUDIO_OFFSET, lane: 1 },
  { time: 4.217687 + AUDIO_OFFSET, lane: 2 },
  { time: 4.489796 + AUDIO_OFFSET, lane: 0 },
  { time: 4.716553 + AUDIO_OFFSET, lane: 3 },
  { time: 7.256236 + AUDIO_OFFSET, lane: 1 },
  { time: 7.437642 + AUDIO_OFFSET, lane: 2 },
  { time: 7.664399 + AUDIO_OFFSET, lane: 0 },
  { time: 9.886621 + AUDIO_OFFSET, lane: 3 },
  { time: 10.113379 + AUDIO_OFFSET, lane: 1 },
  { time: 10.385488 + AUDIO_OFFSET, lane: 2 },
  { time: 10.793651 + AUDIO_OFFSET, lane: 0 },
  { time: 12.653061 + AUDIO_OFFSET, lane: 3 },
  { time: 13.151927 + AUDIO_OFFSET, lane: 1 },
  { time: 13.469388 + AUDIO_OFFSET, lane: 2 },
  { time: 13.741497 + AUDIO_OFFSET, lane: 0 },
  { time: 15.691610 + AUDIO_OFFSET, lane: 3 },
  { time: 16.009070 + AUDIO_OFFSET, lane: 1 },
  { time: 16.371882 + AUDIO_OFFSET, lane: 2 },
  { time: 19.456770 + AUDIO_OFFSET, lane: 0 },
  { time: 19.683527 + AUDIO_OFFSET, lane: 3 },
  { time: 21.815047 + AUDIO_OFFSET, lane: 1 },
  { time: 22.132507 + AUDIO_OFFSET, lane: 2 },
  { time: 22.404616 + AUDIO_OFFSET, lane: 0 },
  { time: 22.540670 + AUDIO_OFFSET, lane: 3 },
  { time: 22.812779 + AUDIO_OFFSET, lane: 1 },
  { time: 25.488516 + AUDIO_OFFSET, lane: 2 },
  { time: 25.669922 + AUDIO_OFFSET, lane: 0 },
  { time: 25.896679 + AUDIO_OFFSET, lane: 3 },
  { time: 28.209604 + AUDIO_OFFSET, lane: 1 },
  { time: 28.527065 + AUDIO_OFFSET, lane: 2 },
  { time: 28.753822 + AUDIO_OFFSET, lane: 0 },
  { time: 28.935228 + AUDIO_OFFSET, lane: 3 },
  { time: 29.434094 + AUDIO_OFFSET, lane: 1 },
  { time: 30.885341 + AUDIO_OFFSET, lane: 2 },
  { time: 31.293505 + AUDIO_OFFSET, lane: 0 },
  { time: 31.565613 + AUDIO_OFFSET, lane: 3 },
  { time: 31.701668 + AUDIO_OFFSET, lane: 1 },
  { time: 34.422756 + AUDIO_OFFSET, lane: 2 },
  { time: 34.604162 + AUDIO_OFFSET, lane: 0 },
  { time: 34.830920 + AUDIO_OFFSET, lane: 3 },
  { time: 36.962439 + AUDIO_OFFSET, lane: 1 },
  { time: 37.370602 + AUDIO_OFFSET, lane: 2 },
  { time: 37.552008 + AUDIO_OFFSET, lane: 0 },
  { time: 37.778765 + AUDIO_OFFSET, lane: 3 },
  { time: 39.510636 + AUDIO_OFFSET, lane: 1 },
  { time: 39.717282 + AUDIO_OFFSET, lane: 2 },
  { time: 40.047914 + AUDIO_OFFSET, lane: 0 },
  { time: 42.610320 + AUDIO_OFFSET, lane: 3 },
  { time: 42.816965 + AUDIO_OFFSET, lane: 1 },
  { time: 43.312915 + AUDIO_OFFSET, lane: 2 },
  { time: 43.478231 + AUDIO_OFFSET, lane: 0 },
  { time: 45.551932 + AUDIO_OFFSET, lane: 3 },
  { time: 46.050798 + AUDIO_OFFSET, lane: 1 },
  { time: 46.322907 + AUDIO_OFFSET, lane: 2 },
  { time: 46.458962 + AUDIO_OFFSET, lane: 0 },
  { time: 46.731070 + AUDIO_OFFSET, lane: 3 },
  { time: 46.803309 + AUDIO_OFFSET, lane: 1 },
  { time: 47.483581 + AUDIO_OFFSET, lane: 2 },
  { time: 49.344661 + AUDIO_OFFSET, lane: 0 },
  { time: 49.526067 + AUDIO_OFFSET, lane: 3 },
  { time: 49.662121 + AUDIO_OFFSET, lane: 1 },
  { time: 49.843527 + AUDIO_OFFSET, lane: 2 },
  { time: 49.934230 + AUDIO_OFFSET, lane: 0 },
  { time: 51.657586 + AUDIO_OFFSET, lane: 3 },
  { time: 51.975046 + AUDIO_OFFSET, lane: 1 },
  { time: 52.156452 + AUDIO_OFFSET, lane: 2 },
  { time: 54.106566 + AUDIO_OFFSET, lane: 0 },
  { time: 54.287971 + AUDIO_OFFSET, lane: 3 },
  { time: 54.832189 + AUDIO_OFFSET, lane: 1 },
  { time: 55.648516 + AUDIO_OFFSET, lane: 2 },
  { time: 55.829922 + AUDIO_OFFSET, lane: 0 },
  { time: 56.328788 + AUDIO_OFFSET, lane: 3 },
  { time: 57.145114 + AUDIO_OFFSET, lane: 1 },
  { time: 57.235817 + AUDIO_OFFSET, lane: 2 },
  { time: 57.371872 + AUDIO_OFFSET, lane: 0 },
  { time: 58.596361 + AUDIO_OFFSET, lane: 3 },
  { time: 58.868470 + AUDIO_OFFSET, lane: 1 },
  { time: 59.095228 + AUDIO_OFFSET, lane: 2 },
  { time: 61.453504 + AUDIO_OFFSET, lane: 0 },
  { time: 61.634910 + AUDIO_OFFSET, lane: 3 },
  { time: 61.861668 + AUDIO_OFFSET, lane: 1 },
  { time: 62.043073 + AUDIO_OFFSET, lane: 2 },
  { time: 63.131509 + AUDIO_OFFSET, lane: 0 },
  { time: 63.267563 + AUDIO_OFFSET, lane: 3 },
  { time: 63.539672 + AUDIO_OFFSET, lane: 1 },
  { time: 65.716543 + AUDIO_OFFSET, lane: 2 },
  { time: 65.988652 + AUDIO_OFFSET, lane: 0 },
  { time: 66.306112 + AUDIO_OFFSET, lane: 3 },
  { time: 66.623572 + AUDIO_OFFSET, lane: 1 },
  { time: 67.031736 + AUDIO_OFFSET, lane: 2 },
  { time: 67.349196 + AUDIO_OFFSET, lane: 0 },
  { time: 67.757359 + AUDIO_OFFSET, lane: 3 },
  { time: 68.528334 + AUDIO_OFFSET, lane: 1 },
  { time: 70.387745 + AUDIO_OFFSET, lane: 2 },
  { time: 70.659853 + AUDIO_OFFSET, lane: 0 },
  { time: 70.977314 + AUDIO_OFFSET, lane: 3 },
  { time: 71.612234 + AUDIO_OFFSET, lane: 1 },
  { time: 72.111101 + AUDIO_OFFSET, lane: 2 },
  { time: 72.700670 + AUDIO_OFFSET, lane: 0 },
  { time: 74.514729 + AUDIO_OFFSET, lane: 3 },
  { time: 76.283436 + AUDIO_OFFSET, lane: 1 },
  { time: 76.555545 + AUDIO_OFFSET, lane: 2 },
  { time: 76.691600 + AUDIO_OFFSET, lane: 0 },
  { time: 78.188198 + AUDIO_OFFSET, lane: 3 },
  { time: 80.727881 + AUDIO_OFFSET, lane: 1 },
  { time: 80.954638 + AUDIO_OFFSET, lane: 2 },
  { time: 81.136044 + AUDIO_OFFSET, lane: 0 },
  { time: 81.544207 + AUDIO_OFFSET, lane: 3 },
  { time: 81.770965 + AUDIO_OFFSET, lane: 1 },
  { time: 81.861668 + AUDIO_OFFSET, lane: 2 },
  { time: 82.133776 + AUDIO_OFFSET, lane: 0 },
  { time: 82.677994 + AUDIO_OFFSET, lane: 3 },
  { time: 82.859400 + AUDIO_OFFSET, lane: 1 },
  { time: 83.358266 + AUDIO_OFFSET, lane: 2 },
  { time: 85.217677 + AUDIO_OFFSET, lane: 0 },
  { time: 85.489785 + AUDIO_OFFSET, lane: 3 },
  { time: 85.625840 + AUDIO_OFFSET, lane: 1 },
  { time: 85.943300 + AUDIO_OFFSET, lane: 2 },
  { time: 86.759627 + AUDIO_OFFSET, lane: 0 },
  { time: 86.941033 + AUDIO_OFFSET, lane: 3 },
  { time: 87.213141 + AUDIO_OFFSET, lane: 1 },
  { time: 87.938765 + AUDIO_OFFSET, lane: 2 },
  { time: 89.662121 + AUDIO_OFFSET, lane: 0 },
  { time: 89.888878 + AUDIO_OFFSET, lane: 3 },
  { time: 90.160987 + AUDIO_OFFSET, lane: 1 },
  { time: 90.705205 + AUDIO_OFFSET, lane: 2 },
  { time: 91.430829 + AUDIO_OFFSET, lane: 0 },
  { time: 91.702937 + AUDIO_OFFSET, lane: 3 },
  { time: 91.838992 + AUDIO_OFFSET, lane: 1 },
  { time: 92.428561 + AUDIO_OFFSET, lane: 2 },
  { time: 93.970511 + AUDIO_OFFSET, lane: 0 },
  { time: 94.242620 + AUDIO_OFFSET, lane: 3 },
  { time: 94.741486 + AUDIO_OFFSET, lane: 1 },
  { time: 96.192733 + AUDIO_OFFSET, lane: 2 },
  { time: 96.782302 + AUDIO_OFFSET, lane: 0 },
  { time: 97.009060 + AUDIO_OFFSET, lane: 3 },
  { time: 97.507926 + AUDIO_OFFSET, lane: 1 },
  { time: 97.734683 + AUDIO_OFFSET, lane: 2 },
  { time: 100.274366 + AUDIO_OFFSET, lane: 0 },
  { time: 100.546475 + AUDIO_OFFSET, lane: 3 },
  { time: 100.773232 + AUDIO_OFFSET, lane: 1 },
  { time: 101.589559 + AUDIO_OFFSET, lane: 2 },
  { time: 102.995454 + AUDIO_OFFSET, lane: 0 },
  { time: 103.403618 + AUDIO_OFFSET, lane: 3 },
  { time: 103.585024 + AUDIO_OFFSET, lane: 1 },
  { time: 103.902484 + AUDIO_OFFSET, lane: 2 },
  { time: 104.310647 + AUDIO_OFFSET, lane: 0 },
  { time: 106.260761 + AUDIO_OFFSET, lane: 3 },
  { time: 106.442166 + AUDIO_OFFSET, lane: 1 },
  { time: 106.623572 + AUDIO_OFFSET, lane: 2 },
  { time: 106.850330 + AUDIO_OFFSET, lane: 0 },
  { time: 108.256225 + AUDIO_OFFSET, lane: 3 },
  { time: 108.891146 + AUDIO_OFFSET, lane: 1 },
  { time: 109.299309 + AUDIO_OFFSET, lane: 2 },
  { time: 109.480715 + AUDIO_OFFSET, lane: 0 },
  { time: 109.798175 + AUDIO_OFFSET, lane: 3 },
  { time: 111.838992 + AUDIO_OFFSET, lane: 1 },
  { time: 112.156452 + AUDIO_OFFSET, lane: 2 },
  { time: 112.428561 + AUDIO_OFFSET, lane: 0 },
  { time: 114.877541 + AUDIO_OFFSET, lane: 3 },
  { time: 115.784570 + AUDIO_OFFSET, lane: 1 },
  { time: 116.328788 + AUDIO_OFFSET, lane: 2 },
  { time: 118.006792 + AUDIO_OFFSET, lane: 0 },
  { time: 118.142847 + AUDIO_OFFSET, lane: 3 },
  { time: 118.324253 + AUDIO_OFFSET, lane: 1 },
  { time: 118.551010 + AUDIO_OFFSET, lane: 2 },
  { time: 118.823119 + AUDIO_OFFSET, lane: 0 },
  { time: 120.365069 + AUDIO_OFFSET, lane: 3 },
  { time: 121.770965 + AUDIO_OFFSET, lane: 1 },
  { time: 122.723346 + AUDIO_OFFSET, lane: 2 },
  { time: 123.902484 + AUDIO_OFFSET, lane: 0 },
  { time: 124.219944 + AUDIO_OFFSET, lane: 3 },
  { time: 124.537405 + AUDIO_OFFSET, lane: 1 },
  { time: 124.764162 + AUDIO_OFFSET, lane: 2 },
  { time: 124.854865 + AUDIO_OFFSET, lane: 0 },
  { time: 126.895681 + AUDIO_OFFSET, lane: 3 },
  { time: 127.303844 + AUDIO_OFFSET, lane: 1 },
  { time: 127.575953 + AUDIO_OFFSET, lane: 2 },
  { time: 127.712008 + AUDIO_OFFSET, lane: 0 },
  { time: 129.798175 + AUDIO_OFFSET, lane: 3 },
  { time: 130.206339 + AUDIO_OFFSET, lane: 1 },
  { time: 130.433096 + AUDIO_OFFSET, lane: 2 },
  { time: 130.750556 + AUDIO_OFFSET, lane: 0 },
  { time: 132.655318 + AUDIO_OFFSET, lane: 3 },
  { time: 133.154185 + AUDIO_OFFSET, lane: 1 },
  { time: 133.471645 + AUDIO_OFFSET, lane: 2 },
  { time: 133.698402 + AUDIO_OFFSET, lane: 0 },
  { time: 135.920624 + AUDIO_OFFSET, lane: 3 },
  { time: 136.238085 + AUDIO_OFFSET, lane: 1 },
  { time: 136.510194 + AUDIO_OFFSET, lane: 2 },
  { time: 136.918357 + AUDIO_OFFSET, lane: 0 },
  { time: 138.777767 + AUDIO_OFFSET, lane: 3 },
  { time: 139.367336 + AUDIO_OFFSET, lane: 1 },
  { time: 139.548742 + AUDIO_OFFSET, lane: 2 },
  { time: 139.684797 + AUDIO_OFFSET, lane: 0 },
  { time: 141.816316 + AUDIO_OFFSET, lane: 3 },
  { time: 142.224479 + AUDIO_OFFSET, lane: 1 },
  { time: 142.405885 + AUDIO_OFFSET, lane: 2 },
  { time: 142.541940 + AUDIO_OFFSET, lane: 0 },
  { time: 142.814049 + AUDIO_OFFSET, lane: 3 },
  { time: 144.537405 + AUDIO_OFFSET, lane: 1 },
  { time: 145.761894 + AUDIO_OFFSET, lane: 2 },
];

const SONG_DURATION = 148; // seconds (~2:28)

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
    audio.volume = 0.15; // Lower volume for better balance
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
        // playTone(lane); // Removed - no sound on note hit
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
