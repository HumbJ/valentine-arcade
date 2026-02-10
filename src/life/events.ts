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
  { type: "unlockDateNights", tripId: "seattle1" },
  {
    type: "log",
    text:
      "Seattle Trip I: our first big adventure — exploring the world and learning how easy it can feel to be together.",
  },

  { type: "gotoHome", markComplete: "seattle1" },
],

    },
    {
      id: "skip",
      label: "Maybe later",
      effects: [
        // Skip reflection but still give rewards and complete the trip
        { type: "stat", key: "love", delta: 14 },
        { type: "stat", key: "happiness", delta: 10 },
        { type: "stat", key: "memories", delta: 12 },
        { type: "unlockPlace", placeId: "seattle1" },
        { type: "unlockDateNights", tripId: "seattle1" },
        {
          type: "log",
          text:
            "Seattle Trip I: our first big adventure — exploring the world and learning how easy it can feel to be together.",
        },
        { type: "gotoHome", markComplete: "seattle1" },
      ],
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
    "We talked long into the night—about everything and nothing—until the world got quiet. Now it's the next day, and I'm still smiling. What do you want to do?",
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
        { type: "stat", key: "love", delta: 3 },
        { type: "stat", key: "happiness", delta: 2 },
        { type: "goto", eventId: "activity_hub" },
      ],
    },
    {
      id: "back",
      label: "← Back",
      effects: [
        { type: "goto", eventId: "activity_hub" },
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
        { type: "stat", key: "love", delta: 10 },
        { type: "stat", key: "happiness", delta: 8 },
        { type: "stat", key: "memories", delta: 5 },
        { type: "unlockPlace", placeId: "roadtrip" },
  { type: "unlockDateNights", tripId: "roadtrip" },
        { type: "log", text: "California Road Trip: parks, coast, pastries, and us." },
        { type: "gotoHome", markComplete: "roadtrip" },
      ],
    },
  ],
};

// =============================================================================
// HAWAII TRIP EVENTS
// =============================================================================

export const HAWAII_TRIP_START: LifeEvent = {
  id: "hawaii_trip_start",
  title: "Hawaii Trip 🌺",
  text: "Island time. Ocean air. That feeling when you land somewhere completely different and know a week of magic is ahead.",
  choices: [
    {
      id: "begin",
      label: "Lei's go! ✈️",
      effects: [
        { type: "log", text: "Hawaii trip begins! Aloha awaits." },
        { type: "goto", eventId: "hawaii_arrival" },
      ],
    },
  ],
};

export const HAWAII_ARRIVAL: LifeEvent = {
  id: "hawaii_arrival",
  title: "Arrival",
  text: "Warm breeze, flower leis, and that instant switch to island pace. We're here.",
  choices: [
    {
      id: "continue",
      label: "Breathe it in →",
      effects: [
        { type: "burst", deck: "hawaii_arrival" },
        {
          type: "reflectionPrompt",
          id: "hawaii_arrival",
          arc: "hawaii",
          title: "Just Landed",
          subtitle: "That first moment",
          prompt: "What did it feel like when we first arrived in Hawaii?",
        },
        { type: "goto", eventId: "hawaii_explore" },
      ],
    },
  ],
};

export const HAWAII_EXPLORE: LifeEvent = {
  id: "hawaii_explore",
  title: "Exploring",
  text: "Driving around the island, windows down, every turn revealing something new. Mountains, beaches, hidden waterfalls.",
  choices: [
    {
      id: "continue",
      label: "Keep exploring →",
      effects: [
        {
          type: "islandDrive",
          title: "Island Drive",
          subtitle: "Remember the route around the island!",
        },
        { type: "burst", deck: "hawaii_explore" },
        { type: "goto", eventId: "hawaii_boating" },
      ],
    },
  ],
};

export const HAWAII_BOATING: LifeEvent = {
  id: "hawaii_boating",
  title: "On the Water",
  text: "Out on the ocean, the island shrinking behind us. Dolphins leap, turtles surface, and the water is so clear it feels unreal.",
  choices: [
    {
      id: "continue",
      label: "Watch the ocean →",
      effects: [
        {
          type: "oceanSpotting",
          title: "Ocean Spotting",
          subtitle: "Spot the sea creatures before they swim away!",
        },
        { type: "burst", deck: "hawaii_boating" },
        { type: "goto", eventId: "hawaii_explore2" },
      ],
    },
  ],
};

export const HAWAII_EXPLORE2: LifeEvent = {
  id: "hawaii_explore2",
  title: "More Adventures",
  text: "Waterfalls, hikes, shave ice, and that perfect kind of tired that comes from doing everything. The days blur together in the best way.",
  choices: [
    {
      id: "continue",
      label: "Keep going →",
      effects: [
        { type: "burst", deck: "hawaii_explore2" },
        {
          type: "reflectionPrompt",
          id: "hawaii_midpoint",
          arc: "hawaii",
          title: "Halfway Through",
          subtitle: "Pausing for a moment",
          prompt: "What's been your favorite part of the trip so far?",
        },
        { type: "goto", eventId: "hawaii_beach" },
      ],
    },
  ],
};

