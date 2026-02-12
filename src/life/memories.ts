// src/life/memories.ts

// Disneyland photos
import food from "../assets/photos/dates/disneyland/disneyland.food.jpeg";
import cafe from "../assets/photos/dates/disneyland/disneyland.cafe.jpeg";
import cafelandscape from "../assets/photos/dates/disneyland/disneyland.cafe.landscape.jpeg";
import castlebane from "../assets/photos/dates/disneyland/disneyland.castle.bane.jpeg";
import castletogether1 from "../assets/photos/dates/disneyland/disneyland.castle.together.jpeg";
import castletogether2 from "../assets/photos/dates/disneyland/disneyland.castle.together2.jpeg";
import lunar from "../assets/photos/dates/disneyland/disneyland.lunar.jpeg";
import motel from "../assets/photos/dates/disneyland/disneyland.motel.jpeg";
import popcorn from "../assets/photos/dates/disneyland/disneyland.popcorn.bane.jpeg";
import smallworld from "../assets/photos/dates/disneyland/disneyland.smallworld.jpeg";
import ears from "../assets/photos/dates/disneyland/disneyland.together.ears.jpeg";

// Disneyland video
import fireworksVideo from "../assets/photos/dates/disneyland/disneyland.movie.mov";

export type MemoryItem =
  | {
      id: string;
      type: "photo";
      src: string;
      caption?: string;
    }
  | {
      id: string;
      type: "video";
      src: string;
      caption?: string;
      loop?: boolean; // optional: we can loop “glimpses”
      muted?: boolean;
    };

export const MEMORIES: Record<string, MemoryItem[]> = {
  disneyland: [
    { id: "disney-food", type: "photo", src: food, caption: "A little barbeque to recharge ✨" },
    { id: "cafe", type: "photo", src: cafe, caption: "Taking in the sights at the cafe" },
    { id: "cafe-landscape", type: "photo", src: cafelandscape, caption: "Continuing at the cafe" },
    { id: "castle-bane", type: "photo", src: castlebane, caption: "Bane looking gorgeous as always" },
    { id: "castle-together-1", type: "photo", src: castletogether1, caption: "Us at the castle 💗" },
    { id: "castle-together-2", type: "photo", src: castletogether2, caption: "Us at the castle (again) 💗" },
    { id: "lunar", type: "photo", src: lunar, caption: "A perfect lunar new year" },
    { id: "motel", type: "photo", src: motel, caption: "The motel vibes" },
    { id: "popcorn-bane", type: "photo", src: popcorn, caption: "Popcorn with the popcorn queen" },
    { id: "smallworld", type: "photo", src: smallworld, caption: "It really do be a small world after all" },
    { id: "ears-together", type: "photo", src: ears, caption: "Us with the ears on" },
    {
      id: "fireworks-video",
      type: "video",
      src: fireworksVideo,
      caption: "Fireworks over the castle 💗",
      loop: true,
      muted: true,
    },
  ],
};
// --- Auto-deck loader (Vite) ----------------------------------------------

function filenameNoExt(path: string) {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.[^.]+$/, "");
}

function isVideoFile(path: string) {
  return /\.(mp4|mov|webm|m4v)$/i.test(path);
}

/**
 * Convert a Vite glob() result into a sorted MemoryItem[].
 * Sorting is by file path, so name files like s1_arrival_01.jpg, s1_arrival_02.jpg, etc.
 */
function deckFromGlob(globResult: Record<string, any>): MemoryItem[] {
  const entries = Object.entries(globResult).sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([path, mod]) => {
    const src: string = typeof mod === "string" ? mod : mod.default;
    const id = filenameNoExt(path);

    if (isVideoFile(path)) {
      return {
        id,
        type: "video",
        src,
        loop: true,
        muted: true,
      };
    }

    return {
      id,
      type: "photo",
      src,
    };
  });
}

// --- Seattle Trip 1 decks --------------------------------------------------
// Folder layout: src/photos/trips/seattle1/{threshold,arrival,explore,food,quiet,reflect}

