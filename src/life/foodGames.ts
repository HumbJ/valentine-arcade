// src/life/foodGames.ts
export type FoodItem = {
  id: string;        // stable id (derived from filename)
  src: string;       // image url
  label?: string;    // optional caption (restaurant/meal)
};

export type FoodReward = {
  src: string;
  title: string;
  body: string;
};

export type FoodGame = {
  id: string;
  title: string;
  subtitle?: string;
  items: FoodItem[];

  correctOrder: string[];     // kept for backwards-compat
  validOrders?: string[][];   // NEW: multiple acceptable orders

  reward?: FoodReward;        // NEW: post-win “earned” moment
};



function sortById(a: FoodItem, b: FoodItem) {
  return a.id.localeCompare(b.id);
}

// Assumes you already have photos at:
// src/assets/photos/trips/seattle1/food/*
const seattleFoodModules = import.meta.glob(
  "../assets/photos/trips/seattle1/food/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

const seattleFoodAll: FoodItem[] = Object.entries(seattleFoodModules)
  .map(([path, src]) => {
    const file = path.split("/").pop() || path;
    const id = file.replace(/\.(png|jpg|jpeg|webp)$/i, "");
    return { id, src };
  })
  .sort(sortById);

function endsWithNumber(id: string, n: number) {
  const re = new RegExp(`(?:_|-|\\b)0?${n}$`);
  return re.test(id);
}

const seattleFoodRewardItem = seattleFoodAll.find((x) => endsWithNumber(x.id, 5)) ?? null;

const seattleFoodItems: FoodItem[] = seattleFoodAll.filter((x) => !endsWithNumber(x.id, 5));

const seattleFoodCorrect = seattleFoodItems.map((x) => x.id);

function swapIfPresent(order: string[], aNum: number, bNum: number) {
  const a = order.find((id) => endsWithNumber(id, aNum));
  const b = order.find((id) => endsWithNumber(id, bNum));
  if (!a || !b) return null;

  const next = [...order];
  const ia = next.indexOf(a);
  const ib = next.indexOf(b);
  next[ia] = b;
  next[ib] = a;
  return next;
}

const seattleFoodSwap34 = swapIfPresent(seattleFoodCorrect, 3, 4);
const seattleFoodValidOrders = seattleFoodSwap34
  ? [seattleFoodCorrect, seattleFoodSwap34]
  : [seattleFoodCorrect];

export const FOOD_GAMES: Record<string, FoodGame> = {
    seattle1_food: {
    id: "seattle1_food",
    title: "A little food timeline",
    subtitle: "Put our bites in order based on when during the trip we tried them.",
    items: seattleFoodItems,
    correctOrder: seattleFoodCorrect,
    validOrders: seattleFoodValidOrders,
    reward: seattleFoodRewardItem
      ? {
          src: seattleFoodRewardItem.src,
          title: "Our cravings, our comfort",
          body:
            "Somehow we always end up wanting the same things: warm, salty, sweet, and a little ridiculous. Seattle treated us well.",
        }
      : undefined,
  },

};
