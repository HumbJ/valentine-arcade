export type TripSection = {
  id: string;
  title: string;
  deck: string;
};

export type Trip = {
  id: string;
  title: string;
  subtitle?: string;
  emoji: string;
  sections: TripSection[];
};

export const TRIPS: Trip[] = [
  {
    id: "disneyland",
    title: "Disneyland",
    subtitle: "A day of magic",
    emoji: "🏰",
    sections: [
      { id: "disneyland", title: "All Memories", deck: "disneyland" },
    ],
  },
  {
    id: "seattle1",
    title: "Seattle Trip I",
    subtitle: "Our first big adventure",
    emoji: "🌲",
    sections: [
      { id: "threshold", title: "The Journey", deck: "seattle1_threshold" },
      { id: "arrival", title: "Arrival", deck: "seattle1_arrival" },
      { id: "explore", title: "Exploring", deck: "seattle1_explore" },
      { id: "food", title: "Food", deck: "seattle1_food" },
      { id: "closing", title: "Quiet Moments", deck: "seattle1_closing" },
    ],
  },
  {
    id: "roadtrip",
    title: "California Road Trip",
    subtitle: "Parks, coast, and pastries",
    emoji: "🚗",
    sections: [
      { id: "start", title: "Starting Out", deck: "roadtrip_start" },
      { id: "driving", title: "On the Road", deck: "roadtrip_driving" },
      { id: "yosemite", title: "Yosemite", deck: "roadtrip_yosemite" },
      { id: "coast", title: "The Coast", deck: "roadtrip_coast" },
      { id: "carmel", title: "Carmel", deck: "roadtrip_carmel" },
      { id: "julian", title: "Julian", deck: "roadtrip_julian" },
    ],
  },
  {
    id: "hawaii",
    title: "Hawaii",
    subtitle: "Island paradise",
    emoji: "🌺",
    sections: [
      { id: "arrival", title: "Arrival", deck: "hawaii_arrival" },
      { id: "explore", title: "Exploring", deck: "hawaii_explore" },
      { id: "boating", title: "Boating", deck: "hawaii_boating" },
      { id: "explore2", title: "More Adventures", deck: "hawaii_explore2" },
      { id: "beach", title: "Beach", deck: "hawaii_beach" },
      { id: "luau", title: "Luau", deck: "hawaii_luau" },
      { id: "reflection", title: "Last Morning", deck: "hawaii_reflection" },
    ],
  },
  {
    id: "seattle2",
    title: "Seattle Trip II",
    subtitle: "Back to the Northwest",
    emoji: "🌸",
    sections: [
      { id: "arrival", title: "Arrival", deck: "seattle2_arrival" },
      { id: "flowerfield", title: "Flower Fields", deck: "seattle2_flowerfield" },
      { id: "food", title: "Food", deck: "seattle2_food" },
      { id: "waterfalls", title: "Waterfalls", deck: "seattle2_waterfalls" },
      { id: "reflection", title: "Reflection", deck: "seattle2_reflection" },
    ],
  },
];
