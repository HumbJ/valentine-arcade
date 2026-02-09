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
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const gameStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSpawningRef = useRef(false);

  // Start the game
  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setTimeRemaining(GAME_DURATION);
    setCreatures([]);
    nextCreatureId.current = 0;
    gameStartTimeRef.current = Date.now();
    isSpawningRef.current = false;
  };

  // Handle catching a creature
  const catchCreature = useCallback((creatureId: number) => {
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id === creatureId && c.visible && !c.caught) {
          setScore((s) => s + 1);

          // Clear hide timer
          const timer = hideTimersRef.current.get(creatureId);
          if (timer) {
            clearTimeout(timer);
            hideTimersRef.current.delete(creatureId);
          }

          return { ...c, caught: true, visible: false };
        }
        return c;
      })
    );
  }, []);

  // Game logic
  useEffect(() => {
    if (phase !== "playing") return;

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
      const elapsed = Date.now() - gameStartTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        isSpawningRef.current = false;
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

                  return (
                    <div key={spotIndex} className="os-spot">
                      {creature && (
                        <button
                          className={`os-creature ${creature.caught ? "caught" : ""}`}
                          onClick={() => catchCreature(creature.id)}
                          disabled={creature.caught}
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
