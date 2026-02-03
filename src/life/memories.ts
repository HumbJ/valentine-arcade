// src/life/memories.ts

// Disneyland photos
import food from "../assets/photos/dates/disneyland/disneyland.food.jpeg";
import cafe from "../assets/photos/dates/disneyland/disneyland.cafe.jpeg";
import cafelandscape from "../assets/photos/dates/disneyland/disneyland.cafe.landscape.jpeg";
import castlebane from "../assets/photos/dates/disneyland/disneyland.castle.bane.jpeg";
import castletogether1 from "../assets/photos/dates/disneyland/disneyland.castle.together.jpeg";
import castletogether2 from "../assets/photos/dates/disneyland/disneyland.castle.together2.jpeg";
import lunar from "../assets/photos/dates/disneyland/disneyland.lunar.jpeg";
import motel from "../assets/photos/dates/disneyland/disneyland.motel.jpeg";
import popcorn from "../assets/photos/dates/disneyland/disneyland.popcorn.bane.jpeg";
import smallworld from "../assets/photos/dates/disneyland/disneyland.smallworld.jpeg";
import ears from "../assets/photos/dates/disneyland/disneyland.together.ears.jpeg";

// Disneyland video
import fireworksVideo from "../assets/photos/dates/disneyland/disneyland.movie.mov";

export type MemoryItem =
  | {
      id: string;
      type: "photo";
      src: string;
      caption?: string;
    }
  | {
      id: string;
      type: "video";
      src: string;
      caption?: string;
      loop?: boolean; // optional: we can loop “glimpses”
      muted?: boolean;
    };

export const MEMORIES: Record<string, MemoryItem[]> = {
  disneyland: [
    { id: "disney-food", type: "photo", src: food, caption: "A little barbeque to recharge ✨" },
    { id: "cafe", type: "photo", src: cafe, caption: "Taking in the sights at the cafe" },
    { id: "cafe-landscape", type: "photo", src: cafelandscape, caption: "Continuing at the cafe" },
    { id: "castle-bane", type: "photo", src: castlebane, caption: "Bane looking gorgeous as always" },
    { id: "castle-together-1", type: "photo", src: castletogether1, caption: "Us at the castle 💗" },
    { id: "castle-together-2", type: "photo", src: castletogether2, caption: "Us at the castle (again) 💗" },
    { id: "lunar", type: "photo", src: lunar, caption: "A perfect lunar new year" },
    { id: "motel", type: "photo", src: motel, caption: "The motel vibes" },
    { id: "popcorn-bane", type: "photo", src: popcorn, caption: "Popcorn with the popcorn queen" },
    { id: "smallworld", type: "photo", src: smallworld, caption: "It really do be a small world after all" },
    { id: "ears-together", type: "photo", src: ears, caption: "Us with the ears on" },
    {
      id: "fireworks-video",
      type: "video",
      src: fireworksVideo,
      caption: "Fireworks over the castle 💗",
      loop: true,
      muted: true,
    },
  ],
};
// --- Auto-deck loader (Vite) ----------------------------------------------

function filenameNoExt(path: string) {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.[^.]+$/, "");
}

function isVideoFile(path: string) {
  return /\.(mp4|mov|webm|m4v)$/i.test(path);
}

/**
 * Convert a Vite glob() result into a sorted MemoryItem[].
 * Sorting is by file path, so name files like s1_arrival_01.jpg, s1_arrival_02.jpg, etc.
 */
function deckFromGlob(globResult: Record<string, any>): MemoryItem[] {
  const entries = Object.entries(globResult).sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([path, mod]) => {
    const src: string = typeof mod === "string" ? mod : mod.default;
    const id = filenameNoExt(path);

    if (isVideoFile(path)) {
      return {
        id,
        type: "video",
        src,
        loop: true,
        muted: true,
      };
    }

    return {
      id,
      type: "photo",
      src,
    };
  });
}

// --- Seattle Trip 1 decks --------------------------------------------------
// Folder layout: src/photos/trips/seattle1/{threshold,arrival,explore,food,quiet,reflect}

const seattle1Threshold = import.meta.glob("../assets/photos/trips/seattle1/threshold/*", { eager: true });
const seattle1Arrival   = import.meta.glob("../assets/photos/trips/seattle1/arrival/*", { eager: true });
const seattle1Explore   = import.meta.glob("../assets/photos/trips/seattle1/explore/*", { eager: true });
const seattle1Food      = import.meta.glob("../assets/photos/trips/seattle1/food/*", { eager: true });
const seattle1Quiet     = import.meta.glob("../assets/photos/trips/seattle1/quiet/*", { eager: true });
const seattle1Reflect   = import.meta.glob("../assets/photos/trips/seattle1/reflect/*", { eager: true });

MEMORIES["seattle1_threshold"] = deckFromGlob(seattle1Threshold);
MEMORIES["seattle1_arrival"]   = deckFromGlob(seattle1Arrival);
MEMORIES["seattle1_explore"]   = deckFromGlob(seattle1Explore);
MEMORIES["seattle1_food"]      = deckFromGlob(seattle1Food);
MEMORIES["seattle1_quiet"]     = deckFromGlob(seattle1Quiet);
MEMORIES["seattle1_reflect"]   = deckFromGlob(seattle1Reflect);
// Seattle Trip 1 outro deck (same assets as reflect, but used as the "closing beat")
MEMORIES["seattle1_closing"] = MEMORIES["seattle1_reflect"];


// --- Seattle Trip 1 combined "scrapbook" deck (for Map replay) -------------

MEMORIES["seattle1"] = [
  ...(MEMORIES["seattle1_threshold"] ?? []),
  ...(MEMORIES["seattle1_arrival"] ?? []),
  ...(MEMORIES["seattle1_explore"] ?? []),
  ...(MEMORIES["seattle1_food"] ?? []),
  ...(MEMORIES["seattle1_quiet"] ?? []),
  ...(MEMORIES["seattle1_reflect"] ?? []),
];



export function getMemorySrc(deck: string, id: string): string | null {
  const arr = MEMORIES[deck] ?? [];
  const item = arr.find((m) => m.id === id);
  return item ? item.src : null;
}
