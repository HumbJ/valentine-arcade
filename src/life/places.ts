export type Place = {
  id: string;
  title: string;
  subtitle?: string;
  emoji: string;
  deck: string; // 👈 add this
};


export const PLACES: Place[] = [
{ 
  id: "disneyland", 
  title: "Disneyland", 
  subtitle: "snacks + rides + fireworks", 
  emoji: "🏰",
  deck: "disneyland",
},
{
  id: "seattle1",
  title: "Seattle Trip I",
  emoji: "🌲",
  deck: "seattle1",
},
{
  id: "roadtrip",
  title: "California Road Trip",
  subtitle: "parks, coast, pastries",
  emoji: "🚗",
  deck: "roadtrip",
},
{
  id: "hawaii",
  title: "Hawaii",
  subtitle: "beaches, ocean, aloha",
  emoji: "🌺",
  deck: "hawaii",
},
{
  id: "seattle2",
  title: "Seattle Trip II",
  subtitle: "flowers, waterfalls, coming home",
  emoji: "🌸",
  deck: "seattle2",
},
{
  id: "newyork",
  title: "New York",
  subtitle: "lights, energy, endless city",
  emoji: "🗽",
  deck: "newyork",
},

  // Add more later:
  // { id: "las_vegas", title: "Las Vegas", subtitle: "late-night lights", emoji: "🎰" },
  // { id: "yosemite", title: "Yosemite", subtitle: "views for days", emoji: "🌲" },
];
