// Video repository - organized by trips and dates
// Videos unlock when their corresponding trip/event is completed

// Import all video files using Vite's import.meta.glob
const seattle1ArrivalVideos = import.meta.glob("../assets/photos/trips/seattle1/arrival/*.mov", { eager: true });
const seattle1ExploreVideos = import.meta.glob("../assets/photos/trips/seattle1/explore/*.mov", { eager: true });
const seattle1ReflectVideos = import.meta.glob("../assets/photos/trips/seattle1/reflect/*.mov", { eager: true });
const seattle2WaterfallsVideos = import.meta.glob("../assets/photos/trips/seattle2/waterfalls/*.mov", { eager: true });
const newyorkEmpirestateVideos = import.meta.glob("../assets/photos/trips/newyork/empirestate/*.mov", { eager: true });
const newyorkTennisVideos = import.meta.glob("../assets/photos/trips/newyork/tennis/*.mov", { eager: true });
const hawaiiBoatingVideos = import.meta.glob("../assets/photos/trips/hawaii/boating/*.mov", { eager: true });
const hawaiiLuauVideos = import.meta.glob("../assets/photos/trips/hawaii/luau/*.mov", { eager: true });
const hawaiiReflectionVideos = import.meta.glob("../assets/photos/trips/hawaii/reflection/*.mov", { eager: true });
const roadtripFoodVideos = import.meta.glob("../assets/photos/trips/roadtrip/food/*.mov", { eager: true });
const disneylandVideos = import.meta.glob("../assets/photos/dates/disneyland/*.mov", { eager: true });
const concert1JonasVideos = import.meta.glob("../assets/photos/dates/datenights/concert1jonas/*.mov", { eager: true });
const halloweenVideos = import.meta.glob("../assets/photos/dates/datenights/halloween/*.mov", { eager: true });
const oakglennVideos = import.meta.glob("../assets/photos/dates/datenights/oakglenn/*.mov", { eager: true });

// Helper to get the video URL from glob result
function getVideoUrl(globResult: Record<string, any>, filename: string): string {
  const entries = Object.entries(globResult);
  const match = entries.find(([path]) => path.includes(filename));
  if (!match) return "";
  const [, mod] = match;
  return typeof mod === "string" ? mod : mod.default;
}

export interface Video {
  id: string;
  title: string;
  path: string;
  unlockCondition: string; // Trip ID or event ID that unlocks this video
  category: "trip" | "date";
}

