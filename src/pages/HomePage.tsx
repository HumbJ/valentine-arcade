import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeHub, type HubZone } from "../components/HomeHub";
import { loadSave, persistSave } from "../life/save";
import type { SaveData } from "../life/types";
import "./HomePage.css";

export function HomePage() {
  const navigate = useNavigate();
  const [save, setSave] = useState<SaveData>(() => loadSave());

  // Refresh save data when returning to the hub
  useEffect(() => {
    setSave(loadSave());
  }, []);

  const handleZoneClick = (zone: HubZone) => {
    switch (zone) {
      case "couch": {
        // Main story mode - need to set an event before navigating
        // If there's already an active event, resume it; otherwise start fresh
        if (save.currentEventId !== "hub") {
          // Resume existing event
          navigate("/story");
        } else {
          // Start from beginning - set currentEventId before navigating
          const updated = { ...save, currentEventId: "start" };
          persistSave(updated);
          setSave(updated);
          navigate("/story");
        }
        break;
      }
      case "suitcase":
        // Trips / Map page
        navigate("/map");
        break;
      case "tv":
        // Video memories repository
        navigate("/videos");
        break;
      case "table":
        // Food mini-games
        navigate("/food");
        break;
      case "phone":
        // Date night memories
        navigate("/memories");
        break;
    }
  };

  const handleRandomEventAccept = (eventId: string) => {
    // Set the event ID and navigate to story mode
    const updated = { ...save, currentEventId: eventId };
    persistSave(updated);
    setSave(updated);
    navigate("/story");
  };

  // Count unlocked trips (places that are trips)
  const unlockedTrips = save.placesUnlocked.length;
  const totalTrips = 5; // Seattle, Road Trip, Hawaii, Seattle 2, New York

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Our Little Life</h1>
        <p className="home-subtitle">Welcome home 💕</p>
      </header>

      <HomeHub
        stats={save.stats}
        onZoneClick={handleZoneClick}
        onRandomEventAccept={handleRandomEventAccept}
        unlockedTrips={unlockedTrips}
        totalTrips={totalTrips}
      />

      <div className="home-hint">
        <p>Tap around the room to explore</p>
      </div>
    </div>
  );
}
