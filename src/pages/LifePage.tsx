import { useMemo, useState } from "react";
import { applyEffects, getEventById } from "../life/engine";
import { defaultSave, loadSave, persistSave, resetSave } from "../life/save";
import { MemoryBurst } from "../life/MemoryBurst";
import type { Effect } from "../life/types";
import { JigsawGate } from "../life/JigsawGate";



export function LifePage() {
  const [save, setSave] = useState(() => loadSave());
  const [toast, setToast] = useState<string | null>(null);
const [restarting, setRestarting] = useState(false);
const [progress, setProgress] = useState(0);
const [burst, setBurst] = useState<null | { deck: string; pick?: number }>(null);
const [pendingEffects, setPendingEffects] = useState<null | any[]>(null);
const [puzzle, setPuzzle] = useState<null | { imageSrc: string; rows?: number; cols?: number; title?: string }>(null);
const [pendingAfterPuzzle, setPendingAfterPuzzle] = useState<null | Effect[]>(null);


  const event = useMemo(() => getEventById(save.currentEventId), [save.currentEventId]);

  function choose(choiceId: string) {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return;

  // 1) FULL RESTART behavior (your existing "back to start" flow)
  const goesToStart = choice.effects.some(
    (e: any) => e.type === "goto" && e.eventId === "start"
  );

  if (goesToStart) {
    // Show your restart overlay + loading
    setToast("Reliving it from the start 💗");
    setRestarting(true);
    setProgress(0);

    const totalMs = 2200; // adjust for how long the "loading" lasts
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
const puzzleEff = choice.effects.find(
  (e): e is Extract<Effect, { type: "puzzle" }> => e.type === "puzzle"
);

if (puzzleEff) {
  setPuzzle({
    imageSrc: puzzleEff.imageSrc,
    rows: puzzleEff.rows,
    cols: puzzleEff.cols,
    title: puzzleEff.title,
  });

  setPendingAfterPuzzle(choice.effects.filter((e) => e.type !== "puzzle"));
  return;
}

  // 2) MEMORY BURST behavior (show burst first, then apply effects)
  const burstEff = choice.effects.find(
  (e): e is Extract<Effect, { type: "burst" }> => e.type === "burst"
);

if (burstEff) {
  setBurst({
    deck: burstEff.deck,
    pick: burstEff.pick,
  });

  setPendingEffects(choice.effects.filter((e) => e.type !== "burst"));
  return;
}


  // 3) Normal effects
  const next = applyEffects(save, choice.effects as any);
  setSave(next);
  persistSave(next);
}
function finishBurst() {
  if (!pendingEffects) {
    setBurst(null);
    return;
  }

  const next = applyEffects(save, pendingEffects as any);
  setSave(next);
  persistSave(next);

  setPendingEffects(null);
  setBurst(null);
}

function finishPuzzle() {
  if (!pendingAfterPuzzle) {
    setPuzzle(null);
    return;
  }

  // If the remaining effects include a burst, show it next (and delay apply)
  const burstEff = pendingAfterPuzzle.find(
    (e): e is Extract<Effect, { type: "burst" }> => e.type === "burst"
  );

  if (burstEff) {
    setBurst({ deck: burstEff.deck, pick: burstEff.pick });
    setPendingEffects(pendingAfterPuzzle.filter((e) => e.type !== "burst"));
    setPendingAfterPuzzle(null);
    setPuzzle(null);
    return;
  }

  // Otherwise apply remaining effects immediately
  const next = applyEffects(save, pendingAfterPuzzle as any);
  setSave(next);
  persistSave(next);

  setPendingAfterPuzzle(null);
  setPuzzle(null);
}


  return (
    <div className="screen">
        {toast && <div className="toast">{toast}</div>}
      <header className="topbar">
        <div>
          <div className="kicker">Our Little Life</div>
          <h1 className="title">{event.title}</h1>
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
          <div className="bar"><div className="fill" style={{ width: `${save.stats.love}%` }} /></div>
          <div className="stat-val">{save.stats.love}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Happiness</div>
          <div className="bar"><div className="fill" style={{ width: `${save.stats.happiness}%` }} /></div>
          <div className="stat-val">{save.stats.happiness}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Memories</div>
          <div className="stat-val">{save.stats.memories}</div>
        </div>
      </section>

      <section className="card">
        <p className="story">{event.text}</p>

        <div className="choices">
          {event.choices.map((c) => (
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
      {burst && (
  <MemoryBurst
    deck={burst.deck}
    pick={burst.pick}
    onDone={finishBurst}
  />
)}
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

    </div>
  );
}

