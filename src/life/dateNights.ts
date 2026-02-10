// src/life/dateNights.ts
// Configuration for all date night memories

export interface DateNight {
  id: string;
  title: string;
  description: string;
  emoji: string;
  deck: string; // Memory deck key
  category: "dining" | "concerts" | "adventures" | "friends" | "special";
  unlockAfter: "seattle1" | "hawaii" | "seattle2" | "roadtrip" | "newyork"; // Which trip unlocks this
}

export const DATE_NIGHTS: DateNight[] = [
  // --- Unlocked after Seattle 1 (6 casual local dates) ---
  {
    id: "date_breakfast1",
    title: "Morning Brunch",
    description: "Starting the day right with good food and better company",
    emoji: "🥞",
    deck: "date_breakfast1",
    category: "dining",
    unlockAfter: "seattle1",
  },
  {
    id: "date_lunch",
    title: "Lunch Date",
    description: "A quiet afternoon together",
    emoji: "🍱",
    deck: "date_lunch",
    category: "dining",
    unlockAfter: "seattle1",
  },
  {
    id: "date_dessert1",
    title: "Sweet Treats",
    description: "Indulging our sweet tooth",
    emoji: "🍰",
    deck: "date_dessert1",
    category: "dining",
    unlockAfter: "seattle1",
  },
  {
    id: "date_bar",
    title: "Evening Drinks",
    description: "Unwinding after a long week",
    emoji: "🍸",
    deck: "date_bar",
    category: "dining",
    unlockAfter: "seattle1",
  },
  {
    id: "date_italian1",
    title: "Italian Night",
    description: "Classic Italian cuisine and candlelight",
    emoji: "🍝",
    deck: "date_italian1",
    category: "dining",
    unlockAfter: "seattle1",
  },
  {
    id: "date_pokemondayin",
    title: "Pokemon Day In",
    description: "A cozy day at home catching 'em all",
    emoji: "⚡",
    deck: "date_pokemondayin",
    category: "special",
    unlockAfter: "seattle1",
  },

  // --- Unlocked after Hawaii (6 animal/aquatic adventures) ---
  {
    id: "date_zoo1",
    title: "Zoo Adventure",
    description: "Exploring the animal kingdom together",
    emoji: "🦁",
    deck: "date_zoo1",
    category: "adventures",
    unlockAfter: "hawaii",
  },
  {
    id: "date_aquarium",
    title: "Aquarium Visit",
    description: "Mesmerized by the underwater world",
    emoji: "🐠",
    deck: "date_aquarium",
    category: "adventures",
    unlockAfter: "hawaii",
  },
  {
    id: "date_seaworld",
    title: "SeaWorld Day",
    description: "Marine life and ocean adventures",
    emoji: "🐬",
    deck: "date_seaworld",
    category: "adventures",
    unlockAfter: "hawaii",
  },
  {
    id: "date_dessert2",
    title: "Dessert Spot",
    description: "Finding new favorite sweet spots",
    emoji: "🍨",
    deck: "date_dessert2",
    category: "dining",
    unlockAfter: "hawaii",
  },
  {
    id: "date_omikase",
    title: "Omakase Night",
    description: "Trusting the chef's choice",
    emoji: "🍣",
    deck: "date_omikase",
    category: "dining",
    unlockAfter: "hawaii",
  },
  {
    id: "date_hitokuchi",
    title: "Hitokuchi",
    description: "Japanese izakaya experience",
    emoji: "🍶",
    deck: "date_hitokuchi",
    category: "dining",
    unlockAfter: "hawaii",
  },

  // --- Unlocked after Seattle 2 (6 fall/winter/friends dates) ---
  {
    id: "date_christmasglobe",
    title: "Christmas Globes",
    description: "Holiday magic and twinkling lights",
    emoji: "🎄",
    deck: "date_christmasglobe",
    category: "special",
    unlockAfter: "seattle2",
  },
  {
    id: "date_halloween",
    title: "Halloween Night",
    description: "Spooky season celebrations",
    emoji: "🎃",
    deck: "date_halloween",
    category: "special",
    unlockAfter: "seattle2",
  },
  {
    id: "date_pinning",
    title: "Pinning Ceremony",
    description: "A proud moment celebrated together",
    emoji: "🎓",
    deck: "date_pinning",
    category: "special",
    unlockAfter: "seattle2",
  },
  {
    id: "date_oakglenn",
    title: "Oak Glen",
    description: "Apple picking in the fall",
    emoji: "🍎",
    deck: "date_oakglenn",
    category: "adventures",
    unlockAfter: "seattle2",
  },
  {
    id: "date_friendskbbq",
    title: "Korean BBQ with Friends",
    description: "Good food and great company",
    emoji: "🥘",
    deck: "date_friendskbbq",
    category: "friends",
    unlockAfter: "seattle2",
  },
  {
    id: "date_friendssteakhouse",
    title: "Steakhouse Night",
    description: "Celebrating with friends",
    emoji: "🥩",
    deck: "date_friendssteakhouse",
    category: "friends",
    unlockAfter: "seattle2",
  },

  // --- Unlocked after Road Trip (6 concerts + friends) ---
  {
    id: "date_concertkehlani",
    title: "Kehlani Concert",
    description: "Vibing to the music together",
    emoji: "🎤",
    deck: "date_concertkehlani",
    category: "concerts",
    unlockAfter: "roadtrip",
  },
  {
    id: "date_concertjhene",
    title: "Jhené Aiko Concert",
    description: "Lost in the melodies",
    emoji: "🎵",
    deck: "date_concertjhene",
    category: "concerts",
    unlockAfter: "roadtrip",
  },
  {
    id: "date_concert1jonas",
    title: "Jonas Brothers Concert",
    description: "Reliving the nostalgia",
    emoji: "🎸",
    deck: "date_concert1jonas",
    category: "concerts",
    unlockAfter: "roadtrip",
  },
  {
    id: "date_friends1",
    title: "Baseball Game",
    description: "Cheering on the home team",
    emoji: "⚾",
    deck: "date_friends1",
    category: "friends",
    unlockAfter: "roadtrip",
  },
  {
    id: "date_friends2",
    title: "Another Baseball Game",
    description: "We never get tired of this",
    emoji: "⚾",
    deck: "date_friends2",
    category: "friends",
    unlockAfter: "roadtrip",
  },
  {
    id: "date_schoolfriends",
    title: "School Friends",
    description: "Catching up with old friends",
    emoji: "👥",
    deck: "date_schoolfriends",
    category: "friends",
    unlockAfter: "roadtrip",
  },

  // --- Unlocked after New York (4 special occasions) ---
  {
    id: "date_valentinesday",
    title: "Valentine's Day",
    description: "Celebrating our love",
    emoji: "💝",
    deck: "date_valentinesday",
    category: "special",
    unlockAfter: "newyork",
  },
  {
    id: "date_jordanbirthday",
    title: "Jordan's Birthday",
    description: "Another year, another celebration",
    emoji: "🎂",
    deck: "date_jordanbirthday",
    category: "special",
    unlockAfter: "newyork",
  },
  {
    id: "date_olliebirthday",
    title: "Ollie's 1st Birthday",
    description: "Celebrating with Vanessa's best friend's family",
    emoji: "🎈",
    deck: "date_olliebirthday",
    category: "special",
    unlockAfter: "newyork",
  },
];

// Helper to get date nights by unlock trigger
export function getDateNightsByUnlock(unlock: string): DateNight[] {
  return DATE_NIGHTS.filter((dn) => dn.unlockAfter === unlock);
}

// Helper to get date nights by category
export function getDateNightsByCategory(category: string): DateNight[] {
  return DATE_NIGHTS.filter((dn) => dn.category === category);
}
