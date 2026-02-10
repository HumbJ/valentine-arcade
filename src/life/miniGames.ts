export type MiniGame = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  component: string; // Name of the component (for dynamic import later)
};

export type TripGames = {
  tripId: string;
  tripTitle: string;
  emoji: string;
  games: MiniGame[];
};

export const TRIP_MINI_GAMES: TripGames[] = [
  {
    tripId: "seattle1",
    tripTitle: "Seattle Trip I",
    emoji: "🌲",
    games: [
      {
        id: "mapDiscover",
        title: "Map Discovery",
        emoji: "🗺️",
        description: "Find locations on the Seattle map",
        component: "MapDiscoverGate",
      },
      {
        id: "foodOrder",
        title: "Food Timeline",
        emoji: "🍔",
        description: "Order the food we tried",
        component: "FoodOrderGate",
      },
    ],
  },
  {
    tripId: "roadtrip",
    tripTitle: "California Road Trip",
    emoji: "🚗",
    games: [
      {
        id: "roadTripMap",
        title: "Road Trip Map",
        emoji: "🗺️",
        description: "Navigate between stops",
        component: "RoadTripMap",
      },
      {
        id: "stargazing",
        title: "Stargazing Memory",
        emoji: "⭐",
        description: "Connect the constellations",
        component: "StargazingMemory",
      },
      {
        id: "canyonEcho",
        title: "Canyon Echo",
        emoji: "🏜️",
        description: "Call and response game",
        component: "CanyonEcho",
      },
      {
        id: "tunnelView",
        title: "Tunnel View Reveal",
        emoji: "🌄",
        description: "Reveal the scenic view",
        component: "TunnelViewReveal",
      },
      {
        id: "tidePool",
        title: "Tide Pool Match",
        emoji: "🦀",
        description: "Match the sea creatures",
        component: "TidePoolMatch",
      },
      {
        id: "pastryStacker",
        title: "Pastry Stacker",
        emoji: "🥐",
        description: "Stack the pastries",
        component: "PastryStacker",
      },
      {
        id: "foodLocation",
        title: "Food Location Match",
        emoji: "📍",
        description: "Match foods to locations",
        component: "FoodLocationMatch",
      },
    ],
  },
  {
    tripId: "hawaii",
    tripTitle: "Hawaii",
    emoji: "🌺",
    games: [
      {
        id: "islandDrive",
        title: "Island Drive",
        emoji: "🚗",
        description: "Remember the route",
        component: "IslandDrive",
      },
      {
        id: "waveRider",
        title: "Wave Rider",
        emoji: "🏄",
        description: "Navigate through the waves",
        component: "WaveRider",
      },
      {
        id: "shellMerge",
        title: "Shell Merge",
        emoji: "🐚",
        description: "Merge shells on the beach",
        component: "ShellMerge",
      },
      {
        id: "leiPattern",
        title: "Lei Pattern",
        emoji: "🌺",
        description: "Remember the flower pattern",
        component: "LeiPattern",
      },
    ],
  },
  {
    tripId: "seattle2",
    tripTitle: "Seattle Trip II",
    emoji: "🌸",
    games: [
      {
        id: "bouquetRush",
        title: "Bouquet Rush",
        emoji: "💐",
        description: "Fulfill flower orders quickly",
        component: "BouquetRush",
      },
      {
        id: "waterfallHop",
        title: "Waterfall Dodge",
        emoji: "💧",
        description: "Dodge the falling water",
        component: "WaterfallHop",
      },
    ],
  },
];

// Other mini-games not tied to trips
export const OTHER_MINI_GAMES: MiniGame[] = [
  {
    id: "spotTheClues",
    title: "Spot the Clues",
    emoji: "🔍",
    description: "Find hidden clues",
    component: "SpotTheClues",
  },
  {
    id: "perfectMoment",
    title: "Perfect Moment",
    emoji: "💕",
    description: "Capture the moment",
    component: "PerfectMoment",
  },
  {
    id: "giggleGauge",
    title: "Giggle Gauge",
    emoji: "😄",
    description: "Keep the laughter going",
    component: "GiggleGauge",
  },
  {
    id: "epicEscape",
    title: "Epic Escape",
    emoji: "🎬",
    description: "Adventure movie game",
    component: "EpicEscape",
  },
];
