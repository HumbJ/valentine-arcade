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
  "Favorite view? (It wasn’t the scenery.)",
  "Small moments that somehow feel huge.",
  "One of those memories I replay on purpose.",
  "Same plan forever: you + me.",
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
      setNote("Basket’s full 😌 Tap something again to swap.");
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
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="rounded-3xl border bg-white p-6">
        <div className="mb-4">
          <div className="text-sm text-[var(--warm-gray)]">Mini-Event</div>
          <h2 className="text-2xl font-semibold">{props.title}</h2>
          {props.subtitle && (
            <div className="mt-1 text-sm text-[var(--warm-gray)]">{props.subtitle}</div>
          )}
        </div>

        {phase === "pack" && (
          <>
            <div className="mb-4 rounded-2xl border bg-[var(--cream)] p-4 text-sm text-[var(--warm-gray)]">
              {note}
              <div className="mt-2 text-xs opacity-80">Packed: {picked.length}/3</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ITEMS.map((it) => {
                const isOn = pickedSet.has(it.id);
                const isDisabled = !isOn && !canPickMore;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => togglePick(it.id)}
                    className={cx(
                      "rounded-2xl border p-3 text-left transition",
                      isOn && "border-[var(--beige)] bg-[var(--beige)]/40",
                      !isOn && "bg-white hover:bg-[var(--cream)]",
                      isDisabled && "opacity-50"
                    )}
                    aria-pressed={isOn}
                  >
                    <div className="text-xl">{it.emoji}</div>
                    <div className="mt-1 text-sm font-medium">{it.label}</div>
                    <div className="text-xs text-[var(--warm-gray)]">
                      {isOn ? "Packed ✅" : "Tap to pack"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-[var(--warm-gray)]">Tip: you can swap picks anytime.</div>
              <button
                type="button"
                onClick={startStory}
                disabled={picked.length < 3}
                className={cx(
                  "rounded-2xl px-4 py-2 text-sm font-medium transition",
                  picked.length < 3
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "bg-[var(--beige)] text-[var(--warm-gray)] hover:opacity-90"
                )}
              >
                Unpack the memory →
              </button>
            </div>
          </>
        )}

        {phase === "story" && (
          <>
            <div className="overflow-hidden rounded-2xl border bg-[var(--cream)]">
              <img
                src={PHOTOS[idx]}
                alt={`Picnic photo ${idx + 1}`}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="mt-3 text-sm text-[var(--warm-gray)]">{CAPTIONS[idx]}</div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={idx === 0}
                className={cx(
                  "rounded-2xl border px-4 py-2 text-sm transition",
                  idx === 0 ? "cursor-not-allowed opacity-40" : "hover:bg-[var(--cream)]"
                )}
              >
                ← Back
              </button>

              <div className="text-xs text-[var(--warm-gray)]">
                {idx + 1} / {PHOTOS.length}
              </div>

              <button
                type="button"
                onClick={next}
                className="rounded-2xl bg-[var(--beige)] px-4 py-2 text-sm font-medium text-[var(--warm-gray)] hover:opacity-90"
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
