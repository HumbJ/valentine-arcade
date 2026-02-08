import { useState, useCallback, useEffect } from "react";
import "./LeiPattern.css";

type GamePhase = "intro" | "showing" | "playing" | "result" | "complete";

interface Flower {
  id: string;
  emoji: string;
  color: string;
  name: string;
}

const FLOWERS: Flower[] = [
  { id: "red", emoji: "🌺", color: "#e91e63", name: "Hibiscus" },
  { id: "yellow", emoji: "🌻", color: "#ffc107", name: "Sunflower" },
  { id: "pink", emoji: "🌸", color: "#f48fb1", name: "Plumeria" },
  { id: "purple", emoji: "🌼", color: "#9c27b0", name: "Orchid" },
];

const ROUNDS = 5;

export function LeiPattern({
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
  const [pattern, setPattern] = useState<Flower[]>([]);
  const [playerPattern, setPlayerPattern] = useState<Flower[]>([]);
  const [showingIndex, setShowingIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [highlightedFlower, setHighlightedFlower] = useState<string | null>(null);

  // Generate pattern
  const generatePattern = useCallback((length: number) => {
    const newPattern: Flower[] = [];
    for (let i = 0; i < length; i++) {
      const flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
      newPattern.push(flower);
    }
    return newPattern;
  }, []);

  // Start a round
  const startRound = useCallback(() => {
    const patternLength = 3 + currentRound; // 3, 4, 5, 6, 7
    const newPattern = generatePattern(patternLength);
    setPattern(newPattern);
    setPlayerPattern([]);
    setShowingIndex(0);
    setFeedback(null);
    setPhase("showing");
  }, [currentRound, generatePattern]);

  // Show pattern sequence
  useEffect(() => {
    if (phase === "showing") {
      if (showingIndex < pattern.length) {
        // Add initial delay for the first flower
        const initialDelay = showingIndex === 0 ? 500 : 0;

        const startTimer = setTimeout(() => {
          setHighlightedFlower(pattern[showingIndex].id);

          const timer = setTimeout(() => {
            setHighlightedFlower(null);

            const nextTimer = setTimeout(() => {
              setShowingIndex(showingIndex + 1);
            }, 300);

            return () => clearTimeout(nextTimer);
          }, 700);

          return () => clearTimeout(timer);
        }, initialDelay);

        return () => clearTimeout(startTimer);
      } else {
        setTimeout(() => {
          setPhase("playing");
        }, 500);
      }
    }
  }, [phase, showingIndex, pattern]);

  // Handle flower click
  const handleFlowerClick = useCallback(
    (flower: Flower) => {
      if (phase !== "playing") return;

      // Flash the clicked flower
      setHighlightedFlower(flower.id);
      setTimeout(() => setHighlightedFlower(null), 300);

      const newPlayerPattern = [...playerPattern, flower];
      setPlayerPattern(newPlayerPattern);

      const expectedFlower = pattern[playerPattern.length];
      if (flower.id !== expectedFlower.id) {
        // Wrong!
        setFeedback("wrong");
        setTimeout(() => {
          setPhase("result");
        }, 1000);
        return;
      }

      // Check if pattern complete
      if (newPlayerPattern.length === pattern.length) {
        // Correct!
        setFeedback("correct");
        setScore((s) => s + 1);
        setTimeout(() => {
          if (currentRound + 1 >= ROUNDS) {
            setPhase("complete");
          } else {
            setCurrentRound((r) => r + 1);
            setPhase("result");
          }
        }, 1000);
      }
    },
    [phase, playerPattern, pattern, currentRound]
  );

  // Continue to next round
  const continueToNextRound = () => {
    startRound();
  };

  // Start the game
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    startRound();
  };

  return (
    <div className="lp-overlay">
      <div className="lp-wrap">
        <div className="lp-content">
          <div className="lp-title">{title ?? "Lei Pattern"}</div>
          <div className="lp-subtitle">
            {subtitle ?? "Remember the flowers in the lei!"}
          </div>

          {phase === "intro" && (
            <div className="lp-intro">
              <div className="lp-intro-text">
                Making a lei together, one flower at a time. Each one has its place, creating something beautiful.
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Watch the flower pattern carefully
                <br />
                • Remember the sequence
                <br />• Tap the flowers in the same order!
              </div>
              <button className="lp-btn primary" onClick={startGame}>
                Start making leis! 🌺
              </button>
            </div>
          )}

          {(phase === "showing" || phase === "playing") && (
            <div className="lp-game">
              <div className="lp-round-info">
                Round {currentRound + 1} / {ROUNDS}
              </div>

              {phase === "showing" && (
                <div className="lp-instruction">Watch the pattern...</div>
              )}

              {phase === "playing" && (
                <div className="lp-instruction">Your turn! Tap the flowers</div>
              )}

              <div className="lp-pattern-display">
                {playerPattern.map((flower, index) => (
                  <div key={index} className="lp-pattern-flower">
                    {flower.emoji}
                  </div>
                ))}
              </div>

              <div className="lp-flowers">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.id}
                    className={`lp-flower-btn ${highlightedFlower === flower.id ? "highlighted" : ""}`}
                    style={
                      highlightedFlower === flower.id
                        ? {
                            backgroundColor: flower.color,
                            borderColor: flower.color,
                          }
                        : {}
                    }
                    onClick={() => handleFlowerClick(flower)}
                    disabled={phase !== "playing"}
                  >
                    <div className="lp-flower-emoji">{flower.emoji}</div>
                    <div className="lp-flower-name">{flower.name}</div>
                  </button>
                ))}
              </div>

              {feedback && (
                <div className={`lp-feedback ${feedback}`}>
                  {feedback === "correct" ? "Perfect lei! ✓" : "Oops! Wrong flower ✗"}
                </div>
              )}
            </div>
          )}

          {phase === "result" && feedback === "wrong" && (
            <div className="lp-result">
              <div className="lp-result-text">
                A few flowers out of place, but still beautiful!
              </div>
              <div className="lp-final-score">
                Leis completed: {score} / {ROUNDS}
              </div>
              <button className="lp-btn primary" onClick={onDone}>
                Wear it proudly →
              </button>
            </div>
          )}

          {phase === "result" && feedback === "correct" && (
            <div className="lp-result">
              <div className="lp-result-text">Beautiful! Let's make another!</div>
              <button className="lp-btn primary" onClick={continueToNextRound}>
                Next lei →
              </button>
            </div>
          )}

          {phase === "complete" && (
            <div className="lp-complete">
              <div className="lp-final-score">
                {score} / {ROUNDS} perfect leis!
              </div>
              <div className="lp-complete-text">
                {score === ROUNDS
                  ? "Every flower in perfect harmony! Master lei maker! 🌺"
                  : score >= ROUNDS - 1
                  ? "Nearly perfect! These leis are gorgeous. 🌸"
                  : "Each lei tells a story of our time here! 🌼"}
              </div>
              <button className="lp-btn primary" onClick={onDone}>
                Aloha! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