export interface VideoCategory {
  id: string;
  title: string;
  emoji: string;
  videos: Video[];
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: "seattle1",
    title: "Seattle (First Visit)",
    emoji: "🌲",
    videos: [
      {
        id: "seattle1_arrival",
        title: "Arrival",
        path: getVideoUrl(seattle1ArrivalVideos, "s1_arrival_01.mov"),
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_explore",
        title: "Exploring",
        path: getVideoUrl(seattle1ExploreVideos, "s1_explore_01.mov"),
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_reflect",
        title: "Reflection",
        path: getVideoUrl(seattle1ReflectVideos, "s1_reflect_03.mov"),
        unlockCondition: "seattle1",
        category: "trip",
      },
    ],
  },
  {
    id: "seattle2",
    title: "Seattle (Second Visit)",
    emoji: "🌊",
    videos: [
      {
        id: "seattle2_waterfalls_1",
        title: "Waterfalls (Part 1)",
        path: getVideoUrl(seattle2WaterfallsVideos, "05.mov"),
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_2",
        title: "Waterfalls (Part 2)",
        path: getVideoUrl(seattle2WaterfallsVideos, "07.mov"),
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_3",
        title: "Waterfalls (Part 3)",
        path: getVideoUrl(seattle2WaterfallsVideos, "09.mov"),
        unlockCondition: "seattle2",
        category: "trip",
      },
    ],
  },
  {
    id: "newyork",
    title: "New York",
    emoji: "🗽",
    videos: [
      {
        id: "newyork_empire",
        title: "Empire State Building",
        path: getVideoUrl(newyorkEmpirestateVideos, "10.mov"),
        unlockCondition: "newyork",
        category: "trip",
      },
      {
        id: "newyork_tennis",
        title: "Tennis",
        path: getVideoUrl(newyorkTennisVideos, "05.mov"),
        unlockCondition: "newyork",
        category: "trip",
      },
    ],
  },
  {
    id: "hawaii",
    title: "Hawaii",
    emoji: "🌺",
    videos: [
      {
        id: "hawaii_boating_1",
        title: "Boating (Part 1)",
        path: getVideoUrl(hawaiiBoatingVideos, "06.mov"),
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_2",
        title: "Boating (Part 2)",
        path: getVideoUrl(hawaiiBoatingVideos, "07.mov"),
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_3",
        title: "Boating (Part 3)",
        path: getVideoUrl(hawaiiBoatingVideos, "08.mov"),
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_luau",
        title: "Luau",
        path: getVideoUrl(hawaiiLuauVideos, "06.mov"),
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_reflection",
        title: "Reflection",
        path: getVideoUrl(hawaiiReflectionVideos, "02.mov"),
        unlockCondition: "hawaii",
        category: "trip",
      },
    ],
  },
  {
    id: "roadtrip",
    title: "Road Trip",
    emoji: "🚗",
    videos: [
      {
        id: "roadtrip_food",
        title: "Food Stops",
        path: getVideoUrl(roadtripFoodVideos, "04.mov"),
        unlockCondition: "roadtrip",
        category: "trip",
      },
    ],
  },
  {
    id: "disneyland",
    title: "Disneyland",
    emoji: "🏰",
    videos: [
      {
        id: "disneyland_movie",
        title: "Disneyland Day",
        path: getVideoUrl(disneylandVideos, "disneyland.movie.mov"),
        unlockCondition: "disneyland",
        category: "date",
      },
    ],
  },
  {
    id: "datenights",
    title: "Date Nights",
    emoji: "💝",
    videos: [
      {
        id: "concert_jonas_1",
        title: "Jonas Brothers Concert (Part 1)",
        path: getVideoUrl(concert1JonasVideos, "03.mov"),
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "concert_jonas_2",
        title: "Jonas Brothers Concert (Part 2)",
        path: getVideoUrl(concert1JonasVideos, "04.mov"),
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "halloween",
        title: "Halloween",
        path: getVideoUrl(halloweenVideos, "04.mov"),
        unlockCondition: "halloween",
        category: "date",
      },
      {
        id: "oakglenn_1",
        title: "Oak Glenn (Part 1)",
        path: getVideoUrl(oakglennVideos, "04.mov"),
        unlockCondition: "oakglenn",
        category: "date",
      },
      {
        id: "oakglenn_2",
        title: "Oak Glenn (Part 2)",
        path: getVideoUrl(oakglennVideos, "05.mov"),
        unlockCondition: "oakglenn",
        category: "date",
      },
    ],
  },
];

// Helper function to check if a video is unlocked
export function isVideoUnlocked(video: Video, completedTrips: string[]): boolean {
  return completedTrips.includes(video.unlockCondition);
}

// Get all unlocked videos for a category
export function getUnlockedVideosForCategory(
  categoryId: string,
  completedTrips: string[]
): Video[] {
  const category = VIDEO_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  return category.videos.filter((video) => isVideoUnlocked(video, completedTrips));
}

// Get total count of videos and unlocked videos
export function getVideoStats(completedTrips: string[]): { unlocked: number; total: number } {
  const allVideos = VIDEO_CATEGORIES.flatMap((cat) => cat.videos);
  const unlockedVideos = allVideos.filter((video) => isVideoUnlocked(video, completedTrips));

  return {
    unlocked: unlockedVideos.length,
    total: allVideos.length,
  };
}
