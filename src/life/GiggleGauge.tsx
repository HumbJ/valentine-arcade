import { useState, useCallback, useEffect, useRef } from "react";
import "./GiggleGauge.css";

type GamePhase = "intro" | "playing" | "result" | "complete";

// Comedy moments
const JOKES = [
  { setup: "That perfectly timed callback...", punchline: "💥" },
  { setup: "When the punchline hits just right...", punchline: "🎯" },
  { setup: "The awkward pause before the laugh...", punchline: "😂" },
  { setup: "Inside joke only we get...", punchline: "🤭" },
  { setup: "Laughing so hard we can't breathe...", punchline: "😆" },
];

export function GiggleGauge({
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
  const [gaugePosition, setGaugePosition] = useState(0);
  const [gaugeDirection, setGaugeDirection] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<"perfect" | "good" | "missed" | null>(null);

  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(1.5);

  const totalRounds = 5;
  const currentJoke = JOKES[currentRound % JOKES.length];

  // Animate the gauge
  const animateGauge = useCallback(() => {
    if (!isActive) return;

    setGaugePosition((prev) => {
      let next = prev + speedRef.current * gaugeDirection;

      // Bounce at edges
      if (next >= 100) {
        next = 100;
        setGaugeDirection(-1);
      } else if (next <= 0) {
        next = 0;
        setGaugeDirection(1);
      }

      return next;
    });

    animationRef.current = requestAnimationFrame(animateGauge);
  }, [isActive, gaugeDirection]);

  // Start animation
  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animateGauge);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animateGauge]);

  // Start a round
  const startRound = useCallback(() => {
    setFeedback(null);
    setGaugePosition(50);
    setGaugeDirection(1);
    speedRef.current = 1.5 + currentRound * 0.3; // Get faster each round

    setTimeout(() => {
      setIsActive(true);
    }, 800);
  }, [currentRound]);

  // Handle laugh button click
  const handleLaugh = useCallback(() => {
    if (!isActive || feedback !== null) return;

    setIsActive(false);

    // Check if in sweet spot (40-60)
    const inPerfectZone = gaugePosition >= 45 && gaugePosition <= 55;
    const inGoodZone = gaugePosition >= 35 && gaugePosition <= 65;

    if (inPerfectZone) {
      setFeedback("perfect");
      setScore((prev) => prev + 3);
    } else if (inGoodZone) {
      setFeedback("good");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("missed");
    }

    setTimeout(nextRound, 1800);
  }, [isActive, gaugePosition, feedback]);

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

  // Determine zone color based on position
  const getIndicatorColor = () => {
    if (gaugePosition >= 45 && gaugePosition <= 55) return "perfect";
    if (gaugePosition >= 35 && gaugePosition <= 65) return "good";
    return "normal";
  };

  return (
    <div className="gg-overlay">
      <div className="gg-wrap">
        <div className="gg-content">
          <div className="gg-title">{title ?? "Giggle Gauge"}</div>
          <div className="gg-subtitle">
            {subtitle ?? "Nail the timing for maximum laughs!"}
          </div>

          {phase === "intro" && (
            <div className="gg-intro">
              <div className="gg-intro-text">
                Comedy is all about timing. Watch the giggle meter bounce, and hit the laugh button when it's in the sweet spot!
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Watch the meter move
                <br />
                • Tap "LAUGH!" when it's in the center
                <br />
                • Perfect timing = perfect comedy!
              </div>
              <button className="gg-btn primary" onClick={startGame}>
                Let's get laughing! 😂
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="gg-playing">
              <div className="gg-score">
                Laughs: {score}
              </div>

              <div className="gg-joke-setup">{currentJoke.setup}</div>

              <div className="gg-gauge-container">
                <div className="gg-gauge-track">
                  {/* Sweet spot zone */}
                  <div className="gg-sweet-zone"></div>
                  <div className="gg-good-zone-left"></div>
                  <div className="gg-good-zone-right"></div>

                  {/* Moving indicator */}
                  <div
                    className={`gg-indicator ${getIndicatorColor()}`}
                    style={{ left: `${gaugePosition}%` }}
                  >
                    {currentJoke.punchline}
                  </div>
                </div>
              </div>

              {feedback && (
                <div className={`gg-feedback ${feedback}`}>
                  {feedback === "perfect" ? "PERFECT TIMING! 🎯" : feedback === "good" ? "Nice! 😄" : "Off timing..."}
                </div>
              )}

              {!feedback && isActive && (
                <button className="gg-laugh-btn" onClick={handleLaugh}>
                  LAUGH! 😂
                </button>
              )}

              <div className="gg-round-indicator">
                Joke {currentRound + 1} / {totalRounds}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="gg-complete">
              <div className="gg-final-score">
                {score} / {totalRounds * 3} laughs nailed!
              </div>
              <div className="gg-complete-text">
                {score >= totalRounds * 2
                  ? "You've got comedic timing down! 🎭"
                  : score >= totalRounds
                  ? "Not bad! We still had fun 😊"
                  : "Laughter is what matters, not the timing!"}
              </div>
              <button className="gg-btn primary" onClick={onDone}>
                That was fun! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
