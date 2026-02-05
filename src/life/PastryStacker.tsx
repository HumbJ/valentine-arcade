import { useState, useEffect, useCallback, useRef } from "react";
import "./PastryStacker.css";

const PASTRIES = ["🥐", "🧁", "🍩", "🥮", "🍪", "🧇"];

type StackedPastry = {
  id: number;
  emoji: string;
  offset: number; // how far off-center it landed
};

export function PastryStacker({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [stack, setStack] = useState<StackedPastry[]>([]);
  const [currentPastry, setCurrentPastry] = useState<string>(PASTRIES[0]);
  const [position, setPosition] = useState(0); // -100 to 100
  const [direction, setDirection] = useState(1);
  const [isDropping, setIsDropping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const targetHeight = 6; // Stack 6 pastries to win

  const resetGame = () => {
    setStack([]);
    setCurrentPastry(PASTRIES[0]);
    setPosition(0);
    setDirection(1);
    setIsDropping(false);
    setGameOver(false);
    setScore(0);
  };

  // Animate the swinging pastry
  useEffect(() => {
    if (isDropping || gameOver) return;

    const speed = 2 + stack.length * 0.5; // Gets faster as you stack

    const animate = () => {
      setPosition((prev) => {
        let next = prev + direction * speed;
        if (next >= 80) {
          setDirection(-1);
          next = 80;
        } else if (next <= -80) {
          setDirection(1);
          next = -80;
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, isDropping, gameOver, stack.length]);

  // Drop the pastry
  const dropPastry = useCallback(() => {
    if (isDropping || gameOver) return;

    setIsDropping(true);

    // Calculate how off-center the drop is
    const offset = position;
    const isGoodDrop = Math.abs(offset) < 40;

    setTimeout(() => {
      if (isGoodDrop) {
        // Successful stack
        const newPastry: StackedPastry = {
          id: Date.now(),
          emoji: currentPastry,
          offset: offset * 0.3, // Scale down for visual
        };

        setStack((prev) => [...prev, newPastry]);
        setScore((prev) => prev + Math.max(1, Math.floor((40 - Math.abs(offset)) / 10)));

        // Check for win
        if (stack.length + 1 >= targetHeight) {
          setGameOver(true);
        } else {
          // Next pastry
          setCurrentPastry(PASTRIES[(stack.length + 1) % PASTRIES.length]);
          setIsDropping(false);
        }
      } else {
        // Failed drop - game over
        setGameOver(true);
      }
    }, 300);
  }, [position, isDropping, gameOver, currentPastry, stack.length]);

  // Handle tap/click
  const handleTap = () => {
    if (!gameOver && !isDropping) {
      dropPastry();
    }
  };

  const won = stack.length >= targetHeight;

  return (
    <div className="ps-overlay">
      <div className="ps-wrap">
        {/* Decorative windmill */}
        <div className="ps-windmill">
          <div className="ps-windmill-base" />
          <div className="ps-windmill-blades">
            <div className="ps-blade" />
            <div className="ps-blade" />
            <div className="ps-blade" />
            <div className="ps-blade" />
          </div>
        </div>

        <div className="ps-content">
          <div className="ps-title">{title ?? "Danish Delights"}</div>
          <div className="ps-subtitle">
            {subtitle ?? "Stack the pastries! Tap to drop."}
          </div>

          <div className="ps-game-area" onClick={handleTap}>
            {/* Current swinging pastry */}
            {!gameOver && !isDropping && (
              <div
                className="ps-current"
                style={{ transform: `translateX(${position}px)` }}
              >
                <span className="ps-pastry-emoji">{currentPastry}</span>
              </div>
            )}

            {/* Dropping pastry animation */}
            {isDropping && (
              <div
                className="ps-dropping"
                style={{ transform: `translateX(${position}px)` }}
              >
                <span className="ps-pastry-emoji">{currentPastry}</span>
              </div>
            )}

            {/* Stacked pastries */}
            <div className="ps-stack">
              {stack.map((pastry, index) => (
                <div
                  key={pastry.id}
                  className="ps-stacked"
                  style={{
                    transform: `translateX(${pastry.offset}px)`,
                    bottom: `${index * 40}px`,
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <span className="ps-pastry-emoji">{pastry.emoji}</span>
                </div>
              ))}

              {/* Table */}
              <div className="ps-table" />
            </div>

            {/* Progress indicator */}
            <div className="ps-height-marker">
              <div className="ps-height-bar">
                <div
                  className="ps-height-fill"
                  style={{ height: `${(stack.length / targetHeight) * 100}%` }}
                />
              </div>
              <span className="ps-height-label">{stack.length}/{targetHeight}</span>
            </div>
          </div>

          <div className="ps-score">Score: {score}</div>

          {gameOver && (
            <div className="ps-result">
              {won ? (
                <>
                  <div className="ps-result-text success">
                    Perfect stack! The baker would be proud.
                  </div>
                  <div className="ps-button-group">
                    <button className="ps-btn secondary" onClick={resetGame}>
                      Play again
                    </button>
                    <button className="ps-btn" onClick={onDone}>
                      Time for pastries! →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="ps-result-text fail">
                    The tower tumbled... but we still ate them all!
                  </div>
                  <div className="ps-button-group">
                    <button className="ps-btn secondary" onClick={resetGame}>
                      Try again
                    </button>
                    <button className="ps-btn" onClick={onDone}>
                      Good enough! →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {!gameOver && (
            <div className="ps-hint">Tap when centered to stack!</div>
          )}
        </div>
      </div>
    </div>
  );
}
