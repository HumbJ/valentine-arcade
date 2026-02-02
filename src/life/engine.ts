import type { Effect, LifeEvent, SaveData, Stats } from "./types";
import { LIFE_EVENTS } from "./events";

const clamp01 = (n: number) => Math.max(0, Math.min(100, n));

export function getEventById(id: string): LifeEvent {
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

  if (eff.type === "burst") {
    // UI handles this effect (visual only). Nothing to save here.
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

  if (eff.type === "log") {
    next.log = [{ t: Date.now(), text: eff.text }, ...next.log].slice(0, 50);
    next.stats = { ...next.stats, memories: next.stats.memories + 1 };
    continue;
  }

  if (eff.type === "goto") {
    next.currentEventId = eff.eventId;
    continue;
  }
}

  return next;
}
