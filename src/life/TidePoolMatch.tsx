import { useState, useMemo } from "react";
import "./TidePoolMatch.css";

// Sea creatures for the tide pool matching game
const CREATURES = [
  { id: "starfish", emoji: "⭐", name: "Sea Star" },
  { id: "crab", emoji: "🦀", name: "Crab" },
  { id: "anemone", emoji: "🪸", name: "Anemone" },
  { id: "urchin", emoji: "🟣", name: "Sea Urchin" },
  { id: "hermit", emoji: "🐚", name: "Hermit Crab" },
  { id: "jellyfish", emoji: "🪼", name: "Jellyfish" },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function TidePoolMatch({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  // Pick 4 creatures for the game
  const gameCreatures = useMemo(
    () => shuffleArray(CREATURES).slice(0, 4),
    []
  );

  // Create shuffled lists of emojis and names
  const shuffledEmojis = useMemo(
    () => shuffleArray(gameCreatures.map((c) => ({ id: c.id, emoji: c.emoji }))),
    [gameCreatures]
  );
  const shuffledNames = useMemo(
    () => shuffleArray(gameCreatures.map((c) => ({ id: c.id, name: c.name }))),
    [gameCreatures]
  );

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ emoji: string; name: string } | null>(null);

  const allMatched = matched.length === gameCreatures.length;

  function handleEmojiClick(id: string) {
    if (matched.includes(id)) return;
    setSelectedEmoji(id);
    setWrongPair(null);
  }

  function handleNameClick(id: string) {
    if (matched.includes(id)) return;
    if (!selectedEmoji) return;

    if (selectedEmoji === id) {
      // Match!
      setMatched((prev) => [...prev, id]);
      setLastMatch(id);
      setSelectedEmoji(null);
      setTimeout(() => setLastMatch(null), 800);
    } else {
      // Wrong!
      setWrongPair({ emoji: selectedEmoji, name: id });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedEmoji(null);
      }, 600);
    }
  }

  return (
    <div className="tpm-overlay">
      <div className="tpm-wrap">
        {/* Ocean waves background */}
        <div className="tpm-ocean">
          <div className="tpm-wave wave1" />
          <div className="tpm-wave wave2" />
        </div>

        <div className="tpm-content">
          <div className="tpm-title">{title ?? "Tide Pool Discovery"}</div>
          <div className="tpm-subtitle">
            {subtitle ?? "Match the creatures to their names"}
          </div>

          <div className="tpm-game">
            {/* Emoji column */}
            <div className="tpm-column">
              <div className="tpm-column-label">Creatures</div>
              {shuffledEmojis.map((item) => {
                const isMatched = matched.includes(item.id);
                const isSelected = selectedEmoji === item.id;
                const isWrong = wrongPair?.emoji === item.id;

                return (
                  <button
                    key={item.id}
                    className={`tpm-item emoji ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isWrong ? "wrong" : ""}`}
                    onClick={() => handleEmojiClick(item.id)}
                    disabled={isMatched}
                  >
                    <span className="tpm-emoji">{item.emoji}</span>
                    {isMatched && <span className="tpm-check">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Name column */}
            <div className="tpm-column">
              <div className="tpm-column-label">Names</div>
              {shuffledNames.map((item) => {
                const isMatched = matched.includes(item.id);
                const isWrong = wrongPair?.name === item.id;
                const justMatched = lastMatch === item.id;

                return (
                  <button
                    key={item.id}
                    className={`tpm-item name ${isMatched ? "matched" : ""} ${isWrong ? "wrong" : ""} ${justMatched ? "just-matched" : ""}`}
                    onClick={() => handleNameClick(item.id)}
                    disabled={isMatched}
                  >
                    <span className="tpm-name">{item.name}</span>
                    {isMatched && <span className="tpm-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tpm-progress">
            {matched.length} / {gameCreatures.length} matched
          </div>

          {selectedEmoji && !allMatched && (
            <div className="tpm-hint">Now tap the matching name!</div>
          )}

          {allMatched && (
            <div className="tpm-complete">
              <div className="tpm-complete-text">
                You found all the tide pool friends!
              </div>
              <button className="tpm-btn" onClick={onDone}>
                Back to the beach →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
