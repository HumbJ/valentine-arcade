// Food Memory Roulette - guess where we ate each meal!

// Import all food photos
import lunch01 from "../assets/photos/dates/datenights/lunch/01.jpeg";
import lunch02 from "../assets/photos/dates/datenights/lunch/02.jpeg";
import newyorkFood01 from "../assets/photos/trips/newyork/food/01.jpeg";
import newyorkFood02 from "../assets/photos/trips/newyork/food/02.jpeg";
import roadtripFood01 from "../assets/photos/trips/roadtrip/food/01.jpeg";
import roadtripFood02 from "../assets/photos/trips/roadtrip/food/02.jpeg";
import roadtripFood03 from "../assets/photos/trips/roadtrip/food/03.jpeg";
import seattle1Food01 from "../assets/photos/trips/seattle1/food/s1_food_01.jpeg";
import seattle1Food02 from "../assets/photos/trips/seattle1/food/s1_food_02.jpeg";
import seattle1Food03 from "../assets/photos/trips/seattle1/food/s1_food_03.jpeg";
import seattle1Food04 from "../assets/photos/trips/seattle1/food/s1_food_04.jpeg";
import seattle1Food05 from "../assets/photos/trips/seattle1/food/s1_food_05.jpeg";
import seattle2Food01 from "../assets/photos/trips/seattle2/food/01.jpeg";
import seattle2Food02 from "../assets/photos/trips/seattle2/food/02.jpeg";
import seattle2Food03 from "../assets/photos/trips/seattle2/food/03.jpeg";
import seattle2Food04 from "../assets/photos/trips/seattle2/food/04.jpeg";
import seattle2Food05 from "../assets/photos/trips/seattle2/food/05.jpeg";
import seattle2Food06 from "../assets/photos/trips/seattle2/food/06.jpeg";

export interface FoodMemory {
  id: string;
  path: string;
  location: string; // The correct answer
  unlockCondition: string; // Event ID that unlocks this food memory
  category: "trip" | "date";
}

export const FOOD_MEMORIES: FoodMemory[] = [
  {
    id: "lunch_01",
    path: lunch01,
    location: "Date Night Lunch",
    unlockCondition: "lunch",
    category: "date",
  },
  {
    id: "lunch_02",
    path: lunch02,
    location: "Date Night Lunch",
    unlockCondition: "lunch",
    category: "date",
  },
  {
    id: "newyork_food_01",
    path: newyorkFood01,
    location: "New York",
    unlockCondition: "newyork",
    category: "trip",
  },
  {
    id: "newyork_food_02",
    path: newyorkFood02,
    location: "New York",
    unlockCondition: "newyork",
    category: "trip",
  },
  {
    id: "roadtrip_food_01",
    path: roadtripFood01,
    location: "Road Trip",
    unlockCondition: "roadtrip",
    category: "trip",
  },
  {
    id: "roadtrip_food_02",
    path: roadtripFood02,
    location: "Road Trip",
    unlockCondition: "roadtrip",
    category: "trip",
  },
  {
    id: "roadtrip_food_03",
    path: roadtripFood03,
    location: "Road Trip",
    unlockCondition: "roadtrip",
    category: "trip",
  },
  {
    id: "seattle1_food_01",
    path: seattle1Food01,
    location: "Seattle (First Visit)",
    unlockCondition: "seattle1",
    category: "trip",
  },
  {
    id: "seattle1_food_02",
    path: seattle1Food02,
    location: "Seattle (First Visit)",
    unlockCondition: "seattle1",
    category: "trip",
  },
  {
    id: "seattle1_food_03",
    path: seattle1Food03,
    location: "Seattle (First Visit)",
    unlockCondition: "seattle1",
    category: "trip",
  },
  {
    id: "seattle1_food_04",
    path: seattle1Food04,
    location: "Seattle (First Visit)",
    unlockCondition: "seattle1",
    category: "trip",
  },
  {
    id: "seattle1_food_05",
    path: seattle1Food05,
    location: "Seattle (First Visit)",
    unlockCondition: "seattle1",
    category: "trip",
  },
  {
    id: "seattle2_food_01",
    path: seattle2Food01,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
  {
    id: "seattle2_food_02",
    path: seattle2Food02,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
  {
    id: "seattle2_food_03",
    path: seattle2Food03,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
  {
    id: "seattle2_food_04",
    path: seattle2Food04,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
  {
    id: "seattle2_food_05",
    path: seattle2Food05,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
  {
    id: "seattle2_food_06",
    path: seattle2Food06,
    location: "Seattle (Second Visit)",
    unlockCondition: "seattle2",
    category: "trip",
  },
];

// All possible location options for the guessing game
export const LOCATION_OPTIONS = [
  "Seattle (First Visit)",
  "Seattle (Second Visit)",
  "New York",
  "Hawaii",
  "Road Trip",
  "Date Night Lunch",
  "Disneyland",
];

// Helper function to check if a food memory is unlocked
export function isFoodUnlocked(food: FoodMemory, completedEvents: string[]): boolean {
  return completedEvents.includes(food.unlockCondition);
}

// Get all unlocked food memories
export function getUnlockedFoodMemories(completedEvents: string[]): FoodMemory[] {
  return FOOD_MEMORIES.filter((food) => isFoodUnlocked(food, completedEvents));
}

// Get food stats
export function getFoodStats(completedEvents: string[]): { unlocked: number; total: number } {
  const unlockedFoods = getUnlockedFoodMemories(completedEvents);
  return {
    unlocked: unlockedFoods.length,
    total: FOOD_MEMORIES.length,
  };
}

// Generate random wrong options for a food memory
export function getRandomOptions(correctLocation: string): string[] {
  const wrongOptions = LOCATION_OPTIONS.filter((loc) => loc !== correctLocation);
  // Shuffle and take 3 random wrong answers
  const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5);
  const threeWrong = shuffled.slice(0, 3);
  // Combine with correct answer and shuffle
  const allOptions = [...threeWrong, correctLocation].sort(() => Math.random() - 0.5);
  return allOptions;
}
