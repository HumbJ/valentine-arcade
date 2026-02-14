import { useState, useEffect, useCallback } from "react";
import type { Stats } from "../life/types";
import "./HomeHub.css";

type HubZone = "suitcase" | "tv" | "table" | "phone" | "couch";

type RandomEvent = {
  id: string;
  eventId: string; // Event ID to trigger in story mode
  text: string;
  emoji: string;
};

const RANDOM_EVENTS: RandomEvent[] = [
  { id: "cozy_night", eventId: "random_cozy_night", text: "Stay in tonight?", emoji: "🌙" },
  { id: "pizza_night", eventId: "random_pizza_night", text: "Pizza night?", emoji: "🍕" },
  { id: "movie_time", eventId: "random_movie_night", text: "Movie time?", emoji: "🎬" },
  { id: "friend_text", eventId: "random_friend_text", text: "Friends want to hang!", emoji: "📱" },
  { id: "adventure_call", eventId: "random_adventure_call", text: "Feeling adventurous?", emoji: "✨" },
];

type Props = {
  stats: Stats;
  onZoneClick: (zone: HubZone) => void;
  onRandomEventAccept: (eventId: string) => void;
  unlockedTrips?: number;
  totalTrips?: number;
};

export function HomeHub({ stats, onZoneClick, onRandomEventAccept, unlockedTrips = 1, totalTrips = 5 }: Props) {
  const [randomEvent, setRandomEvent] = useState<RandomEvent | null>(null);
  const [showEvent, setShowEvent] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  // Generate floating particles on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Random event trigger (20% chance on mount, then every 30s)
  const triggerRandomEvent = useCallback(() => {
    if (Math.random() < 0.2) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setRandomEvent(event);
      setShowEvent(true);
    }
  }, []);

  useEffect(() => {
    // Initial trigger after a short delay
    const initialTimeout = setTimeout(triggerRandomEvent, 2000);

    // Periodic check every 30 seconds
    const interval = setInterval(triggerRandomEvent, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [triggerRandomEvent]);

  const dismissEvent = () => {
    setShowEvent(false);
    setTimeout(() => setRandomEvent(null), 300);
  };

  const acceptEvent = () => {
    if (randomEvent) {
      onRandomEventAccept(randomEvent.eventId);
      dismissEvent();
    }
  };

  const handleZoneClick = (zone: HubZone) => {
    onZoneClick(zone);
  };

  return (
    <div className="hub-wrapper">
      <div className="hub-container">
        {/* Ambient particles */}
        <div className="hub-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="hub-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Room scene */}
        <div className="hub-room">
          {/* Window with day/night gradient */}
          <div className="hub-window">
            <div className="hub-window-frame" />
            <div className="hub-window-curtain left" />
            <div className="hub-window-curtain right" />
          </div>

          {/* Photo wall (decorative) */}
          <div className="hub-photos">
            <div className="hub-photo-frame" />
            <div className="hub-photo-frame" />
            <div className="hub-photo-frame" />
          </div>

          {/* TV Area */}
          <button
            className="hub-zone hub-tv"
            onClick={() => handleZoneClick("tv")}
            aria-label="Watch something together (Date Nights)"
          >
            <div className="hub-tv-screen">
              <div className="hub-tv-static" />
            </div>
            <div className="hub-tv-stand" />
            <span className="hub-zone-label">Date Nights</span>
          </button>

          {/* Fireplace */}
          <div className="hub-fireplace">
            <div className="hub-fire">
              <div className="hub-flame f1" />
              <div className="hub-flame f2" />
              <div className="hub-flame f3" />
            </div>
            <div className="hub-fireplace-glow" />
          </div>

          {/* Couch with couple */}
          <button
            className="hub-zone hub-couch"
            onClick={() => handleZoneClick("couch")}
            aria-label="Spend time together"
          >
            <div className="hub-couch-base" />
            <div className="hub-couple">
              <div className="hub-person p1" />
              <div className="hub-person p2" />
              <div className="hub-heart-float">💕</div>
            </div>
            <span className="hub-zone-label">Story</span>
          </button>

          {/* Suitcase */}
          <button
            className="hub-zone hub-suitcase"
            onClick={() => handleZoneClick("suitcase")}
            aria-label="Go on a trip"
          >
            <div className="hub-suitcase-body">
              <div className="hub-suitcase-stripe" />
              <div className="hub-suitcase-handle" />
            </div>
            <span className="hub-zone-label">Trips</span>
            <span className="hub-zone-badge">{unlockedTrips}/{totalTrips}</span>
          </button>

          {/* Dining table */}
          <button
            className="hub-zone hub-table"
            onClick={() => handleZoneClick("table")}
            aria-label="Have a meal together"
          >
            <div className="hub-table-top" />
            <div className="hub-table-leg l1" />
            <div className="hub-table-leg l2" />
            <div className="hub-food-items">
              <span className="hub-food">🍜</span>
              <span className="hub-food">🥡</span>
            </div>
            <span className="hub-zone-label">Food</span>
          </button>

          {/* Phone on side table */}
          <button
            className="hub-zone hub-phone"
            onClick={() => handleZoneClick("phone")}
            aria-label="Check phone"
          >
            <div className="hub-side-table" />
            <div className="hub-phone-device">
              <div className="hub-phone-screen" />
              <div className="hub-phone-notif" />
            </div>
            <span className="hub-zone-label">Friends</span>
          </button>

          {/* Floor rug */}
          <div className="hub-rug" />
        </div>

        {/* Random event popup */}
        {randomEvent && (
          <div className={`hub-event-popup ${showEvent ? "show" : ""}`}>
            <span className="hub-event-emoji">{randomEvent.emoji}</span>
            <span className="hub-event-text">{randomEvent.text}</span>
            <div className="hub-event-actions">
              <button className="hub-event-btn accept" onClick={acceptEvent}>
                Yes!
              </button>
              <button className="hub-event-btn dismiss" onClick={dismissEvent}>
                Later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats bar - outside room container */}
      <div className="hub-stats-bar">
        <div className="hub-stat">
          <span className="hub-stat-icon">💕</span>
          <div className="hub-stat-bar">
            <div className="hub-stat-fill love" style={{ width: `${stats.love}%` }} />
          </div>
          <span className="hub-stat-val">{stats.love}</span>
        </div>
        <div className="hub-stat">
          <span className="hub-stat-icon">😊</span>
          <div className="hub-stat-bar">
            <div className="hub-stat-fill happy" style={{ width: `${stats.happiness}%` }} />
          </div>
          <span className="hub-stat-val">{stats.happiness}</span>
        </div>
        <div className="hub-stat">
          <span className="hub-stat-icon">📸</span>
          <span className="hub-stat-val memories">{stats.memories}</span>
        </div>
      </div>
    </div>
  );
}

export type { HubZone };
