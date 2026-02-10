const KEY = "our_little_life_save"; // match whatever key you're using everywhere

export function defaultSave() {
  return {
    version: 2,
    stats: { love: 0, happiness: 0, memories: 0 },
    currentEventId: "hub", // "hub" means we're at home, not in an event
    log: [],
    placesUnlocked: [],
    reflections: [],
    completedEvents: [] as string[], // track which events/arcs are done
    unlockedDateNights: [] as string[], // track unlocked date nights
    experiencedDateNights: [] as string[], // track experienced date nights
  };
}


export function loadSave() {
  const fresh = defaultSave();

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw);

    return {
  ...fresh,
  ...parsed,
  stats: { ...fresh.stats, ...(parsed.stats ?? {}) },
  log: Array.isArray(parsed.log) ? parsed.log : [],
  placesUnlocked: Array.isArray(parsed.placesUnlocked) ? parsed.placesUnlocked : [],
  reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
  completedEvents: Array.isArray(parsed.completedEvents) ? parsed.completedEvents : [],
  unlockedDateNights: Array.isArray(parsed.unlockedDateNights) ? parsed.unlockedDateNights : [],
  experiencedDateNights: Array.isArray(parsed.experiencedDateNights) ? parsed.experiencedDateNights : [],
};

  } catch {
    return fresh;
  }
}

export function persistSave(save: any) {
  localStorage.setItem(KEY, JSON.stringify(save));
}

export function resetSave() {
  localStorage.removeItem(KEY);
}
