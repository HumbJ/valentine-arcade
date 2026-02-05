import type { LifeEvent } from "./types";
import { getMemorySrc } from "./memories"; // add at top of events.ts


const earsSrc = getMemorySrc("disneyland", "ears-together") ?? "";
const yosemiteTunnelSrc = getMemorySrc("roadtrip_on_the_road", "06") ?? "";

export const SEATTLE_1_EVENT: LifeEvent = {
  id: "seattle_1",
  title: "Seattle Trip I 🌲",
  text:
    "Your first big trip together. New city air, new routines, and that quiet excitement of doing life side-by-side.",
  choices: [
    {
      id: "on_our_way",
      label: "On our way ✈️",
      effects: [
        { type: "burst", deck: "seattle1_threshold" },
        { type: "goto", eventId: "seattle_1_arrival" },
      ],
    },
  ],
};

export const SEATTLE_1_ARRIVAL: LifeEvent = {
  id: "seattle_1_arrival",
  title: "Arrival",
  text: "The first little moments: landing, settling in, and letting the trip begin.",
  choices: [
    {
      id: "continue",
      label: "Keep going →",
      effects: [
        { type: "burst", deck: "seattle1_arrival" },
        { type: "goto", eventId: "seattle_1_explore" },
        {
  type: "reflectionPrompt",
  id: "test_reflection",
  arc: "test",
  title: "Stay here a moment",
  subtitle: "Only if you want to.",
  prompt: "Just testing — what are you feeling right now?",
}
      ],
    },
  ],
};

export const SEATTLE_1_EXPLORE: LifeEvent = {
  id: "seattle_1_explore",
  title: "Exploring",
  text: "Wandering until the trip finds its rhythm. Streets, views, fresh air, and that feeling of discovery.",
  choices: [
    {
      id: "continue",
      label: "One more chapter →",
      effects: [
  {
    type: "mapDiscover",
    mapId: "seattle1",
    title: "Seattle Trip I — Exploring",
    subtitle: "What four main areas did we explore on this trip? Tap to reveal them.",
  },
  { type: "burst", deck: "seattle1_explore" },
  { type: "goto", eventId: "seattle_1_food" },
],

    },
  ],
};

export const SEATTLE_1_FOOD: LifeEvent = {
  id: "seattle_1_food",
  title: "Food Break",
  text: "A small ritual: trying things, sharing bites, making the city feel like ours.",
  choices: [
    {
      id: "continue",
      label: "Back out we go →",
      effects: [
  { type: "foodOrder", gameId: "seattle1_food", title: "A little food timeline", subtitle: "Put our bites in the order we tried them." },
  { type: "burst", deck: "seattle1_food" },
  { type: "goto", eventId: "seattle_1_museum" }

]
    },
  ],
};

export const SEATTLE_1_MUSEUM: LifeEvent = {
  id: "seattle_1_museum",
  title: "The Museum",
  text: "A slower kind of adventure — wandering quietly, noticing details, and feeling close without needing many words.",
  choices: [
    {
      id: "continue",
      label: "Stay in this moment →",
      effects: [
  { type: "burst", deck: "seattle1_closing" },
  { type: "goto", eventId: "seattle_1_thread" },
]
    },
  ],
};

export const SEATTLE_1_THREAD: LifeEvent = {
  id: "seattle_1_thread",
  title: "Looking back",
  text: "Some trips end when you get home.\n\nThis one didn’t.",
  choices: [
    {
      id: "continue",
      label: "Continue",
      effects: [{ type: "goto", eventId: "seattle_1_reflection_prompt" }],
    },
  ],
};