const seattle1Threshold = import.meta.glob("../assets/photos/trips/seattle1/threshold/*", { eager: true });
const seattle1Arrival   = import.meta.glob("../assets/photos/trips/seattle1/arrival/*", { eager: true });
const seattle1Explore   = import.meta.glob("../assets/photos/trips/seattle1/explore/*", { eager: true });
const seattle1Food      = import.meta.glob("../assets/photos/trips/seattle1/food/*", { eager: true });
const seattle1Quiet     = import.meta.glob("../assets/photos/trips/seattle1/quiet/*", { eager: true });
const seattle1Reflect   = import.meta.glob("../assets/photos/trips/seattle1/reflect/*", { eager: true });
// --- Date decks -------------------------------------------------------------
const picnicDate = import.meta.glob("../assets/photos/dates/picnic/*", { eager: true });
MEMORIES["picnic_date"] = deckFromGlob(picnicDate);


MEMORIES["seattle1_threshold"] = deckFromGlob(seattle1Threshold);
MEMORIES["seattle1_arrival"]   = deckFromGlob(seattle1Arrival);
MEMORIES["seattle1_explore"]   = deckFromGlob(seattle1Explore);
MEMORIES["seattle1_food"]      = deckFromGlob(seattle1Food);
MEMORIES["seattle1_quiet"]     = deckFromGlob(seattle1Quiet);
MEMORIES["seattle1_reflect"]   = deckFromGlob(seattle1Reflect);
// Seattle Trip 1 outro deck (same assets as reflect, but used as the "closing beat")
MEMORIES["seattle1_closing"] = MEMORIES["seattle1_reflect"];
const cozyStay = import.meta.glob("../assets/photos/dates/cozy_stay/*", { eager: true });
MEMORIES["cozy_stay"] = deckFromGlob(cozyStay);

// --- Julian Day Trip deck ---------------------------------------------------
const julianTrip = import.meta.glob("../assets/photos/dates/julian/*", { eager: true });
MEMORIES["julian_trip"] = deckFromGlob(julianTrip);

// --- Road Trip decks --------------------------------------------------------
const roadtripJoshuaTree = import.meta.glob("../assets/photos/trips/roadtrip/joshua_tree/*", { eager: true });
const roadtripSequoia = import.meta.glob("../assets/photos/trips/roadtrip/sequoia/*", { eager: true });
const roadtripKingsCanyon = import.meta.glob("../assets/photos/trips/roadtrip/kings_canyon/*", { eager: true });
const roadtripYosemite = import.meta.glob("../assets/photos/trips/roadtrip/yosemite/*", { eager: true });
const roadtripPinnacles = import.meta.glob("../assets/photos/trips/roadtrip/pinnacle/*", { eager: true });
const roadtripMonterey = import.meta.glob("../assets/photos/trips/roadtrip/monterey/*", { eager: true });
const roadtripSolvang = import.meta.glob("../assets/photos/trips/roadtrip/solvang/*", { eager: true });
const roadtripOnTheRoad = import.meta.glob("../assets/photos/trips/roadtrip/on_the_road/*", { eager: true });
const roadtripFood = import.meta.glob("../assets/photos/trips/roadtrip/food/*", { eager: true });

MEMORIES["roadtrip_joshua_tree"] = deckFromGlob(roadtripJoshuaTree);
MEMORIES["roadtrip_sequoia"] = deckFromGlob(roadtripSequoia);
MEMORIES["roadtrip_kings_canyon"] = deckFromGlob(roadtripKingsCanyon);

// Yosemite: put video at the end
const yosemiteDeck = deckFromGlob(roadtripYosemite);
const yosemitePhotos = yosemiteDeck.filter((m) => m.type === "photo");
const yosemiteVideos = yosemiteDeck.filter((m) => m.type === "video");
MEMORIES["roadtrip_yosemite"] = [...yosemitePhotos, ...yosemiteVideos];

MEMORIES["roadtrip_pinnacles"] = deckFromGlob(roadtripPinnacles);
MEMORIES["roadtrip_monterey"] = deckFromGlob(roadtripMonterey);
MEMORIES["roadtrip_solvang"] = deckFromGlob(roadtripSolvang);
MEMORIES["roadtrip_on_the_road"] = deckFromGlob(roadtripOnTheRoad);
MEMORIES["roadtrip_food"] = deckFromGlob(roadtripFood);

// Individual on-the-road segments for specific transitions
const allOnTheRoad = deckFromGlob(roadtripOnTheRoad);

