import { useState, useCallback, useEffect, useRef } from "react";
import "./PerfectMoment.css";

type GamePhase = "intro" | "playing" | "result" | "complete";

// Romantic moments
const MOMENTS = [
  { emoji: "💕", text: "First kiss goodnight" },
  { emoji: "🌅", text: "Watching the sunset together" },
  { emoji: "☕", text: "Morning coffee, side by side" },
  { emoji: "🎵", text: "Our song comes on" },
  { emoji: "✨", text: "That look across the room" },
];

export function PerfectMoment({
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
  const [score, setScore] = useState(0);
  const [momentVisible, setMomentVisible] = useState(false);
  const [captureWindow, setCaptureWindow] = useState(false);
  const [feedback, setFeedback] = useState<"perfect" | "good" | "missed" | null>(null);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const totalRounds = 4;
  const currentMoment = MOMENTS[currentRound % MOMENTS.length];

  // Start a round
  const startRound = useCallback(() => {
    setFeedback(null);
    setMomentVisible(false);
    setCaptureWindow(false);

    // Fade in the moment
    setTimeout(() => {
      setMomentVisible(true);
      startTimeRef.current = Date.now();

      // Open capture window after 1.5s (peak of animation)
      setTimeout(() => {
        setCaptureWindow(true);

        // Close capture window after 1s
        setTimeout(() => {
          setCaptureWindow(false);
          if (feedback === null) {
            // Missed it
            setFeedback("missed");
            setTimeout(nextRound, 1500);
          }
        }, 1000);
      }, 1500);
    }, 500);
  }, [currentRound, feedback]);

  // Handle capture attempt
  const handleCapture = useCallback(() => {
    if (!momentVisible || feedback !== null) return;

    if (captureWindow) {
      // Perfect timing!
      setFeedback("perfect");
      setScore((prev) => prev + 2);
    } else {
      // Okay timing
      setFeedback("good");
      setScore((prev) => prev + 1);
    }

    setTimeout(nextRound, 1500);
  }, [momentVisible, captureWindow, feedback]);

  // Move to next round
  const nextRound = () => {
    if (currentRound + 1 >= totalRounds) {
      setPhase("complete");
    } else {
      setCurrentRound((prev) => prev + 1);
      startRound();
    }
  };

  // Start the game
  const startGame = () => {
    setPhase("playing");
    setCurrentRound(0);
    setScore(0);
    startRound();
  };

  useEffect(() => {
    if (phase === "playing") {
      startRound();
    }
  }, [phase]);

  return (
    <div className="pm-overlay">
      <div className="pm-wrap">
        <div className="pm-content">
          <div className="pm-title">{title ?? "Perfect Moment"}</div>
          <div className="pm-subtitle">
            {subtitle ?? "Capture the feeling at just the right time"}
          </div>

          {phase === "intro" && (
            <div className="pm-intro">
              <div className="pm-intro-text">
                Some moments deserve to be captured. As each memory appears, tap at the perfect time—when it feels just right.
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Wait for the moment to appear
                <br />
                • Tap "Capture" when it feels perfect
                <br />
                • Timing is everything!
              </div>
              <button className="pm-btn primary" onClick={startGame}>
                Begin →
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="pm-playing">
              <div className="pm-score">
                Score: {score}
              </div>

              <div className={`pm-moment-zone ${momentVisible ? "visible" : ""} ${captureWindow ? "peak" : ""}`}>
                {currentMoment && (
                  <>
                    <div className="pm-moment-emoji">{currentMoment.emoji}</div>
                    <div className="pm-moment-text">{currentMoment.text}</div>
                  </>
                )}

                {captureWindow && (
                  <div className="pm-perfect-ring"></div>
                )}
              </div>

              {feedback && (
                <div className={`pm-feedback ${feedback}`}>
                  {feedback === "perfect" ? "Perfect! 💗" : feedback === "good" ? "Nice! ✓" : "Missed..."}
                </div>
              )}

              {!feedback && momentVisible && (
                <button className="pm-capture-btn" onClick={handleCapture}>
                  Capture 📸
                </button>
              )}

              <div className="pm-round-indicator">
                Moment {currentRound + 1} / {totalRounds}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="pm-complete">
              <div className="pm-final-score">
                {score} / {totalRounds * 2} moments captured
              </div>
              <div className="pm-complete-text">
                {score >= totalRounds * 1.5
                  ? "Every moment with you is perfect 💕"
                  : score >= totalRounds
                  ? "We made some beautiful memories together"
                  : "The moments don't need to be perfect to be ours"}
              </div>
              <button className="pm-btn primary" onClick={onDone}>
                Hold these close →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
