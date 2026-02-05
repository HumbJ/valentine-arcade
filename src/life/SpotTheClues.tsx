import { useState, useCallback, useEffect } from "react";
import "./SpotTheClues.css";

type GamePhase = "intro" | "searching" | "result" | "complete";

// Mystery clues to find
const CLUE_SETS = [
  { emoji: "🔍", text: "A torn photograph under the desk" },
  { emoji: "🗝️", text: "An old key taped behind the frame" },
  { emoji: "📜", text: "A cryptic note in the margins" },
  { emoji: "🕯️", text: "Fresh candle wax on the windowsill" },
];

export function SpotTheClues({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [foundClues, setFoundClues] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [clueRevealed, setClueRevealed] = useState(false);

  const totalClues = 3;
  const clues = CLUE_SETS.slice(0, totalClues);

  // Start the game
  const startGame = () => {
    setPhase("searching");
    setCurrentClueIndex(0);
    setFoundClues(0);
    // Show first clue after a moment
    setTimeout(() => {
      setShowClue(true);
    }, 500);
  };

  // Found a clue!
  const handleSpotClue = useCallback(() => {
    if (!showClue || clueRevealed) return;

    setClueRevealed(true);
    setFoundClues((prev) => prev + 1);

    // Move to next clue or finish
    setTimeout(() => {
      if (currentClueIndex + 1 >= totalClues) {
        setPhase("result");
      } else {
        setCurrentClueIndex((prev) => prev + 1);
        setShowClue(false);
        setClueRevealed(false);
        // Show next clue
        setTimeout(() => {
          setShowClue(true);
        }, 800);
      }
    }, 1000);
  }, [showClue, clueRevealed, currentClueIndex, totalClues]);

  // Auto-hide clue after 5 seconds if not spotted
  useEffect(() => {
    if (phase === "searching" && showClue && !clueRevealed) {
      const timer = setTimeout(() => {
        // Missed this clue, move to next
        if (currentClueIndex + 1 >= totalClues) {
          setPhase("result");
        } else {
          setCurrentClueIndex((prev) => prev + 1);
          setShowClue(false);
          setTimeout(() => {
            setShowClue(true);
          }, 800);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [phase, showClue, clueRevealed, currentClueIndex, totalClues]);

  const currentClue = clues[currentClueIndex];

  return (
    <div className="stc-overlay">
      <div className="stc-wrap">
        <div className="stc-content">
          <div className="stc-title">{title ?? "Spot the Clues"}</div>
          <div className="stc-subtitle">
            {subtitle ?? "Find the hidden clues before they disappear"}
          </div>

          {phase === "intro" && (
            <div className="stc-intro">
              <div className="stc-intro-text">
                A mystery is unfolding. Clues will appear briefly—tap "Spot It!" before they vanish.
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Watch for clues to appear
                <br />
                • Tap the button quickly when you see one
                <br />
                • Find as many as you can!
              </div>
              <button className="stc-btn primary" onClick={startGame}>
                Start investigating 🔍
              </button>
            </div>
          )}

          {phase === "searching" && (
            <div className="stc-searching">
              <div className="stc-progress">
                Clues found: {foundClues} / {totalClues}
              </div>

              <div className={`stc-clue-zone ${showClue ? "visible" : ""} ${clueRevealed ? "found" : ""}`}>
                {currentClue && (
                  <>
                    <div className="stc-clue-emoji">{currentClue.emoji}</div>
                    <div className="stc-clue-text">{currentClue.text}</div>
                  </>
                )}
              </div>

              {showClue && !clueRevealed && (
                <button className="stc-spot-btn" onClick={handleSpotClue}>
                  Spot It! 👀
                </button>
              )}

              {clueRevealed && (
                <div className="stc-found-msg">Found! ✓</div>
              )}
            </div>
          )}

          {phase === "result" && (
            <div className="stc-result">
              <div className={`stc-result-icon ${foundClues >= 2 ? "success" : "fail"}`}>
                {foundClues >= 2 ? "✓" : "!"}
              </div>
              <div className="stc-result-text">
                {foundClues === totalClues
                  ? "You spotted every clue! The mystery is solved."
                  : foundClues >= 2
                  ? "You found enough clues to piece it together!"
                  : "Some clues slipped away... but we got the gist."}
              </div>
              <button className="stc-btn primary" onClick={onDone}>
                Case closed →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