// --- Hawaii Trip decks --------------------------------------------------------
const hawaiiArrival = import.meta.glob("../assets/photos/trips/hawaii/arrival/*", { eager: true });
const hawaiiExplore = import.meta.glob("../assets/photos/trips/hawaii/explore/*", { eager: true });
const hawaiiBoating = import.meta.glob("../assets/photos/trips/hawaii/boating/*", { eager: true });
const hawaiiExplore2 = import.meta.glob("../assets/photos/trips/hawaii/explore2/*", { eager: true });
const hawaiiBeach = import.meta.glob("../assets/photos/trips/hawaii/beach/*", { eager: true });
const hawaiiLuau = import.meta.glob("../assets/photos/trips/hawaii/luau/*", { eager: true });
const hawaiiReflection = import.meta.glob("../assets/photos/trips/hawaii/reflection/*", { eager: true });

MEMORIES["hawaii_arrival"] = deckFromGlob(hawaiiArrival);
MEMORIES["hawaii_explore"] = deckFromGlob(hawaiiExplore);
MEMORIES["hawaii_boating"] = deckFromGlob(hawaiiBoating);
MEMORIES["hawaii_explore2"] = deckFromGlob(hawaiiExplore2);
MEMORIES["hawaii_beach"] = deckFromGlob(hawaiiBeach);
MEMORIES["hawaii_luau"] = deckFromGlob(hawaiiLuau);
MEMORIES["hawaii_reflection"] = deckFromGlob(hawaiiReflection);

// --- Seattle Trip 2 decks --------------------------------------------------------
const seattle2Arrival = import.meta.glob("../assets/photos/trips/seattle2/arrival/*", { eager: true });
const seattle2Flowerfield = import.meta.glob("../assets/photos/trips/seattle2/flowerfield/*", { eager: true });
const seattle2Food = import.meta.glob("../assets/photos/trips/seattle2/food/*", { eager: true });
const seattle2Waterfalls = import.meta.glob("../assets/photos/trips/seattle2/waterfalls/*", { eager: true });
const seattle2Reflection = import.meta.glob("../assets/photos/trips/seattle2/reflection/*", { eager: true });

MEMORIES["seattle2_arrival"] = deckFromGlob(seattle2Arrival);
MEMORIES["seattle2_flowerfield"] = deckFromGlob(seattle2Flowerfield);
MEMORIES["seattle2_food"] = deckFromGlob(seattle2Food);
MEMORIES["seattle2_waterfalls"] = deckFromGlob(seattle2Waterfalls);
MEMORIES["seattle2_reflection"] = deckFromGlob(seattle2Reflection);

// --- New York Trip decks --------------------------------------------------------
const newyorkArrival = import.meta.glob("../assets/photos/trips/newyork/arrival/*", { eager: true });
const newyorkEmpirestate = import.meta.glob("../assets/photos/trips/newyork/empirestate/*", { eager: true });
const newyorkExplore1 = import.meta.glob("../assets/photos/trips/newyork/explore1/*", { eager: true });
const newyorkMuseums = import.meta.glob("../assets/photos/trips/newyork/museums/*", { eager: true });
const newyorkArt = import.meta.glob("../assets/photos/trips/newyork/art/*", { eager: true });
const newyorkTennis = import.meta.glob("../assets/photos/trips/newyork/tennis/*", { eager: true });
const newyorkSummitone = import.meta.glob("../assets/photos/trips/newyork/summitone/*", { eager: true });
const newyorkExplore2 = import.meta.glob("../assets/photos/trips/newyork/explore2/*", { eager: true });
const newyorkFood = import.meta.glob("../assets/photos/trips/newyork/food/*", { eager: true });
const newyorkReflection = import.meta.glob("../assets/photos/trips/newyork/reflection/*", { eager: true });

MEMORIES["newyork_arrival"] = deckFromGlob(newyorkArrival);
MEMORIES["newyork_empirestate"] = deckFromGlob(newyorkEmpirestate);
MEMORIES["newyork_explore1"] = deckFromGlob(newyorkExplore1);
MEMORIES["newyork_museums"] = deckFromGlob(newyorkMuseums);
MEMORIES["newyork_art"] = deckFromGlob(newyorkArt);
MEMORIES["newyork_tennis"] = deckFromGlob(newyorkTennis);
MEMORIES["newyork_summitone"] = deckFromGlob(newyorkSummitone);
MEMORIES["newyork_explore2"] = deckFromGlob(newyorkExplore2);
MEMORIES["newyork_food"] = deckFromGlob(newyorkFood);
MEMORIES["newyork_reflection"] = deckFromGlob(newyorkReflection);

