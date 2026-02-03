import { useEffect, useMemo, useState } from "react";
import { applyEffects, getEventById } from "../life/engine";
import { defaultSave, loadSave, persistSave, resetSave } from "../life/save";
import { MemoryBurst } from "../life/MemoryBurst";
import type { Effect } from "../life/types";
import { JigsawGate } from "../life/JigsawGate";
import { PLACES } from "../life/places";
import { MapDiscoverGate } from "../life/MapDiscoverGate";
import { FOOD_GAMES } from "../life/foodGames";
import { FoodOrderGate } from "../life/FoodOrderGate";
import { ReflectionGate } from "../life/ReflectionGate";
import type { ReflectionEntry } from "../life/types";
import { ReflectionReview } from "../life/ReflectionReview";
import { EndCreditsOverlay } from "../life/EndCreditsOverlay";




export function LifePage() {
  const [save, setSave] = useState(() => loadSave());

  const [toast, setToast] = useState<string | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
  const [burst, setBurst] = useState<null | { deck: string; pick?: number }>(null);
  const [pendingEffects, setPendingEffects] = useState<Effect[] | null>(null);

  const [puzzle, setPuzzle] = useState<null | { imageSrc: string; rows?: number; cols?: number; title?: string }>(null);
  const [pendingAfterPuzzle, setPendingAfterPuzzle] = useState<Effect[] | null>(null);

  const [mapGate, setMapGate] = useState<null | { mapId: string; title?: string; subtitle?: string }>(null);
  const [pendingAfterMap, setPendingAfterMap] = useState<Effect[] | null>(null);

  const [foodGate, setFoodGate] = useState<null | { gameId: string; title?: string; subtitle?: string }>(null);
  const [pendingAfterFood, setPendingAfterFood] = useState<Effect[] | null>(null);
  const [reflectionGate, setReflectionGate] = useState<null | {
  id: string;
  prompt: string;
  arc?: string;
  title?: string;
  subtitle?: string;
}>(null);

const [reviewGate, setReviewGate] = useState<null | {
  title?: string;
  closingLine?: string;
}>(null);

const [pendingAfterReview, setPendingAfterReview] = useState<Effect[] | null>(null);

const [pendingAfterReflection, setPendingAfterReflection] = useState<Effect[] | null>(null);

  const [reward, setReward] = useState<null | { title: string; lines: string[] }>(null);

  const event = useMemo(() => getEventById(save.currentEventId), [save.currentEventId]);

  function showRewardsFromEffects(effects: Effect[]) {
    const shouldShow = effects.some(
      (e) => e.type === "unlockPlace" || (e.type === "stat" && e.key === "memories")
    );
    if (!shouldShow) return;

    const stat: Partial<Record<"love" | "happiness" | "memories", number>> = {};
    const unlocked: string[] = [];

    for (const e of effects) {
      if (e.type === "stat") {
        // If your Effect typing currently has key: string, this line will error.
        // Fix properly in src/life/types.ts to key: "love"|"happiness"|"memories".
        const k = e.key as "love" | "happiness" | "memories";
        stat[k] = (stat[k] ?? 0) + e.delta;
      }
      if (e.type === "unlockPlace") unlocked.push(e.placeId);
    }

    const lines: string[] = [];

    (["love", "happiness", "memories"] as const).forEach((key) => {
      const d = stat[key];
      if (!d) return;
      const label = key === "love" ? "Love" : key === "happiness" ? "Happiness" : "Memories";
      const sign = d > 0 ? "+" : "";
      lines.push(`${sign}${d} ${label}`);
    });

    if (unlocked.length) {
      const map = new Map(PLACES.map((p) => [p.id, p]));
      unlocked.forEach((id) => {
        const p = map.get(id);
        lines.push(`Unlocked: ${p ? `${p.emoji} ${p.title}` : id}`);
      });
    }

    if (lines.length) setReward({ title: "Rewards earned 💝", lines });
  }
  // When we arrive at the end event, show the finale overlay once per session.
useEffect(() => {
  if (save.currentEventId === "end") setShowFinale(true);
}, [save.currentEventId]);


  function runEffects(effects: Effect[]) {
    // 1) Map gate
    const mapEff = effects.find(
      (e): e is Extract<Effect, { type: "mapDiscover" }> => e.type === "mapDiscover"
    );
    if (mapEff) {
      setMapGate({ mapId: mapEff.mapId, title: mapEff.title, subtitle: mapEff.subtitle });
      setPendingAfterMap(effects.filter((e) => e.type !== "mapDiscover"));
      return;
    }

    // 2) Food gate
    const foodEff = effects.find(
      (e): e is Extract<Effect, { type: "foodOrder" }> => e.type === "foodOrder"
    );
    if (foodEff) {
      setFoodGate({ gameId: foodEff.gameId, title: foodEff.title, subtitle: foodEff.subtitle });
      setPendingAfterFood(effects.filter((e) => e.type !== "foodOrder"));
      return;
    }

    // 3) Reflection gate intercept
const reflEff = effects.find(
  (e): e is Extract<Effect, { type: "reflectionPrompt" }> => e.type === "reflectionPrompt"
);
if (reflEff) {
  setReflectionGate({
    id: reflEff.id,
    prompt: reflEff.prompt,
    arc: reflEff.arc,
    title: reflEff.title,
    subtitle: reflEff.subtitle,
  });
  setPendingAfterReflection(effects.filter((e) => e.type !== "reflectionPrompt"));
  return;
}

const reviewEff = effects.find(
  (e): e is Extract<Effect, { type: "reflectionReview" }> => e.type === "reflectionReview"
);

if (reviewEff) {
  setReviewGate({
    title: reviewEff.title,
    closingLine: reviewEff.closingLine,
  });
  setPendingAfterReview(effects.filter((e) => e.type !== "reflectionReview"));
  return;
}

    // 4) Puzzle gate
    const puzzleEff = effects.find(
      (e): e is Extract<Effect, { type: "puzzle" }> => e.type === "puzzle"
    );
    if (puzzleEff) {
      setPuzzle({
        imageSrc: puzzleEff.imageSrc,
        rows: puzzleEff.rows,
        cols: puzzleEff.cols,
        title: puzzleEff.title,
      });
      setPendingAfterPuzzle(effects.filter((e) => e.type !== "puzzle"));
      return;
    }

    // 5) Burst gate
    const burstEff = effects.find(
      (e): e is Extract<Effect, { type: "burst" }> => e.type === "burst"
    );
    if (burstEff) {
      setBurst({ deck: burstEff.deck, pick: burstEff.pick });
      setPendingEffects(effects.filter((e) => e.type !== "burst"));
      return;
    }

    // 6) Apply
   setSave((prev: typeof save) => {
  const next = applyEffects(prev, effects);
  persistSave(next);
  return next;
});
showRewardsFromEffects(effects);
  }

  function appendReflection(entry: ReflectionEntry) {
  setSave((prev: typeof save) => {
    const next = {
      ...prev,
      reflections: [...(prev.reflections ?? []), entry],
    };
    persistSave(next);
    return next;
  });
}


  function choose(choiceId: string) {
    const ev: any = event;
    const choice = ev?.choices?.find((c: any) => c.id === choiceId);
    if (!choice) return;

    // Restart special case
    const goesToStart = choice.effects?.some(
      (e: any) => e.type === "goto" && e.eventId === "start"
    );

    if (goesToStart) {
      setToast("Reliving it from the start 💗");
      setRestarting(true);
      setProgress(0);

      const totalMs = 2200;
      const stepMs = 40;
      const steps = Math.ceil(totalMs / stepMs);
      let i = 0;

      const timer = window.setInterval(() => {
        i += 1;
        setProgress(Math.min(100, Math.round((i / steps) * 100)));

        if (i >= steps) {
          window.clearInterval(timer);

          resetSave();
          const fresh = defaultSave();
          setSave(fresh);
          persistSave(fresh);

          setTimeout(() => {
            setRestarting(false);
            setToast(null);
            setProgress(0);
          }, 250);
        }
      }, stepMs);

      return;
    }

    runEffects(choice.effects as Effect[]);
  }

  function finishBurst() {
    setBurst(null);
    if (!pendingEffects) return;
    const rest = pendingEffects;
    setPendingEffects(null);
    runEffects(rest);
  }

  function finishPuzzle() {
    setPuzzle(null);
    if (!pendingAfterPuzzle) return;
    const rest = pendingAfterPuzzle;
    setPendingAfterPuzzle(null);
    runEffects(rest);
  }

  function finishMapGate() {
    setMapGate(null);
    if (!pendingAfterMap) return;
    const rest = pendingAfterMap;
    setPendingAfterMap(null);
    runEffects(rest);
  }

  function finishReflectionSkip() {
  setReflectionGate(null);
  if (!pendingAfterReflection) return;

  const rest = pendingAfterReflection;
  setPendingAfterReflection(null);
  runEffects(rest);
}

function finishReflectionSave(text: string) {
  if (!reflectionGate) return;

  appendReflection({
    id: reflectionGate.id,
    arc: reflectionGate.arc,
    prompt: reflectionGate.prompt,
    text,
    t: Date.now(),
  });

  setReflectionGate(null);
  if (!pendingAfterReflection) return;

  const rest = pendingAfterReflection;
  setPendingAfterReflection(null);
  runEffects(rest);
}

  function finishFoodGate() {
    setFoodGate(null);
    if (!pendingAfterFood) return;
    const rest = pendingAfterFood;
    setPendingAfterFood(null);
    runEffects(rest);
  }

  function finishReviewGate() {
  setReviewGate(null);
  if (!pendingAfterReview) return;

  const rest = pendingAfterReview;
  setPendingAfterReview(null);
  runEffects(rest);
}

  const ev: any = event;

  return (
    <div className="screen">
      {toast && <div className="toast">{toast}</div>}

      <header className="topbar">
        <div>
          <div className="kicker">Our Little Life</div>
          <h1 className="title">{ev?.title ?? "…"}</h1>

          {restarting && (
            <div className="overlay">
              <div className="overlay-card">
                <div className="overlay-title">Restarting…</div>
                <div className="overlay-sub">{toast}</div>

                <div className="overlay-bar">
                  <div className="overlay-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="overlay-hint">{progress}%</div>
              </div>
            </div>
          )}

          {reward && (
            <div className="overlay" role="dialog" aria-modal="true">
              <div className="overlay-card reward-card">
                <div className="overlay-title">{reward.title}</div>

                <ul className="reward-list">
                  {reward.lines.map((l, i) => (
                    <li key={i} className="reward-line">
                      {l}
                    </li>
                  ))}
                </ul>

                <button className="btn" onClick={() => setReward(null)}>
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="ghost"
          onClick={() => {
            resetSave();
            const fresh = defaultSave();
            setSave(fresh);
            persistSave(fresh);
          }}
          title="Reset progress"
        >
          Reset
        </button>
      </header>

      <section className="stats">
        <div className="stat">
          <div className="stat-label">Love</div>
          <div className="bar">
            <div className="fill" style={{ width: `${save.stats.love}%` }} />
          </div>
          <div className="stat-val">{save.stats.love}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Happiness</div>
          <div className="bar">
            <div className="fill" style={{ width: `${save.stats.happiness}%` }} />
          </div>
          <div className="stat-val">{save.stats.happiness}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Memories</div>
          <div className="stat-val">{save.stats.memories}</div>
        </div>
      </section>

      <section className="card">
        <p className="story">{ev?.text ?? ""}</p>

        <div className="choices">
          {(ev?.choices ?? []).map((c: any) => (
            <button key={c.id} className="choice" onClick={() => choose(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-title">Recent moments</div>
        {save.log.length === 0 ? (
          <div className="muted">Your story will appear here as you play.</div>
        ) : (
          <ul className="log">
            {save.log.slice(0, 8).map((l: { t: number; text: string }) => (
              <li key={l.t}>{l.text}</li>
            ))}
          </ul>
        )}
      </section>

      {burst && <MemoryBurst deck={burst.deck} pick={burst.pick} onDone={finishBurst} />}

      {puzzle && (
        <JigsawGate
          imageSrc={puzzle.imageSrc}
          rows={puzzle.rows}
          cols={puzzle.cols}
          title={puzzle.title}
          onSolved={finishPuzzle}
          onClose={() => {
            setPuzzle(null);
            setPendingAfterPuzzle(null);
          }}
        />
      )}

      {mapGate && (
        <MapDiscoverGate
          mapId={mapGate.mapId}
          title={mapGate.title}
          subtitle={mapGate.subtitle}
          onSolved={finishMapGate}
          onClose={() => {
            setMapGate(null);
            setPendingAfterMap(null);
          }}
        />
      )}

      {foodGate && (() => {
  console.log("foodGate:", foodGate);
  const game = FOOD_GAMES[foodGate.gameId];
  console.log("foodGame found?", !!game, "keys:", Object.keys(FOOD_GAMES));
  if (!game) return null;

  return (
    <FoodOrderGate
      game={game}
      title={foodGate.title}
      subtitle={foodGate.subtitle}
      onDone={finishFoodGate}
    />
  );
})()}

{reflectionGate && (
  <ReflectionGate
    title={reflectionGate.title}
    subtitle={reflectionGate.subtitle}
    prompt={reflectionGate.prompt}
    onSkip={finishReflectionSkip}
    onSave={finishReflectionSave}
  />
)}
{reviewGate && (
  <ReflectionReview
    reflections={save.reflections ?? []}
    title={reviewGate.title}
    closingLine={reviewGate.closingLine}
    onClose={finishReviewGate}
  />
)}

{showFinale && (
  <EndCreditsOverlay
    line={`Somewhere along the way, this trip changed “me” into “us.”`}
    onDone={() => setShowFinale(false)}
  />
)}

    </div>
  );
  
}
