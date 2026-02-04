export type Stats = {
  love: number;     // 0-100
  happiness: number;// 0-100
  memories: number; // just a cute counter
};

export type Effect =
  | { type: "stat"; key: "love" | "happiness" | "memories"; delta: number }
  | { type: "log"; text: string }
  | { type: "goto"; eventId: string }
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
  version: 1;
  stats: Stats;
  currentEventId: string;
  log: { t: number; text: string }[];
  placesUnlocked: string[];
  reflections: ReflectionEntry[]; // ✅ add this
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



