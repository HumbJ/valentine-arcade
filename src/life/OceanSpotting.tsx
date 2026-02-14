import { useState, useCallback, useEffect, useRef } from "react";
import "./OceanSpotting.css";

type GamePhase = "intro" | "playing" | "complete";

interface Creature {
  id: number;
  type: "dolphin" | "turtle" | "fish" | "whale";
  emoji: string;
  spot: number;
  visible: boolean;
  caught: boolean;
}

const CREATURE_TYPES = [
  { type: "dolphin" as const, emoji: "🐬", duration: 1800 },
  { type: "turtle" as const, emoji: "🐢", duration: 2200 },
  { type: "fish" as const, emoji: "🐟", duration: 1500 },
  { type: "whale" as const, emoji: "🐋", duration: 2500 },
];

const TOTAL_SPOTS = 9;
const GAME_DURATION = 30000; // 30 seconds

export function OceanSpotting({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const nextCreatureId = useRef(0);
  const spawnTimerRef = useRef<number | null>(null);
  const hideTimersRef = useRef<Map<number, number>>(new Map());
  const gameStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const isSpawningRef = useRef(false);
  const caughtCreaturesRef = useRef<Set<number>>(new Set());

  // Start the game
  const startGame = () => {
    // Clear all timers first
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    hideTimersRef.current.forEach((timer) => clearTimeout(timer));
    hideTimersRef.current.clear();

    // Reset all state
    setPhase("playing");
    setScore(0);
    setTimeRemaining(GAME_DURATION);
    setCreatures([]);
    nextCreatureId.current = 0;
    gameStartTimeRef.current = 0;
    isSpawningRef.current = false;
    caughtCreaturesRef.current.clear();
  };

  // Handle catching a creature
  const catchCreature = useCallback((creatureId: number) => {
    // Prevent spam-clicking the same creature
    if (caughtCreaturesRef.current.has(creatureId)) {
      return;
    }

    // Mark as caught in ref immediately to prevent spam-clicking
    caughtCreaturesRef.current.add(creatureId);
    setScore((s) => s + 1);

    setCreatures((prev) => {
      const creature = prev.find((c) => c.id === creatureId);
      if (!creature || !creature.visible) {
        return prev;
      }

      // Clear hide timer
      const timer = hideTimersRef.current.get(creatureId);
      if (timer) {
        clearTimeout(timer);
        hideTimersRef.current.delete(creatureId);
      }

      return prev.map((c) =>
        c.id === creatureId ? { ...c, caught: true, visible: false } : c
      );
    });
  }, []);

  // Game logic
  useEffect(() => {
    if (phase !== "playing") return;

    // Set start time once
    gameStartTimeRef.current = Date.now();
    isSpawningRef.current = true;

    // Spawn creatures
    const spawnCreature = () => {
      if (!isSpawningRef.current) return;

      setCreatures((currentCreatures) => {
        const creatureType = CREATURE_TYPES[Math.floor(Math.random() * CREATURE_TYPES.length)];
        const availableSpots = Array.from({ length: TOTAL_SPOTS }, (_, i) => i).filter(
          (spot) => !currentCreatures.some((c) => c.visible && c.spot === spot)
        );

        if (availableSpots.length === 0) {
          spawnTimerRef.current = setTimeout(spawnCreature, 300);
          return currentCreatures;
        }

        const spot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        const creatureId = nextCreatureId.current++;

        const newCreature: Creature = {
          id: creatureId,
          type: creatureType.type,
          emoji: creatureType.emoji,
          spot,
          visible: true,
          caught: false,
        };

        // Hide after duration
        const hideTimer = setTimeout(() => {
          setCreatures((prev) =>
            prev.map((c) => (c.id === creatureId ? { ...c, visible: false } : c))
          );
        }, creatureType.duration);

        hideTimersRef.current.set(creatureId, hideTimer);

        // Spawn next creature
        const nextDelay = 800 + Math.random() * 1200;
        spawnTimerRef.current = setTimeout(spawnCreature, nextDelay);

        return [...currentCreatures.filter((c) => c.visible), newCreature];
      });
    };

    // Start spawning
    spawnCreature();

    // Update timer
    timerIntervalRef.current = setInterval(() => {
      // Safety check - don't update if not spawning
      if (!isSpawningRef.current) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        return;
      }

      const elapsed = Date.now() - gameStartTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        isSpawningRef.current = false;
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setPhase("complete");
      }
    }, 100);

    return () => {
      isSpawningRef.current = false;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      hideTimersRef.current.forEach((timer) => clearTimeout(timer));
      hideTimersRef.current.clear();
    };
  }, [phase]);

  return (
    <div className="os-overlay">
      <div className="os-wrap">
        <div className="os-content">
          <div className="os-title">{title ?? "Ocean Spotting"}</div>
          <div className="os-subtitle">
            {subtitle ?? "Spot the sea creatures before they swim away!"}
          </div>

          {phase === "intro" && (
            <div className="os-intro">
              <div className="os-intro-text">
                The ocean is alive with movement! Dolphins leap, turtles surface, fish dart by...
                <br />
                <br />
                <strong>How to play:</strong>
                <br />
                • Watch the ocean surface
                <br />
                • Tap creatures before they dive back under
                <br />• Fast reactions = high score!
              </div>
              <button className="os-btn primary" onClick={startGame}>
                Start spotting! 🌊
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="os-playing">
              <div className="os-score">Spotted: {score}</div>
              <div className="os-timer">Time: {Math.ceil(timeRemaining / 1000)}s</div>

              <div className="os-ocean">
                {Array.from({ length: TOTAL_SPOTS }).map((_, spotIndex) => {
                  const creature = creatures.find((c) => c.spot === spotIndex && c.visible);
                  const isCaught = creature && caughtCreaturesRef.current.has(creature.id);

                  return (
                    <div key={spotIndex} className="os-spot">
                      {creature && !isCaught && (
                        <button
                          className="os-creature"
                          onClick={() => catchCreature(creature.id)}
                          style={{ pointerEvents: isCaught ? 'none' : 'auto' }}
                        >
                          {creature.emoji}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="os-complete">
              <div className="os-final-score">
                You spotted {score} creatures!
              </div>
              <div className="os-complete-text">
                {score >= 20
                  ? "Incredible! Your eyes are as sharp as a seabird's! 🐋"
                  : score >= 15
                  ? "Great eye! The ocean shared its secrets with you. 🐬"
                  : score >= 10
                  ? "Nice work! You caught glimpses of the magic. 🐢"
                  : "The ocean is fast, but we got to see some wonders! 🐟"}
              </div>
              <button className="os-btn primary" onClick={onDone}>
                Back to the boat →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