export const HAWAII_BEACH: LifeEvent = {
  id: "hawaii_beach",
  title: "Beach Day",
  text: "Golden sand, warm water, and nowhere to be. We collect shells, watch the waves, and let time disappear.",
  choices: [
    {
      id: "continue",
      label: "Walk the shore →",
      effects: [
        {
          type: "shellMerge",
          title: "Shell Merge",
          subtitle: "Collect and merge shells from the beach!",
        },
        { type: "burst", deck: "hawaii_beach" },
        { type: "goto", eventId: "hawaii_luau" },
      ],
    },
  ],
};

export const HAWAII_LUAU: LifeEvent = {
  id: "hawaii_luau",
  title: "Luau Night",
  text: "Fire dancers, flower leis, and food that tastes like the island itself. The night air is perfect, and everything feels a little bit magical.",
  choices: [
    {
      id: "continue",
      label: "Make a lei →",
      effects: [
        {
          type: "leiPattern",
          title: "Lei Pattern",
          subtitle: "Remember the flowers in the lei!",
        },
        { type: "burst", deck: "hawaii_luau" },
        { type: "goto", eventId: "hawaii_reflection" },
      ],
    },
  ],
};

export const HAWAII_REFLECTION: LifeEvent = {
  id: "hawaii_reflection",
  title: "Last Morning",
  text: "The trip is ending, but the feeling stays. Some places change you.",
  choices: [
    {
      id: "reflect",
      label: "One last moment",
      effects: [
        { type: "burst", deck: "hawaii_reflection" },
        {
          type: "reflectionPrompt",
          id: "hawaii_end",
          arc: "hawaii",
          title: "Aloha",
          subtitle: "Before we leave",
          prompt: "What will you carry home from Hawaii?",
        },
        { type: "stat", key: "love", delta: 12 },
        { type: "stat", key: "happiness", delta: 14 },
        { type: "stat", key: "memories", delta: 15 },
        { type: "unlockPlace", placeId: "hawaii" },
  { type: "unlockDateNights", tripId: "hawaii" },
        { type: "log", text: "Hawaii: island magic, ocean dreams, and endless aloha." },
        { type: "gotoHome", markComplete: "hawaii" },
      ],
    },
  ],
};

// ============================================
// SEATTLE TRIP 2
// ============================================

const SEATTLE2_TRIP_START: LifeEvent = {
  id: "seattle2_trip_start",
  title: "Seattle Trip II 🌸",
  text: "Back to the Northwest, but this time we know where we're going. New adventures in familiar places, and the kind of comfort that comes from returning somewhere that already feels like home.",
  choices: [
    {
      id: "begin",
      label: "Let's go back ✈️",
      effects: [
        { type: "log", text: "Seattle Trip II begins! The Northwest welcomes us again." },
        { type: "goto", eventId: "seattle2_arrival" },
      ],
    },
  ],
};

export const SEATTLE2_ARRIVAL: LifeEvent = {
  id: "seattle2_arrival",
  title: "Arrival",
  text: "Landing again. The air smells the same, but everything feels different when you're coming back. We're not tourists this time — we're returning.",
  choices: [
    {
      id: "continue",
      label: "We're back →",
      effects: [
        { type: "burst", deck: "seattle2_arrival" },
        {
          type: "reflectionPrompt",
          id: "seattle2_arrival",
          arc: "seattle2",
          title: "Returning",
          subtitle: "Landing again",
          prompt: "How does it feel to come back to Seattle?",
        },
        { type: "goto", eventId: "seattle2_flowerfield" },
      ],
    },
  ],
};

export const SEATTLE2_FLOWERFIELD: LifeEvent = {
  id: "seattle2_flowerfield",
  title: "Flower Fields",
  text: "Endless rows of tulips, every color imaginable. We walk between them, and it feels like stepping into a painting. The kind of beautiful that makes you stop and just breathe.",
  choices: [
    {
      id: "continue",
      label: "Take it all in →",
      effects: [
        {
          type: "bouquetRush",
          title: "Bouquet Rush",
          subtitle: "Fulfill flower orders quickly!",
        },
        { type: "burst", deck: "seattle2_flowerfield" },
        { type: "goto", eventId: "seattle2_food" },
      ],
    },
  ],
};

export const SEATTLE2_FOOD: LifeEvent = {
  id: "seattle2_food",
  title: "Food",
  text: "We try everything. New spots, old favorites, and the kind of meals that turn into stories. Every bite tastes a little better when you're here together.",
  choices: [
    {
      id: "continue",
      label: "Keep eating →",
      effects: [
        { type: "burst", deck: "seattle2_food" },
        { type: "goto", eventId: "seattle2_waterfalls" },
      ],
    },
  ],
};