MEMORIES["roadtrip_ontheroad_01"] = allOnTheRoad.filter(m => m.id.includes("01")); // SD -> Joshua Tree
MEMORIES["roadtrip_ontheroad_02"] = allOnTheRoad.filter(m => m.id.includes("02")); // Joshua Tree -> Sequoia
MEMORIES["roadtrip_ontheroad_03"] = allOnTheRoad.filter(m => m.id.includes("03")); // Sequoia -> Kings Canyon
MEMORIES["roadtrip_ontheroad_04"] = allOnTheRoad.filter(m => m.id.includes("04")); // Kings Canyon -> Yosemite
MEMORIES["roadtrip_ontheroad_05"] = allOnTheRoad.filter(m => m.id.includes("05")); // Monterey -> Solvang

// Combined road trip scrapbook deck for Map replay
MEMORIES["roadtrip"] = [
  ...(MEMORIES["roadtrip_joshua_tree"] ?? []),
  ...(MEMORIES["roadtrip_sequoia"] ?? []),
  ...(MEMORIES["roadtrip_kings_canyon"] ?? []),
  ...(MEMORIES["roadtrip_yosemite"] ?? []),
  ...(MEMORIES["roadtrip_pinnacles"] ?? []),
  ...(MEMORIES["roadtrip_monterey"] ?? []),
  ...(MEMORIES["roadtrip_solvang"] ?? []),
];

// --- Seattle Trip 1 combined "scrapbook" deck (for Map replay) -------------

MEMORIES["seattle1"] = [
  ...(MEMORIES["seattle1_threshold"] ?? []),
  ...(MEMORIES["seattle1_arrival"] ?? []),
  ...(MEMORIES["seattle1_explore"] ?? []),
  ...(MEMORIES["seattle1_food"] ?? []),
  ...(MEMORIES["seattle1_quiet"] ?? []),
  ...(MEMORIES["seattle1_reflect"] ?? []),
];

// --- Seattle Trip 2 combined "scrapbook" deck (for Map replay) -------------

MEMORIES["seattle2"] = [
  ...(MEMORIES["seattle2_arrival"] ?? []),
  ...(MEMORIES["seattle2_flowerfield"] ?? []),
  ...(MEMORIES["seattle2_food"] ?? []),
  ...(MEMORIES["seattle2_waterfalls"] ?? []),
  ...(MEMORIES["seattle2_reflection"] ?? []),
];