export const SEATTLE_1_REFLECTION_PROMPT: LifeEvent = {
  id: "seattle_1_reflection_prompt",
  title: "One last thing",
  text: "Before we move on…",
  choices: [
    {
      id: "reflect",
      label: "Take a moment",
     effects: [
  {
    type: "reflectionPrompt",
    id: "seattle1_overall",
    arc: "seattle1",
    title: "Seattle",
    subtitle: "Our first trip together",
    prompt: "How did you feel about our first trip together?",
  },

  // Rewards happen once, at the end of the arc
  { type: "stat", key: "love", delta: 14 },
  { type: "stat", key: "happiness", delta: 10 },
  { type: "stat", key: "memories", delta: 12 },

  { type: "unlockPlace", placeId: "seattle1" },
  {
    type: "log",
    text:
      "Seattle Trip I: our first big adventure — exploring the world and learning how easy it can feel to be together.",
  },

  { type: "goto", eventId: "end_demo" }, // later you can change to post_seattle
],

    },
    {
      id: "skip",
      label: "Maybe later",
      effects: [{ type: "goto", eventId: "end_demo" }],
    },
  ],
};


export const PICNIC_DATE: LifeEvent = {
  id: "picnic_date",
  title: "Picnic Date",
  text: "Just us, a little food, and that soft kind of happy that makes time slow down.",
  choices: [
    {
      id: "continue",
      label: "Let's pack the basket →",
      effects: [
        {
          type: "picnicDate",
          title: "Picnic Date",
          
        },
        // Stats applied after the gate completes
        { type: "stat", key: "love", delta: 5 },
        { type: "stat", key: "happiness", delta: 4 },
        { type: "stat", key: "memories", delta: 3 },
        { type: "log", text: "Picnic date: sunshine, snacks, and us." },
        { type: "gotoHome", markComplete: "picnic" },
      ],
    },
  ],
};

export const JULIAN_DAY_TRIP: LifeEvent = {
  id: "julian_trip",
  title: "Day Trip to Julian",
  text: "A little mountain town famous for apple pie and gold mines. Sounded like the perfect excuse to get out of the city for a day.",
  choices: [
    {
      id: "go",
      label: "Let's see what Julian has in store →",
      effects: [
        { type: "burst", deck: "julian_trip" },
        { type: "stat", key: "love", delta: 3 },
        { type: "stat", key: "happiness", delta: 4 },
        { type: "stat", key: "memories", delta: 6 },
        { type: "log", text: "Julian day trip: pie, mines, and questionable ciders." },
        { type: "goto", eventId: "julian_closing" },
      ],
    },
  ],
};

export const JULIAN_CLOSING: LifeEvent = {
  id: "julian_closing",
  title: "On the Drive Home",
  text: "The pie was worth the drive. The mine tour was... an experience. And those ciders? Let's just say we tried them so we never have to again. But honestly, any adventure with you is a good one.",
  choices: [
    {
      id: "home",
      label: "Back to our life →",
      effects: [{ type: "gotoHome", markComplete: "julian" }],
    },
  ],
};

export const COZY_NEXT_DAY: LifeEvent = {
  id: "cozy_next_day",
  title: "The Next Day",
  text:
    "We talked long into the night—about everything and nothing—until the world got quiet. Now it’s the next day, and I’m still smiling. What do you want to do?",
  choices: [
    {
      id: "picnic",
      label: "Let's go on a picnic date! →",
      effects: [{ type: "goto", eventId: "picnic_date" }],
    },
    {
      id: "julian",
      label: "Day trip to Julian? →",
      effects: [{ type: "goto", eventId: "julian_trip" }],
    },
    {
      id: "stay",
      label: "Stay cozy a little longer",
      effects: [
        { type: "log", text: "We stayed curled up together a bit longer." },
        { type: "burst", deck: "cozy_stay" },
      ],
    },
  ],
};




// =============================================================================
// ROAD TRIP EVENTS
// Route: San Diego -> Joshua Tree -> Sequoia -> Kings Canyon -> Yosemite ->
//        Pinnacles -> Monterey -> Solvang -> San Diego
// =============================================================================