export const SEATTLE2_WATERFALLS: LifeEvent = {
  id: "seattle2_waterfalls",
  title: "Waterfalls",
  text: "The sound of water crashing down, mist in the air, and rocks to climb. We hop across, laughing when we almost slip, and the world feels wild and perfect.",
  choices: [
    {
      id: "continue",
      label: "Jump across →",
      effects: [
        {
          type: "waterfallHop",
          title: "Waterfall Hop",
          subtitle: "Jump across the rocks!",
        },
        { type: "burst", deck: "seattle2_waterfalls" },
        { type: "goto", eventId: "seattle2_reflection" },
      ],
    },
  ],
};

export const SEATTLE2_REFLECTION: LifeEvent = {
  id: "seattle2_reflection",
  title: "Reflection",
  text: "The trip is winding down, but we're already thinking about coming back again. Some places just pull you in.",
  choices: [
    {
      id: "reflect",
      label: "One last moment",
      effects: [
        { type: "burst", deck: "seattle2_reflection" },
        {
          type: "reflectionPrompt",
          id: "seattle2_end",
          arc: "seattle2",
          title: "Until Next Time",
          subtitle: "Before we leave",
          prompt: "What made this trip special?",
        },
        { type: "stat", key: "love", delta: 10 },
        { type: "stat", key: "happiness", delta: 12 },
        { type: "stat", key: "memories", delta: 13 },
        { type: "unlockPlace", placeId: "seattle2" },
  { type: "unlockDateNights", tripId: "seattle2" },
        { type: "log", text: "Seattle Trip II: flowers, waterfalls, and the feeling of coming home." },
        { type: "gotoHome", markComplete: "seattle2" },
      ],
    },
  ],
};

// ============================================
// RANDOM POP-UP MINI-EVENTS
// ============================================

const RANDOM_MOVIE_NIGHT: LifeEvent = {
  id: "random_movie_night",
  title: "Movie Night 🎬",
  text: "Time to pick something to watch. What's the vibe tonight?",
  choices: [
    {
      id: "mystery",
      label: "Mystery - Something twisty 🕵️",
      effects: [
        { type: "goto", eventId: "movie_mystery" },
      ],
    },
    {
      id: "romance",
      label: "Romance - Cozy and sweet 💕",
      effects: [
        { type: "goto", eventId: "movie_romance" },
      ],
    },
    {
      id: "comedy",
      label: "Comedy - Need some laughs 😂",
      effects: [
        { type: "goto", eventId: "movie_comedy" },
      ],
    },
    {
      id: "adventure",
      label: "Adventure - Epic journey ⚔️",
      effects: [
        { type: "goto", eventId: "movie_adventure" },
      ],
    },
  ],
};

const MOVIE_MYSTERY: LifeEvent = {
  id: "movie_mystery",
  title: "Mystery Movie",
  text: "Plot twists, red herrings, and trying to solve it before the reveal. Let's see if you can spot the clues...",
  choices: [
    {
      id: "play",
      label: "Start watching 🔍",
      effects: [
        {
          type: "spotTheClues",
          title: "Spot the Clues",
          subtitle: "Find the hidden clues before they disappear",
        },
        { type: "stat", key: "love", delta: 3 },
        { type: "stat", key: "happiness", delta: 4 },
        { type: "log", text: "We solved the mystery before the ending!" },
        { type: "gotoHome" },
      ],
    },
  ],
};

