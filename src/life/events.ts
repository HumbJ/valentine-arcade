import type { LifeEvent } from "./types";
import { getMemorySrc } from "./memories"; // add at top of events.ts


const earsSrc = getMemorySrc("disneyland", "ears-together") ?? "";

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
];
