// src/life/FoodOrderGate.tsx
import { useMemo, useState } from "react";
import type { FoodGame } from "./foodGames";

function arrayMove<T>(arr: T[], from: number, to: number) {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function sameOrder(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function FoodOrderGate({
  game,
  title,
  subtitle,
  onDone,
}: {
  game: FoodGame;
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const initial = useMemo(() => {
    // Start shuffled but stable-ish: reverse is “soft” and deterministic.
    // If you want real shuffle later, we can add seeded shuffle.
    return game.items.map((x) => x.id).slice().reverse();
  }, [game.items]);

  const [order, setOrder] = useState<string[]>(initial);
  const [status, setStatus] = useState<"idle" | "nope" | "ok">("idle");
    const [stage, setStage] = useState<"play" | "reward">("play");

  

  const itemsById = useMemo(() => {
    const m = new Map(game.items.map((x) => [x.id, x]));
    return m;
  }, [game.items]);

  const acceptable = game.validOrders ?? [game.correctOrder];
  const solved = acceptable.some((ord) => sameOrder(order, ord));


  function check() {
    if (solved) {
      setStatus("ok");

      // If there’s a reward moment, show it first (earned).
      if (game.reward) {
        setTimeout(() => setStage("reward"), 350);
        return;
      }

      // Otherwise continue normally
      setTimeout(onDone, 350);
    } else {
      setStatus("nope");
      setTimeout(() => setStatus("idle"), 600);
    }
  }

  // Drag reorder (desktop) + Up/Down buttons (mobile-friendly)
  const [draggingId, setDraggingId] = useState<string | null>(null);
    if (stage === "reward" && game.reward) {
    return (
      <div className="overlay" role="dialog" aria-modal="true">
        <div className="overlay-card food-reward-card">
          <div className="overlay-title">{game.reward.title}</div>

          <div className="food-reward-media">
            <img
              src={game.reward.src}
              alt={game.reward.title}
              className="food-reward-img"
              draggable={false}
            />
          </div>

          <p className="food-reward-body">{game.reward.body}</p>

          <button className="btn" onClick={onDone}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="fog-root">
    <div className={`fog-card ${status === "nope" ? "fog-shake" : ""}`}>
        <div className="fog-head">
          <div className="fog-title">{title ?? game.title}</div>
          <div className="fog-sub">{subtitle ?? game.subtitle}</div>
        </div>

        <div className="fog-list">
          {order.map((id, idx) => {
            const it = itemsById.get(id);
            if (!it) return null;

            return (
              <div
                key={id}
                className={`fog-row ${draggingId === id ? "fog-dragging" : ""}`}
                draggable
                onDragStart={() => setDraggingId(id)}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!draggingId || draggingId === id) return;
                  const from = order.indexOf(draggingId);
                  const to = order.indexOf(id);
                  setOrder(arrayMove(order, from, to));
                  setDraggingId(null);
                }}
              >
                <div className="fog-thumb">
                  <img src={it.src} alt={it.label ?? it.id} />
                </div>

                <div className="fog-meta">
                  <div className="fog-caption">
                    {it.label ?? " "}
                  </div>
                </div>

                <div className="fog-controls">
                  <button
                    className="fog-btn"
                    onClick={() => idx > 0 && setOrder(arrayMove(order, idx, idx - 1))}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="fog-btn"
                    onClick={() =>
                      idx < order.length - 1 && setOrder(arrayMove(order, idx, idx + 1))
                    }
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fog-foot">
          <button className="fog-primary" onClick={check}>
            {solved ? "Perfect — continue" : "Check"}
          </button>
          <div className="fog-hint">
            Tip: rename files like <code>s1_food_01.jpg</code> to set the timeline.
          </div>
        </div>
      </div>
    </div>
  );
}
