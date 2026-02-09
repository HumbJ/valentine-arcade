import { useState, useCallback, useEffect } from "react";
import "./FlowerMatch.css";

type GamePhase = "intro" | "playing" | "complete";

interface Card {
  id: number;
  flowerId: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const FLOWERS = [
  { id: "tulip-red", emoji: "🌷" },
  { id: "tulip-pink", emoji: "🌷" },
  { id: "cherry", emoji: "🌸" },
  { id: "sunflower", emoji: "🌻" },
  { id: "rose", emoji: "🌹" },
  { id: "hibiscus", emoji: "🌺" },
];

export function FlowerMatch({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const totalPairs = FLOWERS.length;

  // Initialize cards
  const initializeCards = useCallback(() => {
    const deck: Card[] = [];
    FLOWERS.forEach((flower, index) => {
      // Add two cards for each flower (a pair)
      deck.push({
        id: index * 2,
        flowerId: flower.id,
        emoji: flower.emoji,
        flipped: false,
        matched: false,
      });
      deck.push({
        id: index * 2 + 1,
        flowerId: flower.id,
        emoji: flower.emoji,
        flipped: false,
        matched: false,
      });
    });

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
  }, []);

  // Handle card flip
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return; // Already checking two cards
    if (flippedCards.includes(cardId)) return; // Card already flipped
    const card = cards.find((c) => c.id === cardId);
    if (card?.matched) return; // Card already matched

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      // Check for match
      const card1 = cards.find((c) => c.id === newFlipped[0]);
      const card2 = cards.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.flowerId === card2.flowerId) {
        // Match found!
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === newFlipped[0] || c.id === newFlipped[1] ? { ...c, matched: true } : c
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check if game is won
  useEffect(() => {
    if (matches === totalPairs && matches > 0) {
      setTimeout(() => {
        setPhase("complete");
      }, 800);
    }
  }, [matches, totalPairs]);

  // Start game
  const startGame = () => {
    setPhase("playing");
    setMoves(0);
    setMatches(0);
    setFlippedCards([]);
    initializeCards();
  };

  return (
    <div className="fm-overlay">
      <div className="fm-wrap">
        <div className="fm-content">
          <div className="fm-title">{title ?? "Flower Match"}</div>
          <div className="fm-subtitle">
            {subtitle ?? "Match pairs of flowers!"}
          </div>

          {phase === "intro" && (
            <div className="fm-intro">
              <div className="fm-intro-text">
                Walking through endless rows of tulips... Let's see if you can
                match all the flowers!
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Flip two cards at a time
                <br />
                • Match identical flowers
                <br />• Find all {totalPairs} pairs!
              </div>
              <button className="fm-btn primary" onClick={startGame}>
                Start matching! 🌸
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="fm-playing">
              <div className="fm-stats">
                <div className="fm-stat">
                  <span className="fm-stat-label">Moves:</span>
                  <span className="fm-stat-value">{moves}</span>
                </div>
                <div className="fm-stat">
                  <span className="fm-stat-label">Matches:</span>
                  <span className="fm-stat-value">{matches} / {totalPairs}</span>
                </div>
              </div>

              <div className="fm-grid">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    className={`fm-card ${
                      flippedCards.includes(card.id) || card.matched ? "flipped" : ""
                    } ${card.matched ? "matched" : ""}`}
                    onClick={() => handleCardClick(card.id)}
                    disabled={flippedCards.includes(card.id) || card.matched}
                  >
                    <div className="fm-card-inner">
                      <div className="fm-card-front">?</div>
                      <div className="fm-card-back">{card.emoji}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="fm-complete">
              <div className="fm-complete-emoji">🌸✨</div>
              <div className="fm-final-score">
                All matches found in {moves} moves!
              </div>
              <div className="fm-complete-text">
                {moves <= totalPairs + 3
                  ? "Incredible memory! Those flower fields left quite an impression! 🌷"
                  : moves <= totalPairs + 8
                  ? "Great job! You really know your flowers! 🌻"
                  : "All matched! The flower fields were unforgettable! 🌺"}
              </div>
              <button className="fm-btn primary" onClick={onDone}>
                Back to the adventure →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
