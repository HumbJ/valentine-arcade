import type { Effect, LifeEvent, SaveData, Stats } from "./types";
import { LIFE_EVENTS } from "./events";
import { getDateNightsByUnlock } from "./dateNights";

const clamp01 = (n: number) => Math.max(0, Math.min(100, n));

export function getEventById(id: string): LifeEvent | null {
  // "hub" means we're at home, not in an active event
  if (id === "hub") return null;
  const ev = LIFE_EVENTS.find((e) => e.id === id);
  if (!ev) throw new Error(`Missing event: ${id}`);
  return ev;
}

export function applyEffects(save: SaveData, effects: Effect[]): SaveData {
  let next: SaveData = structuredClone(save);

  for (const eff of effects) {
  if (eff.type === "stat") {
    const s: Stats = next.stats;
    const val = clamp01(s[eff.key] + eff.delta);
    next.stats = { ...s, [eff.key]: val };
    continue;
  }

if (
  eff.type === "burst" ||
  eff.type === "puzzle" ||
  eff.type === "mapDiscover" ||
  eff.type === "foodOrder" ||
  eff.type === "reflectionPrompt" ||
  eff.type === "reflectionReview"
) {
  continue;
}


  if (eff.type === "unlockPlace") {
    // Defensive: older saves might not have this field yet
    next.placesUnlocked = Array.isArray(next.placesUnlocked) ? next.placesUnlocked : [];

    if (!next.placesUnlocked.includes(eff.placeId)) {
      next.placesUnlocked = [eff.placeId, ...next.placesUnlocked];
    }
    continue;
  }

  if (eff.type === "unlockDateNights") {
    // Initialize unlockedDateNights if it doesn't exist
    next.unlockedDateNights = Array.isArray(next.unlockedDateNights) ? next.unlockedDateNights : [];

    // Get all date nights that should be unlocked for this trip
    const dateNightsToUnlock = getDateNightsByUnlock(eff.tripId);

    // Add any that aren't already unlocked
    for (const dateNight of dateNightsToUnlock) {
      if (!next.unlockedDateNights.includes(dateNight.id)) {
        next.unlockedDateNights = [...next.unlockedDateNights, dateNight.id];
      }
    }
    continue;
  }

  if (eff.type === "log") {
    next.log = [{ t: Date.now(), text: eff.text }, ...next.log].slice(0, 50);
    next.stats = { ...next.stats, memories: next.stats.memories + 1 };
    continue;
  }

  if (eff.type === "goto") {
    next.currentEventId = eff.eventId;
    continue;
  }

  if (eff.type === "gotoHome") {
    next.currentEventId = "hub";
    if (eff.markComplete) {
      next.completedEvents = Array.isArray(next.completedEvents) ? next.completedEvents : [];
      if (!next.completedEvents.includes(eff.markComplete)) {
        next.completedEvents = [...next.completedEvents, eff.markComplete];
      }
    }
    continue;
  }
}

  return next;
}
