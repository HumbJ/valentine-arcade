import { useEffect, useState } from "react";
import { loadSave } from "../life/save";
import { PLACES } from "../life/places";
import { MemoryBurst } from "../life/MemoryBurst";

export function MapPage() {
  const [save, setSave] = useState(() => loadSave());
const [burst, setBurst] = useState<null | { deck: string; pick?: number }>(null);


  useEffect(() => {
    // refresh when page mounts
    setSave(loadSave());

    // refresh if user comes back to tab/window
    const onFocus = () => setSave(loadSave());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const unlocked = new Set(save.placesUnlocked ?? []);

  return (
  <div className="screen">
    <header className="topbar">
      <div>
        <div className="kicker">Adventure</div>
        <h1 className="title">Map</h1>
        <div className="muted">Places you’ve unlocked so far 💗</div>
      </div>
    </header>

    <section className="card">
      <div className="map-grid">
        {PLACES.map((p) => {
          const isUnlocked = unlocked.has(p.id);

          return (
            <button
              key={p.id}
              type="button"
              className={`map-card ${isUnlocked ? "unlocked" : "locked"}`}
              disabled={!isUnlocked}
              onClick={() => setBurst({ deck: p.id })}
              title={isUnlocked ? "Tap to relive" : "Locked"}
            >
              <div className="map-emoji">{p.emoji}</div>
              <div className="map-title">{p.title}</div>
              {p.subtitle ? <div className="map-sub">{p.subtitle}</div> : null}
              <div className="map-status">
                {isUnlocked ? "Relive ✨" : "Locked 🔒"}
              </div>
            </button>
          );
        })}
      </div>
    </section>

    {/* 👇 THIS MUST BE INSIDE THE RETURN */}
    {burst && (
      <MemoryBurst
        deck={burst.deck}
        pick={burst.pick}
        onDone={() => setBurst(null)}
      />
    )}
  </div>
);
}
