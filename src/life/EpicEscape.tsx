import { useState, useCallback, useEffect } from "react";
import "./EpicEscape.css";

type GamePhase = "intro" | "playing" | "result" | "complete";

// Quick time events
const QTE_PROMPTS = [
  { action: "JUMP!", emoji: "🦘", duration: 2500 },
  { action: "DODGE!", emoji: "💨", duration: 2200 },
  { action: "CLIMB!", emoji: "🧗", duration: 2400 },
  { action: "RUN!", emoji: "🏃", duration: 2000 },
  { action: "DIVE!", emoji: "🤿", duration: 2300 },
  { action: "SWING!", emoji: "🎢", duration: 2200 },
];

export function EpicEscape({
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
  const [showPrompt, setShowPrompt] = useState(false);
  const [responded, setResponded] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "fail" | null>(null);

  const totalRounds = 6;
  const currentQTE = QTE_PROMPTS[currentRound % QTE_PROMPTS.length];

  // Start a round
  const startRound = useCallback(() => {
    setFeedback(null);
    setShowPrompt(false);
    setResponded(false);

    // Show prompt after delay
    setTimeout(() => {
      setShowPrompt(true);

      // Auto-fail after duration if no response
      setTimeout(() => {
        if (!responded) {
          setFeedback("fail");
          setTimeout(nextRound, 1500);
        }
      }, currentQTE.duration);
    }, 1000);
  }, [currentRound, responded, currentQTE]);

  // Handle action button click
  const handleAction = useCallback(() => {
    if (!showPrompt || responded) return;

    setResponded(true);
    setFeedback("success");
    setScore((prev) => prev + 1);

    setTimeout(nextRound, 1200);
  }, [showPrompt, responded]);

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
    <div className="ee-overlay">
      <div className="ee-wrap">
        <div className="ee-content">
          <div className="ee-title">{title ?? "Epic Escape"}</div>
          <div className="ee-subtitle">
            {subtitle ?? "React fast or get left behind!"}
          </div>

          {phase === "intro" && (
            <div className="ee-intro">
              <div className="ee-intro-text">
                The adventure is heating up! Quick time events will flash on screen—tap the button as fast as you can before time runs out!
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Watch for the action prompt
                <br />
                • Tap it quickly before it disappears
                <br />
                • Fast reflexes = epic moments!
              </div>
              <button className="ee-btn primary" onClick={startGame}>
                Start the escape! ⚔️
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="ee-playing">
              <div className="ee-score">
                Escapes: {score} / {totalRounds}
              </div>

              <div className={`ee-prompt-zone ${showPrompt ? "active" : ""} ${responded ? "responded" : ""}`}>
                {currentQTE && showPrompt && (
                  <>
                    <div className="ee-emoji">{currentQTE.emoji}</div>
                    <div className="ee-action">{currentQTE.action}</div>
                  </>
                )}
              </div>

              {showPrompt && !responded && (
                <button className="ee-action-btn" onClick={handleAction}>
                  {currentQTE.action}
                </button>
              )}

              {feedback && (
                <div className={`ee-feedback ${feedback}`}>
                  {feedback === "success" ? "YES! ✓" : "Too slow! ✗"}
                </div>
              )}

              <div className="ee-round-indicator">
                Challenge {currentRound + 1} / {totalRounds}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="ee-complete">
              <div className="ee-final-score">
                {score} / {totalRounds} escapes!
              </div>
              <div className="ee-complete-text">
                {score >= totalRounds - 1
                  ? "Legendary reflexes! We made it through! 🏆"
                  : score >= totalRounds - 2
                  ? "Close calls, but we survived! 💪"
                  : "We stumbled, but the adventure continues!"}
              </div>
              <button className="ee-btn primary" onClick={onDone}>
                Catch our breath →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