// --- Date Night decks (unlocked as trips progress) ---------------------------
const dateAquarium = import.meta.glob("../assets/photos/dates/datenights/aquarium/*", { eager: true });
const dateBar = import.meta.glob("../assets/photos/dates/datenights/bar/*", { eager: true });
const dateBreakfast1 = import.meta.glob("../assets/photos/dates/datenights/breakfast1/*", { eager: true });
const dateChristmasGlobe = import.meta.glob("../assets/photos/dates/datenights/christmasglobe/*", { eager: true });
const dateConcert1Jonas = import.meta.glob("../assets/photos/dates/datenights/concert1jonas/*", { eager: true });
const dateConcertJhene = import.meta.glob("../assets/photos/dates/datenights/concertjhene/*", { eager: true });
const dateConcertKehlani = import.meta.glob("../assets/photos/dates/datenights/concertkehlani/*", { eager: true });
const dateDessert1 = import.meta.glob("../assets/photos/dates/datenights/dessert1/*", { eager: true });
const dateDessert2 = import.meta.glob("../assets/photos/dates/datenights/dessert2/*", { eager: true });
const dateFriends1 = import.meta.glob("../assets/photos/dates/datenights/friends1/*", { eager: true });
const dateFriends2 = import.meta.glob("../assets/photos/dates/datenights/friends2/*", { eager: true });
const dateFriendsKbbq = import.meta.glob("../assets/photos/dates/datenights/friendskbbq/*", { eager: true });
const dateFriendsSteakhouse = import.meta.glob("../assets/photos/dates/datenights/friendssteakhouse/*", { eager: true });
const dateHalloween = import.meta.glob("../assets/photos/dates/datenights/halloween/*", { eager: true });
const dateHitokuchi = import.meta.glob("../assets/photos/dates/datenights/hitokuchi/*", { eager: true });
const dateItalian1 = import.meta.glob("../assets/photos/dates/datenights/italian1/*", { eager: true });
const dateJordanBirthday = import.meta.glob("../assets/photos/dates/datenights/jordanbirthday/*", { eager: true });
const dateLunch = import.meta.glob("../assets/photos/dates/datenights/lunch/*", { eager: true });
const dateOakGlenn = import.meta.glob("../assets/photos/dates/datenights/oakglenn/*", { eager: true });
const dateOllieBirthday = import.meta.glob("../assets/photos/dates/datenights/olliebirthday/*", { eager: true });
const dateOmikase = import.meta.glob("../assets/photos/dates/datenights/omikase/*", { eager: true });
const datePinning = import.meta.glob("../assets/photos/dates/datenights/pinning/*", { eager: true });
const datePokemonDayIn = import.meta.glob("../assets/photos/dates/datenights/pokemondayin/*", { eager: true });
const dateSchoolFriends = import.meta.glob("../assets/photos/dates/datenights/schoolfriends/*", { eager: true });
const dateSeaworld = import.meta.glob("../assets/photos/dates/datenights/seaworld/*", { eager: true });
const dateValentinesDay = import.meta.glob("../assets/photos/dates/datenights/valentinesday/*", { eager: true });
const dateZoo1 = import.meta.glob("../assets/photos/dates/datenights/zoo1/*", { eager: true });

MEMORIES["date_aquarium"] = deckFromGlob(dateAquarium);
MEMORIES["date_bar"] = deckFromGlob(dateBar);
MEMORIES["date_breakfast1"] = deckFromGlob(dateBreakfast1);
MEMORIES["date_christmasglobe"] = deckFromGlob(dateChristmasGlobe);
MEMORIES["date_concert1jonas"] = deckFromGlob(dateConcert1Jonas);
MEMORIES["date_concertjhene"] = deckFromGlob(dateConcertJhene);
MEMORIES["date_concertkehlani"] = deckFromGlob(dateConcertKehlani);
MEMORIES["date_dessert1"] = deckFromGlob(dateDessert1);
MEMORIES["date_dessert2"] = deckFromGlob(dateDessert2);
MEMORIES["date_friends1"] = deckFromGlob(dateFriends1);
MEMORIES["date_friends2"] = deckFromGlob(dateFriends2);
MEMORIES["date_friendskbbq"] = deckFromGlob(dateFriendsKbbq);
MEMORIES["date_friendssteakhouse"] = deckFromGlob(dateFriendsSteakhouse);
MEMORIES["date_halloween"] = deckFromGlob(dateHalloween);
MEMORIES["date_hitokuchi"] = deckFromGlob(dateHitokuchi);
MEMORIES["date_italian1"] = deckFromGlob(dateItalian1);
MEMORIES["date_jordanbirthday"] = deckFromGlob(dateJordanBirthday);
MEMORIES["date_lunch"] = deckFromGlob(dateLunch);
MEMORIES["date_oakglenn"] = deckFromGlob(dateOakGlenn);
MEMORIES["date_olliebirthday"] = deckFromGlob(dateOllieBirthday);
MEMORIES["date_omikase"] = deckFromGlob(dateOmikase);
MEMORIES["date_pinning"] = deckFromGlob(datePinning);
MEMORIES["date_pokemondayin"] = deckFromGlob(datePokemonDayIn);
MEMORIES["date_schoolfriends"] = deckFromGlob(dateSchoolFriends);
MEMORIES["date_seaworld"] = deckFromGlob(dateSeaworld);
MEMORIES["date_valentinesday"] = deckFromGlob(dateValentinesDay);
MEMORIES["date_zoo1"] = deckFromGlob(dateZoo1);

export function getMemorySrc(deck: string, id: string): string | null {
  const arr = MEMORIES[deck] ?? [];
  const item = arr.find((m) => m.id === id);
  return item ? item.src : null;
}
