import { useState, useCallback, useEffect, useRef } from "react";
import "./ShellMerge.css";

type GamePhase = "intro" | "playing";

type ShellType = "tiny" | "small" | "medium" | "large" | "huge";

interface Shell {
  id: number;
  type: ShellType;
  emoji: string;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  radius: number;
  merging?: boolean;
}

const SHELL_TYPES: Record<ShellType, { emoji: string; next?: ShellType; radius: number; score: number }> = {
  tiny: { emoji: "🐚", next: "small", radius: 20, score: 1 },
  small: { emoji: "🦪", next: "medium", radius: 25, score: 3 },
  medium: { emoji: "🐙", next: "large", radius: 30, score: 8 },
  large: { emoji: "🦑", next: "huge", radius: 35, score: 20 },
  huge: { emoji: "🦈", next: undefined, radius: 42, score: 50 },
};

const GAME_WIDTH = 320;
const GAME_HEIGHT = 400;
const GRAVITY = 0.5;
const BOUNCE = 0.3;
const FRICTION = 0.98;

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
  const [shells, setShells] = useState<Shell[]>([]);
  const [nextShell, setNextShell] = useState<ShellType>("tiny");
  const [score, setScore] = useState(0);
  const [dropX, setDropX] = useState(GAME_WIDTH / 2);
  const [nextId, setNextId] = useState(0);
  const animationFrameRef = useRef<number>();
  const gameLoopActive = useRef(false);

  // Get random shell type (weighted towards smaller)
  const getRandomShellType = useCallback((): ShellType => {
    const rand = Math.random();
    if (rand < 0.5) return "tiny";
    if (rand < 0.8) return "small";
    if (rand < 0.95) return "medium";
    return "large";
  }, []);

  // Check collision between two shells
  const checkCollision = (s1: Shell, s2: Shell): boolean => {
    const dx = s1.x - s2.x;
    const dy = s1.y - s2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < s1.radius + s2.radius;
  };

  // Game physics loop
  const gameLoop = useCallback(() => {
    setShells((currentShells) => {
      if (currentShells.length === 0) return currentShells;

      let newShells = [...currentShells];
      const toMerge: Set<number> = new Set();

      // Update positions with physics
      newShells = newShells.map((shell) => {
        if (shell.merging) return shell;

        let newShell = { ...shell };

        // Apply gravity
        newShell.vy += GRAVITY;

        // Apply friction
        newShell.vx *= FRICTION;
        newShell.vy *= FRICTION;

        // Update position
        newShell.x += newShell.vx;
        newShell.y += newShell.vy;

        // Wall collisions
        if (newShell.x - newShell.radius < 0) {
          newShell.x = newShell.radius;
          newShell.vx = -newShell.vx * BOUNCE;
        }
        if (newShell.x + newShell.radius > GAME_WIDTH) {
          newShell.x = GAME_WIDTH - newShell.radius;
          newShell.vx = -newShell.vx * BOUNCE;
        }

        // Floor collision
        if (newShell.y + newShell.radius > GAME_HEIGHT) {
          newShell.y = GAME_HEIGHT - newShell.radius;
          newShell.vy = -newShell.vy * BOUNCE;
          if (Math.abs(newShell.vy) < 0.5) newShell.vy = 0;
        }

        return newShell;
      });

      // Check for collisions and merges
      for (let i = 0; i < newShells.length; i++) {
        if (toMerge.has(i) || newShells[i].merging) continue;

        for (let j = i + 1; j < newShells.length; j++) {
          if (toMerge.has(j) || newShells[j].merging) continue;

          if (checkCollision(newShells[i], newShells[j])) {
            // Same type and can merge?
            if (
              newShells[i].type === newShells[j].type &&
              SHELL_TYPES[newShells[i].type].next
            ) {
              toMerge.add(i);
              toMerge.add(j);

              const nextType = SHELL_TYPES[newShells[i].type].next!;
              const mergedShell: Shell = {
                id: nextId,
                type: nextType,
                emoji: SHELL_TYPES[nextType].emoji,
                x: (newShells[i].x + newShells[j].x) / 2,
                y: (newShells[i].y + newShells[j].y) / 2,
                vx: 0,
                vy: 0,
                radius: SHELL_TYPES[nextType].radius,
                merging: true,
              };

              setNextId((id) => id + 1);
              setScore((s) => s + SHELL_TYPES[nextType].score);

              // Add merged shell and remove old ones after marking
              setTimeout(() => {
                setShells((shells) => {
                  const filtered = shells.filter((s) => s.id !== newShells[i].id && s.id !== newShells[j].id);
                  return [...filtered, { ...mergedShell, merging: false }];
                });
              }, 100);

              break;
            } else {
              // Simple elastic collision for different types
              const dx = newShells[j].x - newShells[i].x;
              const dy = newShells[j].y - newShells[i].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance > 0) {
                const overlap = (newShells[i].radius + newShells[j].radius - distance) / 2;
                const nx = dx / distance;
                const ny = dy / distance;

                newShells[i].x -= nx * overlap;
                newShells[i].y -= ny * overlap;
                newShells[j].x += nx * overlap;
                newShells[j].y += ny * overlap;

                const dvx = newShells[j].vx - newShells[i].vx;
                const dvy = newShells[j].vy - newShells[i].vy;
                const dotProduct = dvx * nx + dvy * ny;

                newShells[i].vx += nx * dotProduct * 0.5;
                newShells[i].vy += ny * dotProduct * 0.5;
                newShells[j].vx -= nx * dotProduct * 0.5;
                newShells[j].vy -= ny * dotProduct * 0.5;
              }
            }
          }
        }
      }

      // Remove shells marked for merging
      if (toMerge.size > 0) {
        return newShells.filter((_, i) => !toMerge.has(i));
      }

      return newShells;
    });

    if (gameLoopActive.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [nextId]);

  // Start/stop game loop
  useEffect(() => {
    if (phase === "playing") {
      gameLoopActive.current = true;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      gameLoopActive.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      gameLoopActive.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop]);

  // Drop a shell
  const dropShell = useCallback(() => {
    if (phase !== "playing") return;

    const newShell: Shell = {
      id: nextId,
      type: nextShell,
      emoji: SHELL_TYPES[nextShell].emoji,
      x: dropX,
      y: 40,
      vx: 0,
      vy: 0,
      radius: SHELL_TYPES[nextShell].radius,
    };

    setShells((shells) => [...shells, newShell]);
    setNextId((id) => id + 1);
    setNextShell(getRandomShellType());
  }, [phase, nextShell, dropX, nextId, getRandomShellType]);

  // Handle mouse move to update drop position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const radius = SHELL_TYPES[nextShell].radius;
    setDropX(Math.max(radius, Math.min(GAME_WIDTH - radius, x)));
  };

  // Start the game
  const startGame = () => {
    setPhase("playing");
    setShells([]);
    setNextShell(getRandomShellType());
    setScore(0);
    setNextId(0);
    setDropX(GAME_WIDTH / 2);
  };

  return (
    <div className="sm-overlay">
      <div className="sm-wrap">
        <div className="sm-content">
          <div className="sm-title">{title ?? "Shell Merge"}</div>
          <div className="sm-subtitle">
            {subtitle ?? "Drop shells and watch them merge!"}
          </div>

          {phase === "intro" && (
            <div className="sm-intro">
              <div className="sm-intro-text">
                Shells tumble and roll on the beach... when two of the same kind touch, they merge into something bigger!
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Move your mouse to aim
                <br />
                • Click to drop a shell
                <br />• Match shells to create chain reactions!
              </div>
              <button className="sm-btn primary" onClick={startGame}>
                Start dropping! 🐚
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="sm-playing">
              <div className="sm-stats">
                <div className="sm-score">Score: {score}</div>
              </div>

              <div className="sm-next-shell">
                <div className="sm-next-label">Next:</div>
                <div className="sm-next-emoji">{SHELL_TYPES[nextShell].emoji}</div>
              </div>

              <div
                className="sm-game-area"
                onClick={dropShell}
                onMouseMove={handleMouseMove}
              >
                {/* Drop preview */}
                <div
                  className="sm-drop-preview"
                  style={{
                    left: `${dropX}px`,
                    fontSize: `${SHELL_TYPES[nextShell].radius * 1.5}px`,
                  }}
                >
                  {SHELL_TYPES[nextShell].emoji}
                </div>

                {/* Shells */}
                {shells.map((shell) => (
                  <div
                    key={shell.id}
                    className={`sm-shell-physics ${shell.merging ? "merging" : ""}`}
                    style={{
                      left: `${shell.x}px`,
                      top: `${shell.y}px`,
                      fontSize: `${shell.radius * 1.5}px`,
                    }}
                  >
                    {shell.emoji}
                  </div>
                ))}
              </div>

              <button className="sm-btn-end" onClick={onDone}>
                Back to the adventure! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
