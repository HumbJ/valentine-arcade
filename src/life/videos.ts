// Video repository - organized by trips and dates
// Videos unlock when their corresponding trip/event is completed

// Import video files directly
import seattle1Arrival01 from "../assets/photos/trips/seattle1/arrival/s1_arrival_01.mov";
import seattle1Explore01 from "../assets/photos/trips/seattle1/explore/s1_explore_01.mov";
import seattle1Reflect03 from "../assets/photos/trips/seattle1/reflect/s1_reflect_03.mov";
import seattle2Waterfalls05 from "../assets/photos/trips/seattle2/waterfalls/05.mov";
import seattle2Waterfalls07 from "../assets/photos/trips/seattle2/waterfalls/07.mov";
import seattle2Waterfalls09 from "../assets/photos/trips/seattle2/waterfalls/09.mov";
import newyorkEmpire10 from "../assets/photos/trips/newyork/empirestate/10.mov";
import newyorkTennis05 from "../assets/photos/trips/newyork/tennis/05.mov";
import hawaiiBoating06 from "../assets/photos/trips/hawaii/boating/06.mov";
import hawaiiBoating07 from "../assets/photos/trips/hawaii/boating/07.mov";
import hawaiiBoating08 from "../assets/photos/trips/hawaii/boating/08.mov";
import hawaiiLuau06 from "../assets/photos/trips/hawaii/luau/06.mov";
import hawaiiReflection02 from "../assets/photos/trips/hawaii/reflection/02.mov";
import roadtripFood04 from "../assets/photos/trips/roadtrip/food/04.mov";
import disneylandMovie from "../assets/photos/dates/disneyland/disneyland.movie.mov";
import jonasConcer03 from "../assets/photos/dates/datenights/concert1jonas/03.mov";
import jonasConcert04 from "../assets/photos/dates/datenights/concert1jonas/04.mov";
import halloween04 from "../assets/photos/dates/datenights/halloween/04.mov";
import oakglenn04 from "../assets/photos/dates/datenights/oakglenn/04.mov";
import oakglenn05 from "../assets/photos/dates/datenights/oakglenn/05.mov";

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
        path: seattle1Arrival01,
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_explore",
        title: "Exploring",
        path: seattle1Explore01,
        unlockCondition: "seattle1",
        category: "trip",
      },
      {
        id: "seattle1_reflect",
        title: "Reflection",
        path: seattle1Reflect03,
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
        path: seattle2Waterfalls05,
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_2",
        title: "Waterfalls (Part 2)",
        path: seattle2Waterfalls07,
        unlockCondition: "seattle2",
        category: "trip",
      },
      {
        id: "seattle2_waterfalls_3",
        title: "Waterfalls (Part 3)",
        path: seattle2Waterfalls09,
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
        path: newyorkEmpire10,
        unlockCondition: "newyork",
        category: "trip",
      },
      {
        id: "newyork_tennis",
        title: "Tennis",
        path: newyorkTennis05,
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
        path: hawaiiBoating06,
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_2",
        title: "Boating (Part 2)",
        path: hawaiiBoating07,
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_boating_3",
        title: "Boating (Part 3)",
        path: hawaiiBoating08,
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_luau",
        title: "Luau",
        path: hawaiiLuau06,
        unlockCondition: "hawaii",
        category: "trip",
      },
      {
        id: "hawaii_reflection",
        title: "Reflection",
        path: hawaiiReflection02,
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
        path: roadtripFood04,
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
        path: disneylandMovie,
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
        path: jonasConcer03,
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "concert_jonas_2",
        title: "Jonas Brothers Concert (Part 2)",
        path: jonasConcert04,
        unlockCondition: "concert1jonas",
        category: "date",
      },
      {
        id: "halloween",
        title: "Halloween",
        path: halloween04,
        unlockCondition: "halloween",
        category: "date",
      },
      {
        id: "oakglenn_1",
        title: "Oak Glenn (Part 1)",
        path: oakglenn04,
        unlockCondition: "oakglenn",
        category: "date",
      },
      {
        id: "oakglenn_2",
        title: "Oak Glenn (Part 2)",
        path: oakglenn05,
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
