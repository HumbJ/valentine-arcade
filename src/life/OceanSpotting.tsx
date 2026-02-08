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
const TOTAL_CREATURES = 18;

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
  const [creaturesSpawned, setCreaturesSpawned] = useState(0);
  const nextCreatureId = useRef(0);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Start the game
  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setCreaturesSpawned(0);
    setCreatures([]);
    nextCreatureId.current = 0;
  };

  // Spawn a new creature
  const spawnCreature = useCallback(() => {
    if (creaturesSpawned >= TOTAL_CREATURES) {
      // Game complete after all creatures have appeared
      setTimeout(() => {
        setPhase("complete");
      }, 2000);
      return;
    }

    const creatureType = CREATURE_TYPES[Math.floor(Math.random() * CREATURE_TYPES.length)];
    const availableSpots = Array.from({ length: TOTAL_SPOTS }, (_, i) => i).filter(
      (spot) => !creatures.some((c) => c.visible && c.spot === spot)
    );

    if (availableSpots.length === 0) {
      // Try again in a moment if no spots available
      spawnTimerRef.current = setTimeout(spawnCreature, 300);
      return;
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

    setCreatures((prev) => [...prev.filter((c) => c.visible || c.caught), newCreature]);
    setCreaturesSpawned((prev) => prev + 1);

    // Hide after duration
    const hideTimer = setTimeout(() => {
      setCreatures((prev) =>
        prev.map((c) => (c.id === creatureId ? { ...c, visible: false } : c))
      );
    }, creatureType.duration);

    hideTimersRef.current.set(creatureId, hideTimer);

    // Spawn next creature
    const nextDelay = 800 + Math.random() * 1200; // 800-2000ms
    spawnTimerRef.current = setTimeout(spawnCreature, nextDelay);
  }, [creatures, creaturesSpawned]);

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

  // Start spawning when game begins
  useEffect(() => {
    if (phase === "playing" && creaturesSpawned === 0) {
      spawnCreature();
    }

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
      hideTimersRef.current.forEach((timer) => clearTimeout(timer));
      hideTimersRef.current.clear();
    };
  }, [phase, spawnCreature, creaturesSpawned]);

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
              <div className="os-score">Spotted: {score} / {TOTAL_CREATURES}</div>

              <div className="os-ocean">
                {Array.from({ length: TOTAL_SPOTS }).map((_, spotIndex) => {
                  const creature = creatures.find((c) => c.spot === spotIndex && c.visible);

                  return (
                    <div key={spotIndex} className="os-spot">
                      {creature && (
                        <button
                          className={`os-creature ${creature.caught ? "caught" : ""}`}
                          onClick={() => catchCreature(creature.id)}
                        >
                          {creature.emoji}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="os-progress">
                Creatures: {creaturesSpawned} / {TOTAL_CREATURES}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="os-complete">
              <div className="os-final-score">
                {score} / {TOTAL_CREATURES} spotted!
              </div>
              <div className="os-complete-text">
                {score >= TOTAL_CREATURES - 2
                  ? "Incredible! You spotted nearly everything! 🐋"
                  : score >= TOTAL_CREATURES - 5
                  ? "Great eye! The ocean shared its secrets with you. 🐬"
                  : score >= TOTAL_CREATURES - 8
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
