import { useMemo, useState, useEffect, useRef } from "react";
import { MEMORIES, type MemoryItem } from "./memories";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function titleForDeck(deck: string) {
  const map: Record<string, string> = {
    disneyland: "Disneyland ✨",

    seattle1_threshold: "Seattle Trip I 🌲",
    seattle1_arrival: "Seattle Trip I — Arrival",
    seattle1_explore: "Seattle Trip I — Exploring",
    seattle1_food: "Seattle Trip I — Food Break",
    seattle1_quiet: "Seattle Trip I — The Museum",
    seattle1_reflect: "Seattle Trip I — Afterglow",
    seattle1_closing: "Seattle Trip I — What we’ll remember",
    cozy_stay: "A Cozy Night In — Morning After",
    picnic_date: "Picnic Date 🧺",



  };

  return map[deck] ?? "Memory ✨";
}

export function MemoryBurst({
  deck,
  pick,               // optional: if provided, we’ll show only a subset
  onDone,
}: {
  deck: string;
  pick?: number;
  onDone: () => void;
}) {
  const items = useMemo(() => {
    const all = MEMORIES[deck] ?? [];
    if (all.length === 0) return [];

    // If pick is provided, show a shuffled subset. Otherwise show everything.
    if (pick && pick > 0 && pick < all.length) {
      return shuffle(all).slice(0, pick);
    }

    return all;
  }, [deck, pick]);

  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const current: MemoryItem | undefined = items[idx];

  const canBack = idx > 0;
  const canNext = idx < items.length - 1;

  function next() {
    if (canNext && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx((i) => i + 1);
        setIsTransitioning(false);
      }, 150);
    }
  }

  function back() {
    if (canBack && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx((i) => i - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") back();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idx, items.length]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) next(); // Swipe left -> next
      else back(); // Swipe right -> back
    }
  };

  // Click on left/right sides of photo
  const handleFrameClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) back();
    else if (x > (2 * width) / 3) next();
  };

  // If deck is empty (or wrong key), just close gracefully
  if (!current) {
    return (
      <div className="mem-overlay" onClick={onDone}>
        <div className="mem-stage" onClick={(e) => e.stopPropagation()}>
          <div className="mem-title">Memory</div>
          <div className="mem-empty">
            I couldn’t find anything in the “{deck}” deck.
          </div>
          <button className="mem-btn primary" onClick={onDone}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mem-overlay" onClick={onDone}>
      <div className="mem-stage" onClick={(e) => e.stopPropagation()}>
        <div className="mem-title">{titleForDeck(deck)}
</div>

        <div
          className={`mem-frame ${isTransitioning ? "mem-frame-transitioning" : ""}`}
          onClick={handleFrameClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: "pointer" }}
        >
          {current.type === "photo" ? (
            <img src={current.src} alt={current.caption ?? current.id} className="mem-photo" />
          ) : (
            <video
              src={current.src}
              autoPlay
              playsInline
              loop={current.loop ?? true}
              muted={current.muted ?? true}
              controls
              preload="metadata"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Navigation hints */}
          {canBack && (
            <div className="mem-nav-hint mem-nav-left">
              <span>←</span>
            </div>
          )}
          {canNext && (
            <div className="mem-nav-hint mem-nav-right">
              <span>→</span>
            </div>
          )}
        </div>

        {/* Progress dots */}
        {items.length > 1 && (
          <div className="mem-progress-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`mem-dot ${i === idx ? "active" : ""}`}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setIdx(i);
                      setIsTransitioning(false);
                    }, 150);
                  }
                }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {current.caption ? <div className="mem-caption">{current.caption}</div> : null}

        <div className="mem-controls">
          <button className="mem-btn" onClick={back} disabled={!canBack}>
            ← Back
          </button>

          <div className="mem-counter">
            {idx + 1} / {items.length}
          </div>

          {canNext ? (
            <button className="mem-btn primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="mem-btn primary" onClick={onDone}>
              Done 💗
            </button>
          )}
        </div>

        <div className="mem-hint">Tap outside to close</div>
      </div>
    </div>
  );
}
