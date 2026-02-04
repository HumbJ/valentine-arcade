import { useMemo, useState } from "react";

import p1 from "../assets/photos/dates/picnic/01.jpeg";
import p2 from "../assets/photos/dates/picnic/02.jpeg";
import p3 from "../assets/photos/dates/picnic/03.jpeg";
import p4 from "../assets/photos/dates/picnic/04.jpeg";
import p5 from "../assets/photos/dates/picnic/05.jpeg";
import p6 from "../assets/photos/dates/picnic/06.jpeg";
import p7 from "../assets/photos/dates/picnic/07.jpeg";

type BasketItem = { id: string; label: string; emoji: string; note: string };
type Phase = "pack" | "story";

const ITEMS: BasketItem[] = [
  { id: "blanket", label: "Blanket", emoji: "🧺", note: "Cozy first. Always." },
  { id: "strawberries", label: "Strawberries", emoji: "🍓", note: "Elite choice. Obviously." },
  { id: "sandwich", label: "Sandwiches", emoji: "🥪", note: "Fuel for the giggles." },
  { id: "chips", label: "Chips", emoji: "🥔", note: "The crunchy side quest ✅" },
  { id: "drink", label: "Drinks", emoji: "🥤", note: "Hydration, but make it cute." },
  { id: "sweet", label: "Something sweet", emoji: "🍪", note: "Dessert is non-negotiable." },
  { id: "flowers", label: "Flowers", emoji: "💐", note: "A little romance never hurts." },
  { id: "music", label: "Music", emoji: "🎶", note: "Soundtrack: us." },
];

const PHOTOS = [p1, p2, p3, p4, p5, p6, p7];

const CAPTIONS = [
  "A little date, a little sunshine, a lot of us.",
  "The kind of calm that only happens next to you.",
  "Proof we can make anywhere feel like home.",
  "Favorite view? (It wasn't the scenery.)",
  "Small moments that somehow feel huge.",
  "One of those memories I replay on purpose.",
  "Same plan forever: you + me.",
];

export function PicnicDateGate(props: {
  title: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("pack");
  const [note, setNote] = useState("Pick 3 things to pack our basket.");

  const [picked, setPicked] = useState<string[]>([]);
  const pickedSet = useMemo(() => new Set(picked), [picked]);
  const canPickMore = picked.length < 3;

  const [idx, setIdx] = useState(0);

  function togglePick(id: string) {
    if (pickedSet.has(id)) {
      setPicked((prev) => prev.filter((x) => x !== id));
      setNote("Okay okay… swapped. Pick 3 things.");
      return;
    }
    if (!canPickMore) {
      setNote("Basket's full 😌 Tap something again to swap.");
      return;
    }
    const item = ITEMS.find((x) => x.id === id);
    setPicked((prev) => [...prev, id]);
    if (item) setNote(item.note);
  }

  function startStory() {
    setPhase("story");
    setIdx(0);
  }

  function next() {
    if (idx < PHOTOS.length - 1) setIdx((p) => p + 1);
    else props.onDone();
  }

  function prev() {
    if (idx > 0) setIdx((p) => p - 1);
  }

  return (
    <div className="picnic-overlay">
      <div className="picnic-card">
        {/* Header */}
        <div className="picnic-header">
          <div className="picnic-kicker">Mini-Event</div>
          <h2 className="picnic-title">{props.title}</h2>
          {props.subtitle && (
            <div className="picnic-subtitle">{props.subtitle}</div>
          )}
        </div>

        {/* PACK PHASE */}
        {phase === "pack" && (
          <>
            <div className="picnic-note-box">
              <div className="picnic-note">{note}</div>
              <div className="picnic-count">Packed: {picked.length}/3</div>
            </div>

            <div className="picnic-grid">
              {ITEMS.map((it) => {
                const isOn = pickedSet.has(it.id);
                const isDisabled = !isOn && !canPickMore;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => togglePick(it.id)}
                    className={`picnic-item ${isOn ? "picked" : ""} ${isDisabled ? "disabled" : ""}`}
                    aria-pressed={isOn}
                  >
                    <div className="picnic-item-emoji">{it.emoji}</div>
                    <div className="picnic-item-label">{it.label}</div>
                    <div className="picnic-item-status">
                      {isOn ? "Packed ✅" : "Tap to pack"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="picnic-footer">
              <div className="picnic-tip">Tip: you can swap picks anytime.</div>
              <button
                type="button"
                onClick={startStory}
                disabled={picked.length < 3}
                className={`picnic-btn primary ${picked.length < 3 ? "disabled" : ""}`}
              >
                Unpack the memory →
              </button>
            </div>
          </>
        )}

        {/* STORY PHASE */}
        {phase === "story" && (
          <>
            <div className="picnic-photo-frame">
              <img
                src={PHOTOS[idx]}
                alt={`Picnic photo ${idx + 1}`}
                className="picnic-photo"
                loading="lazy"
              />
            </div>

            <div className="picnic-caption">{CAPTIONS[idx]}</div>

            <div className="picnic-controls">
              <button
                type="button"
                onClick={prev}
                disabled={idx === 0}
                className={`picnic-btn ${idx === 0 ? "disabled" : ""}`}
              >
                ← Back
              </button>

              <div className="picnic-counter">
                {idx + 1} / {PHOTOS.length}
              </div>

              <button
                type="button"
                onClick={next}
                className="picnic-btn primary"
              >
                {idx < PHOTOS.length - 1 ? "Next →" : "Finish →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

