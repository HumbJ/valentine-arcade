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

export function getMemorySrc(deck: string, id: string): string | null {
  const arr = MEMORIES[deck] ?? [];
  const item = arr.find((m) => m.id === id);
  return item ? item.src : null;
}
