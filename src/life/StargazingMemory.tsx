import { useState, useEffect, useMemo } from "react";
import "./StargazingMemory.css";

// Constellation data with simple star patterns
const CONSTELLATIONS = [
  { id: "orion", name: "Orion", emoji: "🪢", stars: "★ ★ ★\n ★\n★ ★ ★" },
  { id: "bigdipper", name: "Big Dipper", emoji: "🥄", stars: "★ ★ ★ ★\n    ★ ★ ★" },
  { id: "cassiopeia", name: "Cassiopeia", emoji: "👑", stars: "★   ★   ★\n  ★   ★" },
  { id: "leo", name: "Leo", emoji: "🦁", stars: "  ★ ★\n★     ★\n  ★ ★ ★" },
  { id: "scorpius", name: "Scorpius", emoji: "🦂", stars: "★ ★ ★\n★\n★ ★ ★ ★" },
  { id: "cygnus", name: "Cygnus", emoji: "🦢", stars: "  ★\n★ ★ ★\n  ★\n  ★" },
];

type Card = {
  id: string;
  constellationId: string;
  type: "emoji" | "name";
  content: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function StargazingMemory({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  // Pick 4 constellations for the game
  const gameConstellations = useMemo(
    () => shuffleArray(CONSTELLATIONS).slice(0, 4),
    []
  );

  // Create pairs of cards (emoji + name for each constellation)
  const cards = useMemo(() => {
    const cardList: Card[] = [];
    gameConstellations.forEach((c) => {
      cardList.push({
        id: `${c.id}-emoji`,
        constellationId: c.id,
        type: "emoji",
        content: c.emoji,
      });
      cardList.push({
        id: `${c.id}-name`,
        constellationId: c.id,
        type: "name",
        content: c.name,
      });
    });
    return shuffleArray(cardList);
  }, [gameConstellations]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  const allMatched = matched.length === cards.length;

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flipped.length !== 2) return;

    setChecking(true);
    const [first, second] = flipped;
    const card1 = cards.find((c) => c.id === first);
    const card2 = cards.find((c) => c.id === second);

    if (card1 && card2 && card1.constellationId === card2.constellationId) {
      // Match!
      setTimeout(() => {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
        setChecking(false);
      }, 600);
    } else {
      // No match, flip back
      setTimeout(() => {
        setFlipped([]);
        setChecking(false);
      }, 1000);
    }
  }, [flipped, cards]);

  function handleCardClick(cardId: string) {
    if (checking) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;
    if (flipped.length >= 2) return;

    setFlipped((prev) => [...prev, cardId]);
  }

  return (
    <div className="sgm-overlay">
      <div className="sgm-wrap">
        <div className="sgm-sky">
          {/* Twinkling stars background */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="sgm-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="sgm-content">
          <div className="sgm-title">{title ?? "Stargazing"}</div>
          <div className="sgm-subtitle">
            {subtitle ?? "Match the constellations we saw in the desert sky"}
          </div>

          <div className="sgm-grid">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isMatched = matched.includes(card.id);

              return (
                <button
                  key={card.id}
                  className={`sgm-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isMatched}
                >
                  <div className="sgm-card-inner">
                    <div className="sgm-card-front">✨</div>
                    <div className="sgm-card-back">
                      {card.type === "emoji" ? (
                        <span className="sgm-emoji">{card.content}</span>
                      ) : (
                        <span className="sgm-name">{card.content}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="sgm-progress">
            {matched.length / 2} / {cards.length / 2} matched
          </div>

          {allMatched && (
            <div className="sgm-complete">
              <div className="sgm-complete-text">
                The desert sky never looked so beautiful
              </div>
              <button className="sgm-btn" onClick={onDone}>
                Continue under the stars →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
