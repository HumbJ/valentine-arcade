import waMap from "../assets/maps/wa.png";

export type DiscoverHotspot = {
  id: string;
  label: string;
  xPct: number; // 0..100 relative to the map image
  yPct: number; // 0..100 relative to the map image
  rPct: number; // radius as % of map width (hit tolerance)
};

export type DiscoverMap = {
  id: string;
  prompt: string;
  hint?: string;
  backgroundSrc?: string;
  hotspots: DiscoverHotspot[];
};

export const DISCOVER_MAPS: Record<string, DiscoverMap> = {
  seattle1: {
    id: "seattle1",
    prompt: "What 4 main areas did we explore on this trip?",
    hint: "Tap the map where you think they are. Names reveal below.",
    backgroundSrc: waMap,
   hotspots: [
  // Olympic Peninsula (nudge right + bigger zone)
  { id: "olympic", label: "Olympic National Park", xPct: 19.5, yPct: 38.5, rPct: 12 },

  // Seattle metro (move right across the sound / rivers)
  { id: "seattle", label: "Seattle", xPct: 36.7, yPct: 42.0, rPct: 6 },

  // Mount Rainier (move east + south)
  { id: "rainier", label: "Mount Rainier", xPct: 41.0, yPct: 61.0, rPct: 6 },

  // North Cascades (move a bit north, slightly east + bigger zone)
  { id: "cascades", label: "North Cascades", xPct: 47.0, yPct: 23.5, rPct: 11 },
],
  },
};

