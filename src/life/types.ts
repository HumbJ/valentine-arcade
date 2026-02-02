export type Stats = {
  love: number;     // 0-100
  happiness: number;// 0-100
  memories: number; // just a cute counter
};

export type Effect =
  | { type: "stat"; key: keyof Stats; delta: number }
  | { type: "log"; text: string }
  | { type: "goto"; eventId: string }
  | { type: "burst"; deck: string; pick?: number }
  | { type: "puzzle"; imageSrc: string; rows?: number; cols?: number; title?: string }
  | { type: "unlockPlace"; placeId: string };

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
  placesUnlocked: string[]; // NEW
};


