import type { LifeEvent } from "./types";
import { getMemorySrc } from "./memories"; // add at top of events.ts

const earsSrc = getMemorySrc("disneyland", "ears-together") ?? "";
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
          { type: "log", text: "We learned more about each other." },
          { type: "goto", eventId: "vacation_tease" },
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
  id: "end_demo",
  title: "To Be Continued",
  text:
    "That’s the start… but there’s so much more. Next we’ll plug in real memories: photos, places, food, and little games.",
  choices: [
    {
      id: "restart",
      label: "Start over 🔁",
      effects: [
        { type: "log", text: "We decided to relive it from the start." },
        { type: "goto", eventId: "start" }
      ],
    },
  ],
},
];
