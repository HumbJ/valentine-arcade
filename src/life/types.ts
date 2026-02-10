export type Stats = {
  love: number;     // 0-100
  happiness: number;// 0-100
  memories: number; // just a cute counter
};

export type Effect =
  | { type: "stat"; key: "love" | "happiness" | "memories"; delta: number }
  | { type: "log"; text: string }
  | { type: "goto"; eventId: string }
  | { type: "gotoHome"; markComplete?: string } // optionally mark an event/arc as complete
  | { type: "burst"; deck: string; pick?: number }
  | { type: "puzzle"; imageSrc: string; rows?: number; cols?: number; title?: string }
  | { type: "unlockPlace"; placeId: string }
  | { type: "mapDiscover"; mapId: string; title?: string; subtitle?: string }
  | { type: "foodOrder"; gameId: string; title?: string; subtitle?: string }
  | { type: "picnicDate"; title: string; subtitle?: string }
  | {
      type: "reflectionPrompt";
      id: string;          // stable prompt id e.g. "seattle_close"
      prompt: string;      // question shown
      arc?: string;        // optional grouping e.g. "seattle1"
      title?: string;      // optional overlay title
      subtitle?: string;   // optional overlay subtitle
    }
  | {
      type: "reflectionReview";
      title?: string;
      closingLine?: string;
    }
  // Road trip mini-game effects
  | {
      type: "roadTripMap";
      fromStop: string;    // starting location
      toStop: string;      // destination
      title?: string;
    }
  | {
      type: "stargazingMemory";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "canyonEcho";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "tunnelViewReveal";
      imageSrc: string;    // the image to reveal
      title?: string;
      subtitle?: string;
    }
  | {
      type: "tidePoolMatch";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "pastryStacker";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "foodLocationMatch";
      title?: string;
      subtitle?: string;
    }
  // Movie night mini-game effects
  | {
      type: "spotTheClues";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "perfectMoment";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "giggleGauge";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "epicEscape";
      title?: string;
      subtitle?: string;
    }
  // Hawaii trip mini-game effects
  | {
      type: "oceanSpotting";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "islandDrive";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "shellMerge";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "leiPattern";
      title?: string;
      subtitle?: string;
    }
  // Seattle Trip 2 mini-game effects
  | {
      type: "bouquetRush";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "waterfallHop";
      title?: string;
      subtitle?: string;
    };


export type Choice = {
  id: string;
  label: string;
  effects: Effect[];
};

export type LifeEvent = {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
};

export type SaveData = {
  version: 1 | 2;
  stats: Stats;
  currentEventId: string; // "hub" means at home, not in active event
  log: { t: number; text: string }[];
  placesUnlocked: string[];
  reflections: ReflectionEntry[];
  completedEvents: string[]; // track completed event arcs
  unlockedDateNights?: string[]; // track unlocked date night memories
};



export type ReflectionEntry = {
  id: string;        // stable id for the prompt (e.g. "seattle_close")
  t: number;         // timestamp
  arc?: string;      // e.g. "seattle1"
  prompt: string;    // the question shown
  text: string;      // her response
};

export type PicnicDateEffect = {
  type: "picnicDate";
  title: string;
  subtitle?: string;
};



