import { useEffect, useState } from "react";
import "./RoadTripMap.css";

// Stop coordinates on our SVG map (roughly matching California geography)
// These are percentage positions on a 300x400 viewBox
const STOPS: Record<string, { x: number; y: number; label: string }> = {
  san_diego: { x: 75, y: 92, label: "San Diego" },
  joshua_tree: { x: 88, y: 78, label: "Joshua Tree" },
  sequoia: { x: 55, y: 52, label: "Sequoia" },
  kings_canyon: { x: 58, y: 48, label: "Kings Canyon" },
  yosemite: { x: 50, y: 38, label: "Yosemite" },
  pinnacles: { x: 28, y: 50, label: "Pinnacles" },
  monterey: { x: 18, y: 45, label: "Monterey" },
  solvang: { x: 30, y: 72, label: "Solvang" },
};

// The route path connecting all stops
const ROUTE_ORDER = [
  "san_diego",
  "joshua_tree",
  "sequoia",
  "kings_canyon",
  "yosemite",
  "pinnacles",
  "monterey",
  "solvang",
  "san_diego", // return home
];

export function RoadTripMap({
  fromStop,
  toStop,
  title,
  onDone,
}: {
  fromStop: string;
  toStop: string;
  title?: string;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(true);

  const from = STOPS[fromStop] ?? STOPS.san_diego;
  const to = STOPS[toStop] ?? STOPS.san_diego;

  // Animate the car from 0 to 100% over ~3 seconds
  useEffect(() => {
    if (!animating) return;

    const duration = 3000;
    const startTime = Date.now();

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(1, elapsed / duration);

      // Ease-out cubic for smoother animation
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(eased * 100);

      if (pct < 1) {
        requestAnimationFrame(frame);
      } else {
        setAnimating(false);
      }
    };

    requestAnimationFrame(frame);
  }, [animating]);

  // Calculate current car position
  const carX = from.x + (to.x - from.x) * (progress / 100);
  const carY = from.y + (to.y - from.y) * (progress / 100);

  // Build the full route path for the SVG
  const routePath = ROUTE_ORDER.map((stopId, i) => {
    const stop = STOPS[stopId];
    return i === 0 ? `M ${stop.x} ${stop.y}` : `L ${stop.x} ${stop.y}`;
  }).join(" ");

  // Build the traveled portion of the route up to current segment
  const fromIndex = ROUTE_ORDER.indexOf(fromStop);
  const traveledPath = ROUTE_ORDER.slice(0, fromIndex + 1)
    .map((stopId, i) => {
      const stop = STOPS[stopId];
      return i === 0 ? `M ${stop.x} ${stop.y}` : `L ${stop.x} ${stop.y}`;
    })
    .join(" ");

  // Current segment path (animated)
  const currentSegmentPath = `M ${from.x} ${from.y} L ${carX} ${carY}`;

  return (
    <div className="rtm-overlay">
      <div className="rtm-wrap">
        <div className="rtm-title">{title ?? "On the Road"}</div>
        <div className="rtm-subtitle">
          {from.label} → {to.label}
        </div>

        <div className="rtm-map-container">
          <svg viewBox="0 0 100 100" className="rtm-map">
            {/* California outline (simplified) */}
            <path
              className="rtm-california"
              d="M 10 10
                 L 25 8
                 L 40 12
                 L 50 15
                 L 55 20
                 L 52 30
                 L 55 40
                 L 60 50
                 L 65 55
                 L 70 60
                 L 75 70
                 L 80 75
                 L 85 80
                 L 90 85
                 L 85 90
                 L 75 95
                 L 60 92
                 L 45 88
                 L 30 82
                 L 20 75
                 L 15 65
                 L 12 55
                 L 10 45
                 L 8 35
                 L 8 25
                 L 10 15
                 Z"
              fill="none"
              stroke="var(--rtm-outline)"
              strokeWidth="1"
            />

            {/* Ocean/coast indication */}
            <path
              className="rtm-coast"
              d="M 10 10 L 8 25 L 8 35 L 10 45 L 12 55 L 15 65 L 20 75 L 30 82"
              fill="none"
              stroke="var(--rtm-coast)"
              strokeWidth="2"
              strokeDasharray="2 2"
            />

            {/* Full route (faded) */}
            <path
              className="rtm-route-bg"
              d={routePath}
              fill="none"
              stroke="var(--rtm-route-bg)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Traveled route */}
            <path
              className="rtm-route-traveled"
              d={traveledPath}
              fill="none"
              stroke="var(--rtm-route)"
              strokeWidth="2"
            />

            {/* Current segment (animating) */}
            <path
              className="rtm-route-current"
              d={currentSegmentPath}
              fill="none"
              stroke="var(--rtm-route)"
              strokeWidth="2"
            />

            {/* Stop markers */}
            {Object.entries(STOPS).map(([id, stop]) => {
              const isFrom = id === fromStop;
              const isTo = id === toStop;
              const visited = ROUTE_ORDER.indexOf(id) <= fromIndex;

              return (
                <g key={id}>
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r={isFrom || isTo ? 3 : 2}
                    className={`rtm-stop ${visited ? "visited" : ""} ${isFrom ? "from" : ""} ${isTo ? "to" : ""}`}
                  />
                  {(isFrom || isTo || visited) && (
                    <text
                      x={stop.x}
                      y={stop.y - 5}
                      className="rtm-label"
                      textAnchor="middle"
                    >
                      {stop.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Animated car */}
            <g
              className="rtm-car"
              transform={`translate(${carX}, ${carY})`}
            >
              <circle r="4" fill="var(--rtm-car-bg)" />
              <text
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="5"
              >
                🚗
              </text>
            </g>
          </svg>
        </div>

        <div className="rtm-footer">
          {animating ? (
            <div className="rtm-driving">Driving...</div>
          ) : (
            <button className="rtm-btn" onClick={onDone}>
              We're here! →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