export const ROAD_TRIP_START: LifeEvent = {
  id: "road_trip_start",
  title: "The Great California Road Trip",
  text: "We packed up the car, queued up the playlist, and hit the road. A week of national parks, coastal towns, and adventure awaits.",
  choices: [
    {
      id: "begin",
      label: "Let's hit the road! →",
      effects: [
        {
          type: "reflectionPrompt",
          id: "roadtrip_start",
          arc: "roadtrip",
          title: "Before We Go",
          subtitle: "The adventure begins",
          prompt: "What things were you most excited about for this road trip?",
        },
        { type: "log", text: "Road trip begins! First stop: Joshua Tree." },
        { type: "roadTripMap", fromStop: "san_diego", toStop: "joshua_tree", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_joshua_tree" },
      ],
    },
  ],
};

// --- JOSHUA TREE ---
export const ROAD_TRIP_TO_JOSHUA_TREE: LifeEvent = {
  id: "road_trip_to_joshua_tree",
  title: "Driving to Joshua Tree",
  text: "The city fades behind us as the desert opens up. Weird rock formations start appearing, and those iconic twisted trees dot the landscape.",
  choices: [
    {
      id: "arrive",
      label: "We made it! →",
      effects: [
        { type: "burst", deck: "roadtrip_ontheroad_01", pick: 1 },
        { type: "goto", eventId: "joshua_tree_arrival" },
      ],
    },
  ],
};

export const JOSHUA_TREE_ARRIVAL: LifeEvent = {
  id: "joshua_tree_arrival",
  title: "Joshua Tree National Park",
  text: "There's something alien about this place. The boulders, the spiky trees, the endless sky. And at night? The stars are unreal.",
  choices: [
    {
      id: "explore",
      label: "Time to stargaze →",
      effects: [
        { type: "stargazingMemory", title: "Stargazing", subtitle: "Match the constellations we saw together" },
        { type: "goto", eventId: "joshua_tree_memories" },
      ],
    },
  ],
};

export const JOSHUA_TREE_MEMORIES: LifeEvent = {
  id: "joshua_tree_memories",
  title: "Joshua Tree Moments",
  text: "We climbed rocks, chased sunsets, and made the desert feel like home for a day.",
  choices: [
    {
      id: "photos",
      label: "Relive the memories →",
      effects: [
        { type: "burst", deck: "roadtrip_joshua_tree" },
        { type: "stat", key: "love", delta: 4 },
        { type: "stat", key: "happiness", delta: 5 },
        { type: "stat", key: "memories", delta: 10 },
        { type: "goto", eventId: "joshua_tree_closing" },
      ],
    },
  ],
};

export const JOSHUA_TREE_CLOSING: LifeEvent = {
  id: "joshua_tree_closing",
  title: "Leaving the Desert",
  text: "The stars were incredible, the rocks were wild, and somehow you made the desert feel romantic. Next up: the big trees.",
  choices: [
    {
      id: "next",
      label: "Onward to Sequoia! →",
      effects: [
        { type: "log", text: "Joshua Tree complete. Heading to Sequoia." },
        { type: "roadTripMap", fromStop: "joshua_tree", toStop: "sequoia", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_sequoia" },
      ],
    },
  ],
};

// --- SEQUOIA ---
export const ROAD_TRIP_TO_SEQUOIA: LifeEvent = {
  id: "road_trip_to_sequoia",
  title: "Driving to Sequoia",
  text: "From the desert floor, we climb into the mountains. The temperature drops, the trees get taller, and suddenly we're in a different world.",
  choices: [
    {
      id: "arrive",
      label: "Into the forest →",
      effects: [
        { type: "burst", deck: "roadtrip_ontheroad_02", pick: 1 },
        { type: "goto", eventId: "sequoia_arrival" },
      ],
    },
  ],
};

export const SEQUOIA_ARRIVAL: LifeEvent = {
  id: "sequoia_arrival",
  title: "Sequoia National Park",
  text: "Standing next to these ancient giants makes you feel so small—but in a good way. Some of these trees were saplings when Rome was an empire.",
  choices: [
    {
      id: "explore",
      label: "Walk among giants →",
      effects: [
        { type: "burst", deck: "roadtrip_sequoia" },
        { type: "stat", key: "love", delta: 3 },
        { type: "stat", key: "happiness", delta: 4 },
        { type: "stat", key: "memories", delta: 9 },
        { type: "goto", eventId: "sequoia_closing" },
      ],
    },
  ],
};

export const SEQUOIA_CLOSING: LifeEvent = {
  id: "sequoia_closing",
  title: "Through the Trees",
  text: "The scale of it all is humbling. And somehow, holding your hand while looking up at something that's been alive for millennia... it puts things in perspective.",
  choices: [
    {
      id: "next",
      label: "To Kings Canyon! →",
      effects: [
        { type: "log", text: "Sequoia explored. Kings Canyon awaits." },
        { type: "roadTripMap", fromStop: "sequoia", toStop: "kings_canyon", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_kings_canyon" },
      ],
    },
  ],
};

// --- KINGS CANYON ---
export const ROAD_TRIP_TO_KINGS_CANYON: LifeEvent = {
  id: "road_trip_to_kings_canyon",
  title: "Driving to Kings Canyon",
  text: "Just a short drive from Sequoia, but the landscape shifts dramatically. Deep valleys carved by ancient rivers.",
  choices: [
    {
      id: "arrive",
      label: "Into the canyon →",
      effects: [
        { type: "burst", deck: "roadtrip_ontheroad_03", pick: 1 },
        { type: "goto", eventId: "kings_canyon_arrival" },
      ],
    },
  ],
};

export const KINGS_CANYON_ARRIVAL: LifeEvent = {
  id: "kings_canyon_arrival",
  title: "Kings Canyon",
  text: "The canyon walls tower above us. There's an echo here that makes every sound feel bigger, more significant.",
  choices: [
    {
      id: "explore",
      label: "Listen to the canyon →",
      effects: [
        { type: "canyonEcho", title: "Canyon Echo", subtitle: "Match the rhythm of the mountains" },
        { type: "goto", eventId: "kings_canyon_memories" },
      ],
    },
  ],
};

export const KINGS_CANYON_MEMORIES: LifeEvent = {
  id: "kings_canyon_memories",
  title: "Canyon Views",
  text: "We found viewpoints that took our breath away, and quiet moments that meant even more.",
  choices: [
    {
      id: "photos",
      label: "Take it all in →",
      effects: [
        { type: "burst", deck: "roadtrip_kings_canyon" },
        { type: "stat", key: "love", delta: 4 },
        { type: "stat", key: "happiness", delta: 5 },
        { type: "stat", key: "memories", delta: 6 },
        { type: "goto", eventId: "kings_canyon_closing" },
      ],
    },
  ],
};

export const KINGS_CANYON_CLOSING: LifeEvent = {
  id: "kings_canyon_closing",
  title: "Echoes Fade",
  text: "The canyon holds onto sounds and memories alike. We'll carry this one with us. Time for the crown jewel...",
  choices: [
    {
      id: "next",
      label: "Yosemite awaits! →",
      effects: [
        { type: "log", text: "Kings Canyon complete. The big one: Yosemite." },
        { type: "roadTripMap", fromStop: "kings_canyon", toStop: "yosemite", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_yosemite" },
      ],
    },
  ],
};

// --- YOSEMITE ---
export const ROAD_TRIP_TO_YOSEMITE: LifeEvent = {
  id: "road_trip_to_yosemite",
  title: "Driving to Yosemite",
  text: "The anticipation builds as we wind through mountain roads. Every turn reveals something more stunning than the last.",
  choices: [
    {
      id: "arrive",
      label: "Through the tunnel... →",
      effects: [
        { type: "burst", deck: "roadtrip_ontheroad_04", pick: 1 },
        { type: "goto", eventId: "yosemite_arrival" },
      ],
    },
  ],
};

export const YOSEMITE_ARRIVAL: LifeEvent = {
  id: "yosemite_arrival",
  title: "Yosemite National Park",
  text: "And then... the tunnel. Darkness for a moment, and then the valley opens up before us. Half Dome, El Capitan, waterfalls—it's almost too much.",
  choices: [
    {
      id: "reveal",
      label: "Take in the view →",
      effects: [
        { type: "tunnelViewReveal", imageSrc: yosemiteTunnelSrc, title: "Tunnel View", subtitle: "Wipe away the fog to reveal the magic" },
        { type: "goto", eventId: "yosemite_memories" },
      ],
    },
  ],
};

export const YOSEMITE_MEMORIES: LifeEvent = {
  id: "yosemite_memories",
  title: "Valley of Wonders",
  text: "Waterfalls, granite cliffs, and meadows that look like paintings. Every direction is a postcard.",
  choices: [
    {
      id: "photos",
      label: "Capture the magic →",
      effects: [
        { type: "burst", deck: "roadtrip_yosemite" },
        { type: "stat", key: "love", delta: 6 },
        { type: "stat", key: "happiness", delta: 7 },
        { type: "stat", key: "memories", delta: 7 },
        { type: "goto", eventId: "yosemite_closing" },
      ],
    },
  ],
};

export const YOSEMITE_CLOSING: LifeEvent = {
  id: "yosemite_closing",
  title: "Leaving the Valley",
  text: "Some places change you just by being there. Yosemite is one of them. But we're not done yet—the coast is calling.",
  choices: [
    {
      id: "next",
      label: "To Pinnacles! →",
      effects: [
        {
          type: "reflectionPrompt",
          id: "roadtrip_midpoint",
          arc: "roadtrip",
          title: "Halfway Through",
          subtitle: "Pausing to reflect",
          prompt: "What stood out to you most at this point of the trip?",
        },
        { type: "log", text: "Yosemite complete. Quick stop at Pinnacles." },
        { type: "roadTripMap", fromStop: "yosemite", toStop: "pinnacles", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_pinnacles" },
      ],
    },
  ],
};

// --- PINNACLES ---
export const ROAD_TRIP_TO_PINNACLES: LifeEvent = {
  id: "road_trip_to_pinnacles",
  title: "Driving to Pinnacles",
  text: "A quick detour to one of California's lesser-known parks. Ancient volcanic spires and hidden caves await.",
  choices: [
    {
      id: "arrive",
      label: "A quick stop →",
      effects: [
        { type: "goto", eventId: "pinnacles_arrival" },
      ],
    },
  ],
};

export const PINNACLES_ARRIVAL: LifeEvent = {
  id: "pinnacles_arrival",
  title: "Pinnacles National Park",
  text: "A brief but memorable stop. The rock formations here are unlike anything else—volcanic remnants turned into natural sculptures.",
  choices: [
    {
      id: "snap",
      label: "Snap a memory →",
      effects: [
        { type: "burst", deck: "roadtrip_pinnacles" },
        { type: "stat", key: "memories", delta: 1 },
        { type: "goto", eventId: "pinnacles_closing" },
      ],
    },
  ],
};

export const PINNACLES_CLOSING: LifeEvent = {
  id: "pinnacles_closing",
  title: "Onward",
  text: "Short and sweet. Now let's go see the ocean.",
  choices: [
    {
      id: "next",
      label: "To Monterey! →",
      effects: [
        { type: "log", text: "Pinnacles visited. Ocean time: Monterey." },
        { type: "roadTripMap", fromStop: "pinnacles", toStop: "monterey", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_monterey" },
      ],
    },
  ],
};

// --- MONTEREY ---
export const ROAD_TRIP_TO_MONTEREY: LifeEvent = {
  id: "road_trip_to_monterey",
  title: "Driving to Monterey",
  text: "The mountains give way to rolling hills, and then—finally—the Pacific Ocean. Salt air and crashing waves.",
  choices: [
    {
      id: "arrive",
      label: "Ocean views! →",
      effects: [
        { type: "goto", eventId: "monterey_arrival" },
      ],
    },
  ],
};

export const MONTEREY_ARRIVAL: LifeEvent = {
  id: "monterey_arrival",
  title: "Monterey Bay",
  text: "Tide pools, sea otters, and that perfect coastal town vibe. Time to explore what lives beneath the waves.",
  choices: [
    {
      id: "explore",
      label: "Check out the tide pools →",
      effects: [
        { type: "tidePoolMatch", title: "Tide Pool Discovery", subtitle: "Match the creatures to their names" },
        { type: "goto", eventId: "monterey_memories" },
      ],
    },
  ],
};

export const MONTEREY_MEMORIES: LifeEvent = {
  id: "monterey_memories",
  title: "Coastal Magic",
  text: "The aquarium, the pier, the food... Monterey delivered on every front.",
  choices: [
    {
      id: "photos",
      label: "Seaside memories →",
      effects: [
        { type: "burst", deck: "roadtrip_monterey" },
        { type: "stat", key: "love", delta: 5 },
        { type: "stat", key: "happiness", delta: 6 },
        { type: "stat", key: "memories", delta: 10 },
        { type: "goto", eventId: "monterey_closing" },
      ],
    },
  ],
};

export const MONTEREY_CLOSING: LifeEvent = {
  id: "monterey_closing",
  title: "Leaving the Coast",
  text: "Sea lions barking, waves crashing, and the best clam chowder ever. One more stop before home...",
  choices: [
    {
      id: "next",
      label: "To Solvang! →",
      effects: [
        { type: "log", text: "Monterey explored. Final stop: Solvang." },
        { type: "roadTripMap", fromStop: "monterey", toStop: "solvang", title: "On the Road" },
        { type: "goto", eventId: "road_trip_to_solvang" },
      ],
    },
  ],
};

// --- SOLVANG ---
export const ROAD_TRIP_TO_SOLVANG: LifeEvent = {
  id: "road_trip_to_solvang",
  title: "Driving to Solvang",
  text: "South along the coast, through wine country, to a little Danish village in the middle of California. Why not?",
  choices: [
    {
      id: "arrive",
      label: "Velkommen! →",
      effects: [
        { type: "goto", eventId: "solvang_arrival" },
      ],
    },
  ],
};

export const SOLVANG_ARRIVAL: LifeEvent = {
  id: "solvang_arrival",
  title: "Solvang",
  text: "Windmills, half-timbered buildings, and more pastries than we could ever eat. Though we certainly tried.",
  choices: [
    {
      id: "explore",
      label: "Time for pastries! →",
      effects: [
        { type: "pastryStacker", title: "Danish Delights", subtitle: "Stack the pastries!" },
        { type: "goto", eventId: "solvang_memories" },
      ],
    },
  ],
};

export const SOLVANG_MEMORIES: LifeEvent = {
  id: "solvang_memories",
  title: "A Little Denmark",
  text: "We wandered the streets, tried every bakery, and even visited an ostrich farm (because why not?). It felt like we were somewhere in Europe for a day.",
  choices: [
    {
      id: "photos",
      label: "Sweet memories →",
      effects: [
        { type: "burst", deck: "roadtrip_solvang" },
        { type: "stat", key: "love", delta: 4 },
        { type: "stat", key: "happiness", delta: 6 },
        { type: "stat", key: "memories", delta: 10 },
        { type: "goto", eventId: "solvang_closing" },
      ],
    },
  ],
};

export const SOLVANG_CLOSING: LifeEvent = {
  id: "solvang_closing",
  title: "The Last Stretch",
  text: "Full of pastries and memories, we begin the final drive home. But first... a little food game.",
  choices: [
    {
      id: "food_game",
      label: "One more game! →",
      effects: [
        { type: "goto", eventId: "road_trip_food_game" },
      ],
    },
  ],
};

// --- FOOD GAME & FINALE ---
export const ROAD_TRIP_FOOD_GAME: LifeEvent = {
  id: "road_trip_food_game",
  title: "Road Trip Eats",
  text: "We ate so well on this trip. Can you remember where each meal was from?",
  choices: [
    {
      id: "play",
      label: "Let's see... →",
      effects: [
        { type: "foodLocationMatch", title: "Road Trip Eats", subtitle: "Match each meal to where we had it" },
        { type: "goto", eventId: "road_trip_finale" },
      ],
    },
  ],
};

export const ROAD_TRIP_FINALE: LifeEvent = {
  id: "road_trip_finale",
  title: "Home Again",
  text: "A week of parks, coasts, deserts, and pastries. We saw so much, but the best part was doing it together.",
  choices: [
    {
      id: "finish",
      label: "Back to our little life →",
      effects: [
        { type: "roadTripMap", fromStop: "solvang", toStop: "san_diego", title: "Heading Home" },
        {
          type: "reflectionPrompt",
          id: "roadtrip_end",
          arc: "roadtrip",
          title: "Looking Back",
          subtitle: "Before we close this chapter",
          prompt: "What do you think you'll still remember years from now about this road trip?",
        },
        {
          type: "reflectionReview",
          title: "Our Road Trip Story",
          closingLine: "From the desert to the coast, every mile brought us closer.",
        },
        { type: "stat", key: "love", delta: 10 },
        { type: "stat", key: "happiness", delta: 8 },
        { type: "stat", key: "memories", delta: 5 },
        { type: "unlockPlace", placeId: "roadtrip" },
        { type: "log", text: "California Road Trip: parks, coast, pastries, and us." },
        { type: "gotoHome", markComplete: "roadtrip" },
      ],
    },
  ],
};

export const LIFE_EVENTS: LifeEvent[] = [
  {
    id: "start",
    title: "Our Little Life",
    text:
      "Okay… we’re doing this. A tiny life made of big memories. Where should we begin?",
    choices: [
      {
        id: "begin",
        label: "Start at the beginning 💗",
        effects: [
          { type: "log", text: "We decided to tell our story." },
          { type: "goto", eventId: "first_date" },
        ],
      },
      {
        id: "peek",
        label: "Jump to an adventure ✨",
        effects: [
          { type: "log", text: "We skipped ahead to an adventure." },
          { type: "goto", eventId: "vacation_tease" },
        ],
      },
    ],
  },
  {
    id: "first_date",
    title: "A First Date",
    text:
      "We meet up and it feels easy—like we’ve known each other longer than we have.",
    choices: [
      {
        id: "sweet",
        label: "Lean in and enjoy it",
        effects: [
          { type: "stat", key: "love", delta: 6 },
          { type: "stat", key: "happiness", delta: 5 },
          { type: "log", text: "That first-date glow stayed with us." },
          { type: "goto", eventId: "cozy_night" },
        ],
      },
      {
        id: "nervous",
        label: "Be nervous but honest",
        effects: [
          { type: "stat", key: "love", delta: 4 },
          { type: "stat", key: "happiness", delta: 3 },
          { type: "log", text: "We were nervous… but it was real." },
          { type: "goto", eventId: "cozy_night" },
        ],
      },
    ],
  },
  {
    id: "cozy_night",
    title: "A Cozy Night In",
    text:
      "No big plans. Just us, snacks, and that safe feeling of being together.",
    choices: [
      {
        id: "movie",
        label: "Pick a comfort movie",
        effects: [
          { type: "stat", key: "happiness", delta: 4 },
          { type: "log", text: "Comfort movie night = instant peace." },
          { type: "goto", eventId: "vacation_tease" },
        ],
      },
      {
        id: "talk",
        label: "Talk late into the night",
        effects: [
          { type: "stat", key: "love", delta: 5 },
          { type: "log", text: "We talked long into the night." },
  { type: "goto", eventId: "cozy_next_day" },
],
      },
    ],
  },
  {
    id: "vacation_tease",
    title: "A Trip Idea",
    text:
      "We start talking about vacations—places we’ve been, and places we still want to go.",
    choices: [
      {
        id: "japan",
        label: "Japan 🇯🇵 (food + city lights + trains)",
        effects: [
          { type: "stat", key: "happiness", delta: 4 },
          { type: "log", text: "Japan is officially on the dream list." },
          { type: "goto", eventId: "end_demo" },
        ],
      },
      {
  id: "disneyland",
  label: "Disneyland 🏰 (snacks + rides + fireworks)",
  effects: [
    { type: "log", text: "We started talking about Disneyland… and suddenly we were already there." },
    { type: "goto", eventId: "disneyland_trip" },
  ],
},
{
  id: "seattle1",
  label: "Seattle Trip I 🌲 (our first big trip)",
  effects: [
    { type: "log", text: "We talked about Seattle… and suddenly we were packing." },
    { type: "goto", eventId: "seattle_1" },
  ],
},
{
  id: "roadtrip",
  label: "California Road Trip 🚗 (parks + coast + pastries)",
  effects: [
    { type: "log", text: "We looked at the map… and planned the ultimate California adventure." },
    { type: "goto", eventId: "road_trip_start" },
  ],
},
      {
        id: "cozy",
        label: "Cozy cabin 🏔 (quiet + warm + slow mornings)",
        effects: [
          { type: "stat", key: "happiness", delta: 4 },
          { type: "log", text: "A cabin getaway sounds perfect." },
          { type: "goto", eventId: "end_demo" },
        ],
      },
    ],
  },
  {
  id: "disneyland_trip",
  title: "Disneyland ✨",
  text:
    "A full day of magic — snacks, rides, and the kind of happiness that sticks.",
  choices: [
    {
  id: "relive",
  label: "Unlock the memory 💗",
  effects: [
    { type: "puzzle", imageSrc: earsSrc, rows: 3, cols: 3, title: "Disneyland — Ears Together" },
    { type: "unlockPlace", placeId: "disneyland" },
    { type: "burst", deck: "disneyland" },
    { type: "stat", key: "love", delta: 10 },
    { type: "stat", key: "happiness", delta: 12 },
    { type: "log", text: "Disneyland: pure magic together." },
    { type: "goto", eventId: "end_demo" },
  ],
},
    {
      id: "save_for_later",
      label: "Hold it close and keep going",
      effects: [
        { type: "stat", key: "love", delta: 5 },
        { type: "stat", key: "happiness", delta: 6 },
        { type: "log", text: "We kept the memory tucked away, warm and safe." },
        { type: "goto", eventId: "end_demo" },
      ],
    },
  ],
  
},

{
  id: "end",
  title: "The end (for now)",
  text: "Thank you for playing. If you want, we can read your reflections together one more time.",
  choices: [
    {
      id: "read_reflections",
      label: "Read our reflections",
      effects: [
        {
          type: "reflectionReview",
          title: "A Thousand Feelings",
          closingLine: "These feelings that we hold dear will last a lifetime.",
        },
      ],
    },
    {
      id: "restart",
      label: "Relive it again",
      effects: [{ type: "goto", eventId: "start" }],
    },
  ],
},

 {
  id: "end_demo",
  title: "To Be Continued",
  text:
    "That’s the start… but there’s so much more. Next we’ll plug in real memories: photos, places, food, and little games.",
  choices: [
    {
      id: "restart",
      label: "Start over 🔁",
      effects: [
  {
    type: "reflectionReview",
    title: "A note from us",
    closingLine: "Somewhere along the way, these memories changed “me” into “us.”",
  },
  { type: "goto", eventId: "end" },
],
    },
  ],
},
SEATTLE_1_EVENT,
SEATTLE_1_ARRIVAL,
SEATTLE_1_EXPLORE,
PICNIC_DATE,
JULIAN_DAY_TRIP,
JULIAN_CLOSING,
SEATTLE_1_FOOD,
SEATTLE_1_MUSEUM,
COZY_NEXT_DAY,
SEATTLE_1_THREAD,
SEATTLE_1_REFLECTION_PROMPT,
// Road Trip events
ROAD_TRIP_START,
ROAD_TRIP_TO_JOSHUA_TREE,
JOSHUA_TREE_ARRIVAL,
JOSHUA_TREE_MEMORIES,
JOSHUA_TREE_CLOSING,
ROAD_TRIP_TO_SEQUOIA,
SEQUOIA_ARRIVAL,
SEQUOIA_CLOSING,
ROAD_TRIP_TO_KINGS_CANYON,
KINGS_CANYON_ARRIVAL,
KINGS_CANYON_MEMORIES,
KINGS_CANYON_CLOSING,
ROAD_TRIP_TO_YOSEMITE,
YOSEMITE_ARRIVAL,
YOSEMITE_MEMORIES,
YOSEMITE_CLOSING,
ROAD_TRIP_TO_PINNACLES,
PINNACLES_ARRIVAL,
PINNACLES_CLOSING,
ROAD_TRIP_TO_MONTEREY,
MONTEREY_ARRIVAL,
MONTEREY_MEMORIES,
MONTEREY_CLOSING,
ROAD_TRIP_TO_SOLVANG,
SOLVANG_ARRIVAL,
SOLVANG_MEMORIES,
SOLVANG_CLOSING,
ROAD_TRIP_FOOD_GAME,
ROAD_TRIP_FINALE,
];
