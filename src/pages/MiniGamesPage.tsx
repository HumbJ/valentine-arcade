import { useEffect, useState } from "react";
import { loadSave } from "../life/save";
import { TRIP_MINI_GAMES, OTHER_MINI_GAMES } from "../life/miniGames";

export function MiniGamesPage() {
  const [save, setSave] = useState(() => loadSave());

  useEffect(() => {
    // refresh when page mounts
    setSave(loadSave());

    // refresh if user comes back to tab/window
    const onFocus = () => setSave(loadSave());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const completed = new Set(save.completedEvents ?? []);
  const unlockedTripGames = TRIP_MINI_GAMES.filter((t) => completed.has(t.tripId));
  const hasAnyGames = unlockedTripGames.length > 0;

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <div className="kicker">Play</div>
          <h1 className="title">Mini-Games</h1>
          <div className="muted">Games from your adventures 🎮</div>
        </div>
      </header>

      {/* Trip Mini-Games */}
      {unlockedTripGames.length > 0 && (
        <section className="card">
          <h2 className="section-title">🗺️ Trip Games</h2>
          {unlockedTripGames.map((tripGames) => (
            <div key={tripGames.tripId} className="trip-section">
              <div className="trip-header">
                <span className="trip-emoji">{tripGames.emoji}</span>
                <div className="trip-info">
                  <h3 className="trip-title">{tripGames.tripTitle}</h3>
                  <div className="trip-subtitle">{tripGames.games.length} games</div>
                </div>
              </div>
              <div className="games-grid">
                {tripGames.games.map((game) => (
                  <div key={game.id} className="game-card locked">
                    <div className="game-emoji">{game.emoji}</div>
                    <div className="game-title">{game.title}</div>
                    <div className="game-description">{game.description}</div>
                    <div className="game-status">Coming Soon 🎮</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Other Mini-Games */}
      {OTHER_MINI_GAMES.length > 0 && hasAnyGames && (
        <section className="card">
          <h2 className="section-title">🎭 Other Games</h2>
          <div className="games-grid">
            {OTHER_MINI_GAMES.map((game) => (
              <div key={game.id} className="game-card locked">
                <div className="game-emoji">{game.emoji}</div>
                <div className="game-title">{game.title}</div>
                <div className="game-description">{game.description}</div>
                <div className="game-status">Coming Soon 🎮</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!hasAnyGames && (
        <section className="card">
          <div className="empty-state">
            <div className="empty-icon">🎮</div>
            <div className="empty-title">No games unlocked yet</div>
            <div className="empty-text">
              Complete trips in the story to unlock mini-games you can replay anytime!
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
