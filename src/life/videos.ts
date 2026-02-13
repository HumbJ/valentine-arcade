// Video repository - organized by trips and dates
// Videos unlock when their corresponding trip/event is completed

export interface Video {
  id: string;
  title: string;
  path: string;
  unlockCondition: string; // Trip ID or event ID that unlocks this video
  category: "trip" | "date";
}

// Helper function to get proper video URL for Vite
export function getVideoUrl(relativePath: string): string {
  return new URL(relativePath, import.meta.url).href;
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
        path: "../assets/photos/trips/seattle1/arrival/s1_arrival_01.mov",
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_explore",
        title: "Exploring",
        path: "../assets/photos/trips/seattle1/explore/s1_explore_01.mov",
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_reflect",
        title: "Reflection",
        path: "../assets/photos/trips/seattle1/reflect/s1_reflect_03.mov",
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
        path: "../assets/photos/trips/seattle2/waterfalls/05.mov",
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_2",
        title: "Waterfalls (Part 2)",
        path: "../assets/photos/trips/seattle2/waterfalls/07.mov",
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_3",
        title: "Waterfalls (Part 3)",
        path: "../assets/photos/trips/seattle2/waterfalls/09.mov",
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
        path: "../assets/photos/trips/newyork/empirestate/10.mov",
        unlockCondition: "newyork",
        category: "trip",
      },
      {
        id: "newyork_tennis",
        title: "Tennis",
        path: "../assets/photos/trips/newyork/tennis/05.mov",
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
        path: "../assets/photos/trips/hawaii/boating/06.mov",
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_2",
        title: "Boating (Part 2)",
        path: "../assets/photos/trips/hawaii/boating/07.mov",
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_3",
        title: "Boating (Part 3)",
        path: "../assets/photos/trips/hawaii/boating/08.mov",
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_luau",
        title: "Luau",
        path: "../assets/photos/trips/hawaii/luau/06.mov",
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_reflection",
        title: "Reflection",
        path: "../assets/photos/trips/hawaii/reflection/02.mov",
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
        path: "../assets/photos/trips/roadtrip/food/04.mov",
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
        path: "../assets/photos/dates/disneyland/disneyland.movie.mov",
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
        path: "../assets/photos/dates/datenights/concert1jonas/03.mov",
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "concert_jonas_2",
        title: "Jonas Brothers Concert (Part 2)",
        path: "../assets/photos/dates/datenights/concert1jonas/04.mov",
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "halloween",
        title: "Halloween",
        path: "../assets/photos/dates/datenights/halloween/04.mov",
        unlockCondition: "halloween",
        category: "date",
      },
      {
        id: "oakglenn_1",
        title: "Oak Glenn (Part 1)",
        path: "../assets/photos/dates/datenights/oakglenn/04.mov",
        unlockCondition: "oakglenn",
        category: "date",
      },
      {
        id: "oakglenn_2",
        title: "Oak Glenn (Part 2)",
        path: "../assets/photos/dates/datenights/oakglenn/05.mov",
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
