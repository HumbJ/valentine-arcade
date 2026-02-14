import { useState, useCallback } from "react";
import "./CanyonEcho.css";

// Rhythm patterns - each pattern is a sequence of timing offsets (in ms)
const PATTERNS = [
  [0, 400, 800],           // Simple 3-beat
  [0, 300, 600, 900],      // 4-beat even
  [0, 200, 600, 800],      // Syncopated
  [0, 400, 500, 900, 1000], // Complex
];

type GamePhase = "intro" | "listen" | "repeat" | "result" | "complete";

// Create a simple beep sound using Web Audio API
function playBeep(frequency: number = 440, duration: number = 150) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (err) {
    console.warn("Audio playback failed:", err);
  }
}

export function CanyonEcho({
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
  const [pattern, setPattern] = useState<number[]>([]);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [playerTaps, setPlayerTaps] = useState<number[]>([]);
  const [tapStartTime, setTapStartTime] = useState(0);
  const [roundResult, setRoundResult] = useState<"success" | "fail" | null>(null);
  const [score, setScore] = useState(0);

  const totalRounds = 3;

  // Start a round
  const startListenPhase = useCallback(() => {
    const newPattern = PATTERNS[currentRound % PATTERNS.length];
    setPattern(newPattern);
    setPhase("listen");
    setPlayingIndex(-1);
    setPlayerTaps([]);
    setRoundResult(null);

    // Play the pattern with sound
    newPattern.forEach((time, index) => {
      setTimeout(() => {
        setPlayingIndex(index);
        playBeep(440, 150); // Play beep sound
        // Visual flash
        setTimeout(() => setPlayingIndex(-1), 150);
      }, time + 500); // 500ms delay before starting
    });

    // After pattern completes, switch to repeat phase
    const patternDuration = Math.max(...newPattern) + 1000;
    setTimeout(() => {
      setPhase("repeat");
      setTapStartTime(Date.now());
    }, patternDuration);
  }, [currentRound]);

  // Handle player tap
  const handleTap = useCallback(() => {
    if (phase !== "repeat") return;

    const tapTime = Date.now() - tapStartTime;
    setPlayerTaps((prev) => [...prev, tapTime]);
    playBeep(440, 100); // Play feedback sound

    // Check if player has tapped enough times
    if (playerTaps.length + 1 >= pattern.length) {
      // Evaluate after a short delay
      setTimeout(() => {
        evaluatePattern([...playerTaps, tapTime]);
      }, 300);
    }
  }, [phase, tapStartTime, playerTaps, pattern]);

  // Evaluate the player's taps against the pattern
  const evaluatePattern = (taps: number[]) => {
    // Check timing accuracy with generous tolerance
    const tolerance = 400; // 400ms tolerance
    let correct = 0;

    pattern.forEach((targetTime, index) => {
      const playerTime = taps[index];
      if (playerTime !== undefined) {
        const diff = Math.abs(targetTime - playerTime);
        if (diff <= tolerance) {
          correct++;
        }
      }
    });

    const accuracy = correct / pattern.length;
    // More forgiving: need at least 40% accuracy (e.g., 2 out of 5 beats)
    const success = accuracy >= 0.4;

    setRoundResult(success ? "success" : "fail");
    if (success) {
      setScore((prev) => prev + 1);
    }
    setPhase("result");
  };

  // Move to next round or complete
  const nextRound = () => {
    if (currentRound + 1 >= totalRounds) {
      setPhase("complete");
    } else {
      setCurrentRound((prev) => prev + 1);
      startListenPhase();
    }
  };

  // Start the game
  const startGame = () => {
    startListenPhase();
  };

  return (
    <div className="ce-overlay">
      <div className="ce-wrap">
        {/* Canyon background effect */}
        <div className="ce-canyon">
          <div className="ce-canyon-wall left" />
          <div className="ce-canyon-wall right" />
        </div>

        <div className="ce-content">
          <div className="ce-title">{title ?? "Canyon Echo"}</div>
          <div className="ce-subtitle">
            {subtitle ?? "Listen to the mountains, then tap the rhythm back"}
          </div>

          {phase === "intro" && (
            <div className="ce-intro">
              <div className="ce-intro-text">
                The canyon walls carry sound in mysterious ways.
                <br /><br />
                <strong>How to play:</strong>
                <br />
                1. Listen to the beep pattern
                <br />
                2. Tap the TAP button to match the rhythm
                <br />
                3. Match the timing as closely as you can!
              </div>
              <button className="ce-btn" onClick={startGame}>
                Listen to the canyon →
              </button>
            </div>
          )}

          {phase === "listen" && (
            <div className="ce-listen">
              <div className="ce-phase-label">Listen...</div>
              <div className={`ce-echo-circle ${playingIndex >= 0 ? "pulse" : ""}`}>
                <span className="ce-echo-icon">🏔️</span>
              </div>
              <div className="ce-beats">
                {pattern.map((_, i) => (
                  <div
                    key={i}
                    className={`ce-beat ${playingIndex === i ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === "repeat" && (
            <div className="ce-repeat">
              <div className="ce-phase-label">Your turn!</div>
              <button
                className="ce-tap-zone"
                onClick={handleTap}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTap();
                }}
              >
                <span className="ce-tap-text">TAP</span>
              </button>
              <div className="ce-beats">
                {pattern.map((_, i) => (
                  <div
                    key={i}
                    className={`ce-beat ${i < playerTaps.length ? "player" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === "result" && (
            <div className="ce-result">
              <div className={`ce-result-icon ${roundResult}`}>
                {roundResult === "success" ? "✓" : "✗"}
              </div>
              <div className="ce-result-text">
                {roundResult === "success"
                  ? "The echo returns perfectly!"
                  : "The canyon swallows the sound..."}
              </div>
              <button className="ce-btn" onClick={nextRound}>
                {currentRound + 1 >= totalRounds ? "Finish" : "Next echo →"}
              </button>
            </div>
          )}

          {phase === "complete" && (
            <div className="ce-complete">
              <div className="ce-score">
                {score} / {totalRounds} echoes returned
              </div>
              <div className="ce-complete-text">
                {score >= 2
                  ? "The canyon remembers your voice"
                  : "The mountains keep their secrets... for now"}
              </div>
              <button className="ce-btn primary" onClick={onDone}>
                Continue through the canyon →
              </button>
            </div>
          )}

          {(phase === "listen" || phase === "repeat" || phase === "result") && (
            <div className="ce-round-indicator">
              Round {currentRound + 1} / {totalRounds}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
