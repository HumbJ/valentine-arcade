export type Place = {
  id: string;
  title: string;
  subtitle?: string;
  emoji: string;
};

export const PLACES: Place[] = [
  { id: "disneyland", title: "Disneyland", subtitle: "snacks + rides + fireworks", emoji: "🏰" },

  // Add more later:
  // { id: "las_vegas", title: "Las Vegas", subtitle: "late-night lights", emoji: "🎰" },
  // { id: "yosemite", title: "Yosemite", subtitle: "views for days", emoji: "🌲" },
];
