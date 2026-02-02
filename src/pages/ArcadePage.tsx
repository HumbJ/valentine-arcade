import { Link } from "react-router-dom";

export function ArcadePage() {
  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <div className="kicker">Arcade</div>
          <h1 className="title">Mini Games</h1>
        </div>
      </header>

      <section className="card">
        <p className="story">
          These are the standalone games. Later, we’ll also launch them *inside* Our Little Life as “moments.”
        </p>

        <div className="choices">
          <button className="choice" disabled title="Next step after Life MVP">
            🧩 Photo Puzzle (coming next)
          </button>
          <button className="choice" disabled>
            🗺️ Geo Guess (later)
          </button>
          <button className="choice" disabled>
            🍜 Food Memories (later)
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link className="link" to="/">← Back to Our Little Life</Link>
        </div>
      </section>
    </div>
  );
}
