import { useEffect, useState } from "react";
import { loadSave } from "../life/save";
import { PLACES } from "../life/places";
import { TRIPS } from "../life/trips";
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
  const completed = new Set(save.completedEvents ?? []);

  // Filter out trip IDs from general places since we show them separately
  const tripIds = new Set(TRIPS.map((t) => t.id));
  const generalPlaces = PLACES.filter((p) => !tripIds.has(p.id));
  const unlockedTrips = TRIPS.filter((t) => completed.has(t.id));

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <div className="kicker">Adventure</div>
          <h1 className="title">Map</h1>
          <div className="muted">Trips and places you've unlocked 💗</div>
        </div>
      </header>

      {/* Trips Section */}
      {unlockedTrips.length > 0 && (
        <section className="card">
          <h2 className="section-title">🗺️ Trips</h2>
          {unlockedTrips.map((trip) => (
            <div key={trip.id} className="trip-section">
              <div className="trip-header">
                <span className="trip-emoji">{trip.emoji}</span>
                <div className="trip-info">
                  <h3 className="trip-title">{trip.title}</h3>
                  {trip.subtitle && <div className="trip-subtitle">{trip.subtitle}</div>}
                </div>
              </div>
              <div className="trip-memories">
                {trip.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className="memory-button"
                    onClick={() => setBurst({ deck: section.deck })}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* General Places */}
      {generalPlaces.some((p) => unlocked.has(p.id)) && (
        <section className="card">
          <h2 className="section-title">📍 Other Places</h2>
          <div className="map-grid">
            {generalPlaces.map((p) => {
              const isUnlocked = unlocked.has(p.id);
              if (!isUnlocked) return null;

              return (
                <button
                  key={p.id}
                  type="button"
                  className="map-card unlocked"
                  onClick={() => setBurst({ deck: (p as any).deck ?? p.id })}
                >
                  <div className="map-emoji">{p.emoji}</div>
                  <div className="map-title">{p.title}</div>
                  {p.subtitle && <div className="map-sub">{p.subtitle}</div>}
                  <div className="map-status">Relive ✨</div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {unlockedTrips.length === 0 && !generalPlaces.some((p) => unlocked.has(p.id)) && (
        <section className="card">
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <div className="empty-title">No places unlocked yet</div>
            <div className="empty-text">
              Complete trips and activities in the story to unlock memories here!
            </div>
          </div>
        </section>
      )}

      {burst && (
        <MemoryBurst deck={burst.deck} pick={burst.pick} onDone={() => setBurst(null)} />
      )}
    </div>
  );
}
