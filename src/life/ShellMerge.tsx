import { useState, useCallback } from "react";
import "./ShellMerge.css";

type GamePhase = "intro" | "playing" | "complete";

type ShellType = "tiny" | "small" | "medium" | "large" | "huge";

interface Shell {
  id: number;
  type: ShellType;
  emoji: string;
  merging?: boolean;
}

const SHELL_TYPES: Record<ShellType, { emoji: string; next?: ShellType }> = {
  tiny: { emoji: "🐚", next: "small" },
  small: { emoji: "🦪", next: "medium" },
  medium: { emoji: "🐙", next: "large" },
  large: { emoji: "🦑", next: "huge" },
  huge: { emoji: "🦈", next: undefined },
};

const COLS = 5;
const MAX_HEIGHT = 7;
const DROPS_ALLOWED = 20;

export function ShellMerge({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [columns, setColumns] = useState<Shell[][]>(Array(COLS).fill(null).map(() => []));
  const [nextShell, setNextShell] = useState<ShellType>("tiny");
  const [dropsUsed, setDropsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextId, setNextId] = useState(0);

  // Get random shell type (weighted towards smaller)
  const getRandomShellType = useCallback((): ShellType => {
    const rand = Math.random();
    if (rand < 0.5) return "tiny";
    if (rand < 0.8) return "small";
    if (rand < 0.95) return "medium";
    return "large";
  }, []);

  // Check and perform merges in a column
  const checkMerges = useCallback((colIndex: number, newColumns: Shell[][]) => {
    const column = newColumns[colIndex];
    let merged = false;

    for (let i = column.length - 1; i > 0; i--) {
      if (column[i].type === column[i - 1].type && SHELL_TYPES[column[i].type].next) {
        // Merge!
        const nextType = SHELL_TYPES[column[i].type].next!;
        const mergedShell: Shell = {
          id: column[i].id,
          type: nextType,
          emoji: SHELL_TYPES[nextType].emoji,
          merging: true,
        };

        // Remove both shells and add merged one
        column.splice(i - 1, 2, mergedShell);
        merged = true;

        // Update score based on shell size
        const scoreValue = nextType === "huge" ? 50 : nextType === "large" ? 20 : nextType === "medium" ? 8 : 3;
        setScore((s) => s + scoreValue);

        // Clear merging flag after animation
        setTimeout(() => {
          setColumns((cols) => {
            const updatedCols = [...cols];
            const col = updatedCols[colIndex];
            const shellIndex = col.findIndex((s) => s.id === mergedShell.id);
            if (shellIndex !== -1) {
              col[shellIndex] = { ...mergedShell, merging: false };
            }
            return updatedCols;
          });
        }, 400);

        break; // Only one merge per drop
      }
    }

    return merged;
  }, []);

  // Drop a shell in a column
  const dropShell = useCallback(
    (colIndex: number) => {
      if (phase !== "playing" || gameOver) return;

      const column = columns[colIndex];
      if (column.length >= MAX_HEIGHT) {
        // Column full, game over
        setGameOver(true);
        setTimeout(() => setPhase("complete"), 800);
        return;
      }

      const newShell: Shell = {
        id: nextId,
        type: nextShell,
        emoji: SHELL_TYPES[nextShell].emoji,
      };

      setNextId((id) => id + 1);

      const newColumns = columns.map((col, i) =>
        i === colIndex ? [...col, newShell] : col
      );

      setColumns(newColumns);

      // Check for merges
      setTimeout(() => {
        let shouldCheckAgain = checkMerges(colIndex, newColumns);
        // Keep checking for chain merges
        let attempts = 0;
        const recheckMerges = () => {
          if (attempts++ > 5) return; // Prevent infinite loop
          setTimeout(() => {
            shouldCheckAgain = checkMerges(colIndex, newColumns);
            if (shouldCheckAgain) recheckMerges();
          }, 450);
        };
        if (shouldCheckAgain) recheckMerges();
      }, 100);

      // Update drops and next shell
      const newDropsUsed = dropsUsed + 1;
      setDropsUsed(newDropsUsed);
      setNextShell(getRandomShellType());

      if (newDropsUsed >= DROPS_ALLOWED) {
        setTimeout(() => setPhase("complete"), 1000);
      }
    },
    [phase, gameOver, columns, nextShell, dropsUsed, nextId, getRandomShellType, checkMerges]
  );

  // Start the game
  const startGame = () => {
    setPhase("playing");
    setColumns(Array(COLS).fill(null).map(() => []));
    setNextShell(getRandomShellType());
    setDropsUsed(0);
    setScore(0);
    setGameOver(false);
    setNextId(0);
  };

  return (
    <div className="sm-overlay">
      <div className="sm-wrap">
        <div className="sm-content">
          <div className="sm-title">{title ?? "Shell Merge"}</div>
          <div className="sm-subtitle">
            {subtitle ?? "Collect and merge shells from the beach!"}
          </div>

          {phase === "intro" && (
            <div className="sm-intro">
              <div className="sm-intro-text">
                Walking along the beach, collecting shells... when two of the same kind touch, they become something bigger!
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Tap a column to drop a shell
                <br />
                • Match two shells to merge them
                <br />• Create bigger shells for more points!
              </div>
              <button className="sm-btn primary" onClick={startGame}>
                Start collecting! 🐚
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="sm-playing">
              <div className="sm-stats">
                <div className="sm-score">Score: {score}</div>
                <div className="sm-drops">
                  Drops: {dropsUsed} / {DROPS_ALLOWED}
                </div>
              </div>

              <div className="sm-next-shell">
                <div className="sm-next-label">Next:</div>
                <div className="sm-next-emoji">{SHELL_TYPES[nextShell].emoji}</div>
              </div>

              <div className="sm-board">
                {columns.map((column, colIndex) => (
                  <button
                    key={colIndex}
                    className="sm-column"
                    onClick={() => dropShell(colIndex)}
                    disabled={column.length >= MAX_HEIGHT}
                  >
                    {column.map((shell, shellIndex) => (
                      <div
                        key={shell.id}
                        className={`sm-shell ${shell.type} ${shell.merging ? "merging" : ""}`}
                      >
                        {shell.emoji}
                      </div>
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="sm-complete">
              <div className="sm-final-score">Score: {score}</div>
              <div className="sm-complete-text">
                {gameOver
                  ? "The bucket is full of beautiful shells! 🐚"
                  : score >= 100
                  ? "What a collection! The beach was generous today! 🦈"
                  : score >= 50
                  ? "Some lovely merges! Great beach finds. 🦑"
                  : "Every shell has its own story! 🐙"}
              </div>
              <button className="sm-btn primary" onClick={onDone}>
                Head back →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
