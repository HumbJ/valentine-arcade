import { useMemo, useState } from "react";
import type { ReflectionEntry } from "./types";

function formatForSharing(reflections: ReflectionEntry[]) {
  const lines: string[] = [];
  lines.push("Our Little Life — Reflections");
  lines.push("");

  reflections.forEach((r) => {
    lines.push(`• ${r.prompt}`);
    lines.push(r.text);
    lines.push("");
  });

  return lines.join("\n");
}

export function ReflectionReview({
  reflections,
  title,
  closingLine,
  onClose,
}: {
  reflections: ReflectionEntry[];
  title?: string;
  closingLine?: string;
  onClose: () => void;
}) {
  const items = useMemo(() => {
    // newest last feels nicer to “build toward” the end
    return [...reflections].sort((a, b) => a.t - b.t);
  }, [reflections]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = items[idx];
  const canShare = items.length > 0;

  function prev() {
    setFlipped(false);
    setIdx((i) => Math.max(0, i - 1));
  }

  function next() {
    setFlipped(false);
    setIdx((i) => Math.min(items.length - 1, i + 1));
  }

  async function share() {
    const text = formatForSharing(items);

    try {
      if (navigator.share) {
        await navigator.share({
          title: title ?? "Our Little Life — Reflections",
          text,
        });
        return;
      }
    } catch {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard 💗");
    } catch {
      alert("Couldn’t share or copy on this device.");
    }
  }

  return (
    <div className="overlay overlay-fade" role="dialog" aria-modal="true">
      <div className="overlay-card reflection-review card-pop">
        <div className="overlay-title">{title ?? "A note from us"}</div>

        {closingLine ? (
          <p className="story" style={{ marginTop: 12 }}>
            {closingLine}
          </p>
        ) : null}

        {items.length === 0 ? (
          <div className="muted" style={{ marginTop: 14 }}>
            No reflections were written — and that’s okay.
          </div>
        ) : (
          <>
            <div className="rr-progress">
              <span className="rr-count">
                {idx + 1} / {items.length}
              </span>
              <span className="rr-hint">{flipped ? "Tap to see the question" : "Tap to flip"}</span>
            </div>

            <div className="rr-stage">
              <button
                className="ghost rr-nav"
                onClick={prev}
                disabled={idx === 0}
                aria-label="Previous reflection"
              >
                ←
              </button>

              <div
                className={`rr-card ${flipped ? "is-flipped" : ""}`}
                onClick={() => setFlipped((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setFlipped((v) => !v);
                }}
                aria-label="Flip card"
              >
                <div className="rr-card-inner">
                  {/* FRONT */}
                  <div className="rr-face rr-front">
                    <div className="rr-label">Question</div>
                    <div className="rr-prompt">{current.prompt}</div>
                    <div className="rr-tap">Tap to reveal</div>
                  </div>

                  {/* BACK */}
                  <div className="rr-face rr-back">
                    <div className="rr-label">The Feelings Evoked</div>
                    <div className="rr-answer">{current.text}</div>
                    <div className="rr-tap">Tap to go back</div>
                  </div>
                </div>
              </div>

              <button
                className="ghost rr-nav"
                onClick={next}
                disabled={idx === items.length - 1}
                aria-label="Next reflection"
              >
                →
              </button>
            </div>
          </>
        )}

        <div className="reflection-actions">
          <button className="ghost" onClick={onClose}>
            Continue
          </button>

          <button className="btn" onClick={share} disabled={!canShare}>
            Share
          </button>
        </div>

        <div className="muted" style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          Sharing creates a backup outside the app.
        </div>
      </div>
    </div>
  );
}