const MOVIE_ROMANCE: LifeEvent = {
  id: "movie_romance",
  title: "Romance Movie",
  text: "Soft lighting, heartfelt moments, and that warm fuzzy feeling. Perfect for cuddling up together.",
  choices: [
    {
      id: "watch",
      label: "Settle in close 💖",
      effects: [
        {
          type: "perfectMoment",
          title: "Perfect Moment",
          subtitle: "Capture the feeling at just the right time",
        },
        { type: "stat", key: "love", delta: 6 },
        { type: "stat", key: "happiness", delta: 3 },
        { type: "log", text: "Watched a romance that hit close to home." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const MOVIE_COMEDY: LifeEvent = {
  id: "movie_comedy",
  title: "Comedy Movie",
  text: "Time for some laughs! Nothing beats those moments when you both crack up at the same joke.",
  choices: [
    {
      id: "laugh",
      label: "Let's go! 🎭",
      effects: [
        {
          type: "giggleGauge",
          title: "Giggle Gauge",
          subtitle: "Nail the timing for maximum laughs!",
        },
        { type: "stat", key: "happiness", delta: 7 },
        { type: "stat", key: "love", delta: 2 },
        { type: "log", text: "Laughed so hard we had to pause the movie." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const MOVIE_ADVENTURE: LifeEvent = {
  id: "movie_adventure",
  title: "Adventure Movie",
  text: "Epic quests, daring heroes, and edge-of-your-seat moments. Let's go on this journey together!",
  choices: [
    {
      id: "adventure",
      label: "Start the quest! 🗡️",
      effects: [
        {
          type: "epicEscape",
          title: "Epic Escape",
          subtitle: "React fast or get left behind!",
        },
        { type: "stat", key: "happiness", delta: 5 },
        { type: "stat", key: "memories", delta: 2 },
        { type: "log", text: "Felt like we went on our own adventure." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const RANDOM_PIZZA_NIGHT: LifeEvent = {
  id: "random_pizza_night",
  title: "Pizza Debate 🍕",
  text: "The eternal question: what toppings?",
  choices: [
    {
      id: "weird",
      label: "Let's get weird with it 🎲",
      effects: [
        { type: "stat", key: "happiness", delta: 4 },
        { type: "log", text: "Ordered pineapple on pizza. No regrets." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "classic",
      label: "Classic pepperoni, always 🍕",
      effects: [
        { type: "stat", key: "love", delta: 3 },
        { type: "log", text: "Sometimes the classics are perfect." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "fancy",
      label: "Make it fancy tonight ✨",
      effects: [
        { type: "stat", key: "happiness", delta: 3 },
        { type: "stat", key: "love", delta: 2 },
        { type: "log", text: "Tried something new. It was delicious." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const RANDOM_COZY_NIGHT: LifeEvent = {
  id: "random_cozy_night",
  title: "Cozy Night In 🌙",
  text: "No plans, just vibes. What sounds good?",
  choices: [
    {
      id: "talk",
      label: "Talk about everything 💬",
      effects: [
        { type: "stat", key: "love", delta: 5 },
        { type: "log", text: "Talked for hours about nothing and everything." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "music",
      label: "Put on some music 🎵",
      effects: [
        { type: "stat", key: "happiness", delta: 4 },
        { type: "log", text: "Found the perfect playlist for the mood." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "stargazing",
      label: "Look at the stars ⭐",
      effects: [
        { type: "stat", key: "memories", delta: 3 },
        { type: "stat", key: "love", delta: 3 },
        { type: "log", text: "Stargazing from the window, peaceful and close." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const RANDOM_FRIEND_TEXT: LifeEvent = {
  id: "random_friend_text",
  title: "Friends Want to Hang! 📱",
  text: "Group chat is buzzing. Want to go out or keep it chill?",
  choices: [
    {
      id: "go_out",
      label: "Let's go! Social time 🎉",
      effects: [
        { type: "stat", key: "happiness", delta: 5 },
        { type: "log", text: "Had a blast with friends. Good energy." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "rain_check",
      label: "Rain check, just us tonight 💕",
      effects: [
        { type: "stat", key: "love", delta: 4 },
        { type: "log", text: "Chose quality time together over going out." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "invite_over",
      label: "Invite them here? 🏠",
      effects: [
        { type: "stat", key: "happiness", delta: 4 },
        { type: "stat", key: "love", delta: 2 },
        { type: "log", text: "Hosted friends at home. Best of both worlds." },
        { type: "gotoHome" },
      ],
    },
  ],
};

const RANDOM_ADVENTURE_CALL: LifeEvent = {
  id: "random_adventure_call",
  title: "Feeling Adventurous? ✨",
  text: "That spontaneous energy is calling. What sounds exciting?",
  choices: [
    {
      id: "day_trip",
      label: "Quick day trip 🚗",
      effects: [
        { type: "stat", key: "memories", delta: 4 },
        { type: "stat", key: "happiness", delta: 3 },
        { type: "log", text: "Spontaneous drive led to unexpected adventures." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "try_something",
      label: "Try something new 🎲",
      effects: [
        { type: "stat", key: "happiness", delta: 5 },
        { type: "log", text: "Stepped out of our comfort zone together." },
        { type: "gotoHome" },
      ],
    },
    {
      id: "explore_local",
      label: "Explore nearby 🗺️",
      effects: [
        { type: "stat", key: "memories", delta: 3 },
        { type: "stat", key: "love", delta: 3 },
        { type: "log", text: "Found hidden gems in our own neighborhood." },
        { type: "gotoHome" },
      ],
    },
  ],
};


// ===============================
// DATE NIGHT EVENTS
// ===============================
// Simple photo viewing events that unlock as trips progress

export const DATE_BREAKFAST1: LifeEvent = {
  id: "date_breakfast1",
  title: "Morning Brunch",
  text: "Lazy Sunday mornings. Pancakes, mimosas, and conversations that stretch into the afternoon. This is how we start the best days.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_breakfast1" },
      { type: "experienceDateNight", dateNightId: "date_breakfast1" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_LUNCH: LifeEvent = {
  id: "date_lunch",
  title: "Lunch Date",
  text: "A quiet break in the middle of the day. Just us, good food, and the kind of easy conversation that makes everything feel lighter.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_lunch" },
      { type: "experienceDateNight", dateNightId: "date_lunch" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_DESSERT1: LifeEvent = {
  id: "date_dessert1",
  title: "Sweet Treats",
  text: "Indulging our sweet tooth.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_dessert1" },
      { type: "experienceDateNight", dateNightId: "date_dessert1" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_BAR: LifeEvent = {
  id: "date_bar",
  title: "Evening Drinks",
  text: "Unwinding after a long week.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_bar" },
      { type: "experienceDateNight", dateNightId: "date_bar" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_ITALIAN1: LifeEvent = {
  id: "date_italian1",
  title: "Italian Night",
  text: "Classic Italian cuisine and candlelight.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_italian1" },
      { type: "experienceDateNight", dateNightId: "date_italian1" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_POKEMONDAYIN: LifeEvent = {
  id: "date_pokemondayin",
  title: "Pokemon Day In",
  text: "A cozy day at home catching 'em all.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_pokemondayin" },
      { type: "experienceDateNight", dateNightId: "date_pokemondayin" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_ZOO1: LifeEvent = {
  id: "date_zoo1",
  title: "Zoo Adventure",
  text: "Exploring the animal kingdom together.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_zoo1" },
      { type: "experienceDateNight", dateNightId: "date_zoo1" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_AQUARIUM: LifeEvent = {
  id: "date_aquarium",
  title: "Aquarium Visit",
  text: "Mesmerized by the underwater world.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_aquarium" },
      { type: "experienceDateNight", dateNightId: "date_aquarium" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_SEAWORLD: LifeEvent = {
  id: "date_seaworld",
  title: "SeaWorld Day",
  text: "Marine life and ocean adventures.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_seaworld" },
      { type: "experienceDateNight", dateNightId: "date_seaworld" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_DESSERT2: LifeEvent = {
  id: "date_dessert2",
  title: "Dessert Spot",
  text: "Finding new favorite sweet spots.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_dessert2" },
      { type: "experienceDateNight", dateNightId: "date_dessert2" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_OMIKASE: LifeEvent = {
  id: "date_omikase",
  title: "Omakase Night",
  text: "Trusting the chef's choice.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_omikase" },
      { type: "experienceDateNight", dateNightId: "date_omikase" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_HITOKUCHI: LifeEvent = {
  id: "date_hitokuchi",
  title: "Hitokuchi",
  text: "Japanese izakaya experience.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_hitokuchi" },
      { type: "experienceDateNight", dateNightId: "date_hitokuchi" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_CHRISTMASGLOBE: LifeEvent = {
  id: "date_christmasglobe",
  title: "Christmas Globes",
  text: "Holiday magic and twinkling lights.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_christmasglobe" },
      { type: "experienceDateNight", dateNightId: "date_christmasglobe" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_HALLOWEEN: LifeEvent = {
  id: "date_halloween",
  title: "Halloween Night",
  text: "Spooky season celebrations.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_halloween" },
      { type: "experienceDateNight", dateNightId: "date_halloween" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_PINNING: LifeEvent = {
  id: "date_pinning",
  title: "Pinning Ceremony",
  text: "A proud moment celebrated together.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_pinning" },
      { type: "experienceDateNight", dateNightId: "date_pinning" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_OAKGLENN: LifeEvent = {
  id: "date_oakglenn",
  title: "Oak Glen",
  text: "Apple picking in the fall.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_oakglenn" },
      { type: "experienceDateNight", dateNightId: "date_oakglenn" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_FRIENDSKBBQ: LifeEvent = {
  id: "date_friendskbbq",
  title: "Korean BBQ with Friends",
  text: "Good food and great company.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_friendskbbq" },
      { type: "experienceDateNight", dateNightId: "date_friendskbbq" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_FRIENDSSTEAKHOUSE: LifeEvent = {
  id: "date_friendssteakhouse",
  title: "Steakhouse Night",
  text: "Celebrating with friends.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_friendssteakhouse" },
      { type: "experienceDateNight", dateNightId: "date_friendssteakhouse" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_CONCERTKEHLANI: LifeEvent = {
  id: "date_concertkehlani",
  title: "Kehlani Concert",
  text: "Vibing to the music together.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_concertkehlani" },
      { type: "experienceDateNight", dateNightId: "date_concertkehlani" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_CONCERTJHENE: LifeEvent = {
  id: "date_concertjhene",
  title: "Jhené Aiko Concert",
  text: "Lost in the melodies.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_concertjhene" },
      { type: "experienceDateNight", dateNightId: "date_concertjhene" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_CONCERT1JONAS: LifeEvent = {
  id: "date_concert1jonas",
  title: "Jonas Brothers Concert",
  text: "Reliving the nostalgia.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_concert1jonas" },
      { type: "experienceDateNight", dateNightId: "date_concert1jonas" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_FRIENDS1: LifeEvent = {
  id: "date_friends1",
  title: "Baseball Game",
  text: "Cheering on the home team.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_friends1" },
      { type: "experienceDateNight", dateNightId: "date_friends1" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_FRIENDS2: LifeEvent = {
  id: "date_friends2",
  title: "Another Baseball Game",
  text: "We never get tired of this.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_friends2" },
      { type: "experienceDateNight", dateNightId: "date_friends2" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_SCHOOLFRIENDS: LifeEvent = {
  id: "date_schoolfriends",
  title: "School Friends",
  text: "Catching up with old friends.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_schoolfriends" },
      { type: "experienceDateNight", dateNightId: "date_schoolfriends" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_VALENTINESDAY: LifeEvent = {
  id: "date_valentinesday",
  title: "Valentine's Day",
  text: "Celebrating our love.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_valentinesday" },
      { type: "experienceDateNight", dateNightId: "date_valentinesday" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_JORDANBIRTHDAY: LifeEvent = {
  id: "date_jordanbirthday",
  title: "Jordan's Birthday",
  text: "Another year, another celebration.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_jordanbirthday" },
      { type: "experienceDateNight", dateNightId: "date_jordanbirthday" },
      { type: "gotoHome" },
    ],
  }],
};

export const DATE_OLLIEBIRTHDAY: LifeEvent = {
  id: "date_olliebirthday",
  title: "Ollie's 1st Birthday",
  text: "Celebrating with Vanessa's best friend's family.",
  choices: [{
    id: "view",
    label: "Relive it 📸",
    effects: [
      { type: "burst", deck: "date_olliebirthday" },
      { type: "experienceDateNight", dateNightId: "date_olliebirthday" },
      { type: "gotoHome" },
    ],
  }],
};

// ============================================
// DATE NIGHT INTERLUDE
// ============================================

// This event is shown after completing a trip when there are unlocked but not-yet-experienced date nights
// It will be dynamically filtered in LifePage.tsx to show only available date nights
export const DATE_NIGHT_INTERLUDE: LifeEvent = {
  id: "date_night_interlude",
  title: "Time Passes at Home",
  text: "Back in San Diego, life continues with its own rhythm. Date nights, quiet moments, and building memories together.",
  choices: [
    // These choices will be dynamically generated in LifePage.tsx based on unlocked date nights
    // Each date night becomes a choice that leads to its event
    // Placeholder choices for all possible date nights:
    {
      id: "date_breakfast1",
      label: "🥞 Morning Brunch",
      effects: [{ type: "goto", eventId: "date_breakfast1" }],
    },
    {
      id: "date_lunch",
      label: "🍱 Lunch Date",
      effects: [{ type: "goto", eventId: "date_lunch" }],
    },
    {
      id: "date_dessert1",
      label: "🍰 Sweet Treats",
      effects: [{ type: "goto", eventId: "date_dessert1" }],
    },
    {
      id: "date_bar",
      label: "🍸 Evening Drinks",
      effects: [{ type: "goto", eventId: "date_bar" }],
    },
    {
      id: "date_italian1",
      label: "🍝 Italian Night",
      effects: [{ type: "goto", eventId: "date_italian1" }],
    },
    {
      id: "date_pokemondayin",
      label: "⚡ Pokemon Day In",
      effects: [{ type: "goto", eventId: "date_pokemondayin" }],
    },
    {
      id: "date_zoo1",
      label: "🦁 Zoo Adventure",
      effects: [{ type: "goto", eventId: "date_zoo1" }],
    },
    {
      id: "date_aquarium",
      label: "🐠 Aquarium Visit",
      effects: [{ type: "goto", eventId: "date_aquarium" }],
    },
    {
      id: "date_seaworld",
      label: "🐬 SeaWorld Day",
      effects: [{ type: "goto", eventId: "date_seaworld" }],
    },
    {
      id: "date_dessert2",
      label: "🍨 Dessert Spot",
      effects: [{ type: "goto", eventId: "date_dessert2" }],
    },
    {
      id: "date_omikase",
      label: "🍣 Omakase Night",
      effects: [{ type: "goto", eventId: "date_omikase" }],
    },
    {
      id: "date_hitokuchi",
      label: "🍶 Hitokuchi",
      effects: [{ type: "goto", eventId: "date_hitokuchi" }],
    },
    {
      id: "date_christmasglobe",
      label: "🎄 Christmas Globes",
      effects: [{ type: "goto", eventId: "date_christmasglobe" }],
    },
    {
      id: "date_halloween",
      label: "🎃 Halloween Night",
      effects: [{ type: "goto", eventId: "date_halloween" }],
    },
    {
      id: "date_pinning",
      label: "🎓 Pinning Ceremony",
      effects: [{ type: "goto", eventId: "date_pinning" }],
    },
    {
      id: "date_oakglenn",
      label: "🍎 Oak Glen",
      effects: [{ type: "goto", eventId: "date_oakglenn" }],
    },
    {
      id: "date_friendskbbq",
      label: "🥘 Korean BBQ with Friends",
      effects: [{ type: "goto", eventId: "date_friendskbbq" }],
    },
    {
      id: "date_friendssteakhouse",
      label: "🥩 Steakhouse Night",
      effects: [{ type: "goto", eventId: "date_friendssteakhouse" }],
    },
    {
      id: "date_concertkehlani",
      label: "🎤 Kehlani Concert",
      effects: [{ type: "goto", eventId: "date_concertkehlani" }],
    },
    {
      id: "date_concertjhene",
      label: "🎵 Jhené Aiko Concert",
      effects: [{ type: "goto", eventId: "date_concertjhene" }],
    },
    {
      id: "date_concert1jonas",
      label: "🎸 Jonas Brothers Concert",
      effects: [{ type: "goto", eventId: "date_concert1jonas" }],
    },
    {
      id: "date_friends1",
      label: "⚾ Baseball Game",
      effects: [{ type: "goto", eventId: "date_friends1" }],
    },
    {
      id: "date_friends2",
      label: "⚾ Another Baseball Game",
      effects: [{ type: "goto", eventId: "date_friends2" }],
    },
    {
      id: "date_schoolfriends",
      label: "👥 School Friends",
      effects: [{ type: "goto", eventId: "date_schoolfriends" }],
    },
    {
      id: "date_valentinesday",
      label: "💝 Valentine's Day",
      effects: [{ type: "goto", eventId: "date_valentinesday" }],
    },
    {
      id: "date_jordanbirthday",
      label: "🎂 Jordan's Birthday",
      effects: [{ type: "goto", eventId: "date_jordanbirthday" }],
    },
    {
      id: "date_olliebirthday",
      label: "🎈 Ollie's 1st Birthday",
      effects: [{ type: "goto", eventId: "date_olliebirthday" }],
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
          { type: "goto", eventId: "comfort_movie_choice" },
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
    id: "comfort_movie_choice",
    title: "Movie Night 🎬",
    text: "Time to pick something to watch. What's the vibe tonight?",
    choices: [
      {
        id: "mystery",
        label: "Mystery - Something twisty 🕵️",
        effects: [
          { type: "goto", eventId: "comfort_movie_mystery" },
        ],
      },
      {
        id: "romance",
        label: "Romance - Cozy and sweet 💕",
        effects: [
          { type: "goto", eventId: "comfort_movie_romance" },
        ],
      },
      {
        id: "comedy",
        label: "Comedy - Need some laughs 😂",
        effects: [
          { type: "goto", eventId: "comfort_movie_comedy" },
        ],
      },
      {
        id: "adventure",
        label: "Adventure - Epic journey ⚔️",
        effects: [
          { type: "goto", eventId: "comfort_movie_adventure" },
        ],
      },
      {
        id: "back",
        label: "← Maybe something else",
        effects: [
          { type: "goto", eventId: "activity_hub" },
        ],
      },
    ],
  },
  {
    id: "comfort_movie_mystery",
    title: "Mystery Movie",
    text: "Plot twists, red herrings, and trying to solve it before the reveal. Let's see if you can spot the clues...",
    choices: [
      {
        id: "play",
        label: "Start watching 🔍",
        effects: [
          {
            type: "spotTheClues",
            title: "Spot the Clues",
            subtitle: "Find the hidden clues before they disappear",
          },
          { type: "stat", key: "love", delta: 3 },
          { type: "stat", key: "happiness", delta: 4 },
          { type: "log", text: "We solved the mystery before the ending!" },
          { type: "goto", eventId: "after_movie_mystery" },
        ],
      },
    ],
  },
  {
    id: "after_movie_mystery",
    title: "Mystery Solved",
    text: "We called it halfway through. That look you gave me when we both figured it out at the same time? Perfect.",
    choices: [
      {
        id: "continue",
        label: "What's next? →",
        effects: [
          { type: "goto", eventId: "activity_hub" },
        ],
      },
    ],
  },
  {
    id: "comfort_movie_romance",
    title: "Romance Movie",
    text: "Soft lighting, heartfelt moments, and that warm fuzzy feeling. Perfect for cuddling up together.",
    choices: [
      {
        id: "watch",
        label: "Settle in close 💖",
        effects: [
          {
            type: "perfectMoment",
            title: "Perfect Moment",
            subtitle: "Capture the feeling at just the right time",
          },
          { type: "stat", key: "love", delta: 6 },
          { type: "stat", key: "happiness", delta: 3 },
          { type: "log", text: "Watched a romance that hit close to home." },
          { type: "goto", eventId: "after_movie_romance" },
        ],
      },
    ],
  },
  {
    id: "after_movie_romance",
    title: "Warmth Lingers",
    text: "Your head on my shoulder, that soft smile... somehow the movie felt like it was about us. I like when that happens.",
    choices: [
      {
        id: "continue",
        label: "What's next? →",
        effects: [
          { type: "goto", eventId: "activity_hub" },
        ],
      },
    ],
  },
  {
    id: "comfort_movie_comedy",
    title: "Comedy Movie",
    text: "Time for some laughs! Nothing beats those moments when you both crack up at the same joke.",
    choices: [
      {
        id: "laugh",
        label: "Let's go! 🎭",
        effects: [
          {
            type: "giggleGauge",
            title: "Giggle Gauge",
            subtitle: "Nail the timing for maximum laughs!",
          },
          { type: "stat", key: "happiness", delta: 7 },
          { type: "stat", key: "love", delta: 2 },
          { type: "log", text: "Laughed so hard we had to pause the movie." },
          { type: "goto", eventId: "after_movie_comedy" },
        ],
      },
    ],
  },
  {
    id: "after_movie_comedy",
    title: "Still Giggling",
    text: "My cheeks hurt from smiling. Yours too. We keep quoting it back and forth, and honestly? This is the best part.",
    choices: [
      {
        id: "continue",
        label: "What's next? →",
        effects: [
          { type: "goto", eventId: "activity_hub" },
        ],
      },
    ],
  },
  {
    id: "comfort_movie_adventure",
    title: "Adventure Movie",
    text: "Epic quests, daring heroes, and edge-of-your-seat moments. Let's go on this journey together!",
    choices: [
      {
        id: "adventure",
        label: "Start the quest! 🗡️",
        effects: [
          {
            type: "epicEscape",
            title: "Epic Escape",
            subtitle: "React fast or get left behind!",
          },
          { type: "stat", key: "happiness", delta: 5 },
          { type: "stat", key: "memories", delta: 2 },
          { type: "log", text: "Felt like we went on our own adventure." },
          { type: "goto", eventId: "after_movie_adventure" },
        ],
      },
    ],
  },
  {
    id: "after_movie_adventure",
    title: "Hearts Racing",
    text: "That final battle had us both on the edge of our seats. You grabbed my hand during the tense part. I didn't let go.",
    choices: [
      {
        id: "continue",
        label: "What's next? →",
        effects: [
          { type: "goto", eventId: "activity_hub" },
        ],
      },
    ],
  },
  {
    id: "activity_hub",
    title: "What Do You Want to Do?",
    text: "We're together. That's the important part. What sounds good?",
    choices: [
      {
        id: "movie_night",
        label: "Movie night 🎬",
        effects: [
          { type: "goto", eventId: "comfort_movie_choice" },
        ],
      },
      {
        id: "adventures",
        label: "Plan an adventure ✨",
        effects: [
          { type: "goto", eventId: "vacation_tease" },
        ],
      },
      {
        id: "cozy_activities",
        label: "Stay cozy 🌙",
        effects: [
          { type: "goto", eventId: "cozy_next_day" },
        ],
      },
    ],
  },
  {
    id: "vacation_tease",
    title: "A Trip Idea",
    text:
      "We start talking about vacations—places we've been, and places we still want to go.",
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
  id: "hawaii",
  label: "Hawaii 🌺 (beaches + ocean + aloha)",
  effects: [
    { type: "log", text: "We started dreaming of Hawaii… and suddenly we were packing our leis." },
    { type: "goto", eventId: "hawaii_trip_start" },
  ],
},
{
  id: "seattle2",
  label: "Seattle Trip II 🌸 (flowers + waterfalls + coming back)",
  effects: [
    { type: "log", text: "Seattle called us back… and we couldn't resist." },
    { type: "goto", eventId: "seattle2_trip_start" },
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
      {
        id: "back",
        label: "← Back",
        effects: [
          { type: "goto", eventId: "activity_hub" },
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
    { type: "gotoHome", markComplete: "disneyland" },
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
// Hawaii events
HAWAII_TRIP_START,
HAWAII_ARRIVAL,
HAWAII_EXPLORE,
HAWAII_BOATING,
HAWAII_EXPLORE2,
HAWAII_BEACH,
HAWAII_LUAU,
HAWAII_REFLECTION,
// Seattle Trip 2 events
SEATTLE2_TRIP_START,
SEATTLE2_ARRIVAL,
SEATTLE2_FLOWERFIELD,
SEATTLE2_FOOD,
SEATTLE2_WATERFALLS,
SEATTLE2_REFLECTION,
// Random pop-up events
RANDOM_MOVIE_NIGHT,
MOVIE_MYSTERY,
MOVIE_ROMANCE,
MOVIE_COMEDY,
MOVIE_ADVENTURE,
RANDOM_PIZZA_NIGHT,
RANDOM_COZY_NIGHT,
RANDOM_FRIEND_TEXT,
RANDOM_ADVENTURE_CALL,
// Date night interlude and events
DATE_NIGHT_INTERLUDE,
DATE_BREAKFAST1,
DATE_LUNCH,
DATE_DESSERT1,
DATE_BAR,
DATE_ITALIAN1,
DATE_POKEMONDAYIN,
DATE_ZOO1,
DATE_AQUARIUM,
DATE_SEAWORLD,
DATE_DESSERT2,
DATE_OMIKASE,
DATE_HITOKUCHI,
DATE_CHRISTMASGLOBE,
DATE_HALLOWEEN,
DATE_PINNING,
DATE_OAKGLENN,
DATE_FRIENDSKBBQ,
DATE_FRIENDSSTEAKHOUSE,
DATE_CONCERTKEHLANI,
DATE_CONCERTJHENE,
DATE_CONCERT1JONAS,
DATE_FRIENDS1,
DATE_FRIENDS2,
DATE_SCHOOLFRIENDS,
DATE_VALENTINESDAY,
DATE_JORDANBIRTHDAY,
DATE_OLLIEBIRTHDAY,
];
