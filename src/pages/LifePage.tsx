import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyEffects, getEventById } from "../life/engine";
import { defaultSave, loadSave, persistSave, resetSave } from "../life/save";
import { MemoryBurst } from "../life/MemoryBurst";
import type { Effect } from "../life/types";
import { JigsawGate } from "../life/JigsawGate";
import { PLACES } from "../life/places";
import { MapDiscoverGate } from "../life/MapDiscoverGate";
import { getDateNightsByUnlock } from "../life/dateNights";
import { FOOD_GAMES } from "../life/foodGames";
import { FoodOrderGate } from "../life/FoodOrderGate";
import { ReflectionGate } from "../life/ReflectionGate";
import type { ReflectionEntry } from "../life/types";
import { ReflectionReview } from "../life/ReflectionReview";
import { EndCreditsOverlay } from "../life/EndCreditsOverlay";
import "./StoryMode.css";
import { PicnicDateGate } from "../life/PicnicDateGate";
import { RoadTripMap } from "../life/RoadTripMap";
import { StargazingMemory } from "../life/StargazingMemory";
import { CanyonEcho } from "../life/CanyonEcho";
import { TunnelViewReveal } from "../life/TunnelViewReveal";
import { TidePoolMatch } from "../life/TidePoolMatch";
import { PastryStacker } from "../life/PastryStacker";
import { FoodLocationMatch } from "../life/FoodLocationMatch";
import { SpotTheClues } from "../life/SpotTheClues";
import { PerfectMoment } from "../life/PerfectMoment";
import { GiggleGauge } from "../life/GiggleGauge";
import { EpicEscape } from "../life/EpicEscape";
import { WaveRider } from "../life/WaveRider";
import { IslandDrive } from "../life/IslandDrive";
import { ShellMerge } from "../life/ShellMerge";
import { LeiPattern } from "../life/LeiPattern";
import { BouquetRush } from "../life/BouquetRush";
import { WaterfallHop } from "../life/WaterfallHop";




export function LifePage() {
  const navigate = useNavigate();
  const [save, setSave] = useState(() => loadSave());

  const [toast, setToast] = useState<string | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
  const [burst, setBurst] = useState<null | { deck: string; pick?: number }>(null);
  const [pendingEffects, setPendingEffects] = useState<Effect[] | null>(null);

  const [puzzle, setPuzzle] = useState<null | { imageSrc: string; rows?: number; cols?: number; title?: string }>(null);
  const [pendingAfterPuzzle, setPendingAfterPuzzle] = useState<Effect[] | null>(null);

  const [mapGate, setMapGate] = useState<null | { mapId: string; title?: string; subtitle?: string }>(null);
  const [pendingAfterMap, setPendingAfterMap] = useState<Effect[] | null>(null);
  const [picnicGate, setPicnicGate] = useState<null | { title: string; subtitle?: string }>(null);
  const [pendingAfterPicnic, setPendingAfterPicnic] = useState<Effect[] | null>(null);
  const [foodGate, setFoodGate] = useState<null | { gameId: string; title?: string; subtitle?: string }>(null);
  const [pendingAfterFood, setPendingAfterFood] = useState<Effect[] | null>(null);
  const [reflectionGate, setReflectionGate] = useState<null | {
  id: string;
  prompt: string;
  arc?: string;
  title?: string;
  subtitle?: string;
}>(null);

const [reviewGate, setReviewGate] = useState<null | {
  title?: string;
  closingLine?: string;
}>(null);

const [pendingAfterReview, setPendingAfterReview] = useState<Effect[] | null>(null);

const [pendingAfterReflection, setPendingAfterReflection] = useState<Effect[] | null>(null);

  const [reward, setReward] = useState<null | { title: string; lines: string[] }>(null);

  // Road trip mini-game states
  const [roadTripMapGate, setRoadTripMapGate] = useState<null | { fromStop: string; toStop: string; title?: string }>(null);
  const [pendingAfterRoadTripMap, setPendingAfterRoadTripMap] = useState<Effect[] | null>(null);
  const [stargazingGate, setStargazingGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterStargazing, setPendingAfterStargazing] = useState<Effect[] | null>(null);
  const [canyonEchoGate, setCanyonEchoGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterCanyonEcho, setPendingAfterCanyonEcho] = useState<Effect[] | null>(null);
  const [tunnelViewGate, setTunnelViewGate] = useState<null | { imageSrc: string; title?: string; subtitle?: string }>(null);
  const [pendingAfterTunnelView, setPendingAfterTunnelView] = useState<Effect[] | null>(null);
  const [tidePoolGate, setTidePoolGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterTidePool, setPendingAfterTidePool] = useState<Effect[] | null>(null);
  const [pastryStackerGate, setPastryStackerGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterPastryStacker, setPendingAfterPastryStacker] = useState<Effect[] | null>(null);
  const [foodLocationMatchGate, setFoodLocationMatchGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterFoodLocationMatch, setPendingAfterFoodLocationMatch] = useState<Effect[] | null>(null);

  // Movie night mini-game states
  const [spotTheCluesGate, setSpotTheCluesGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterSpotTheClues, setPendingAfterSpotTheClues] = useState<Effect[] | null>(null);
  const [perfectMomentGate, setPerfectMomentGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterPerfectMoment, setPendingAfterPerfectMoment] = useState<Effect[] | null>(null);
  const [giggleGaugeGate, setGiggleGaugeGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterGiggleGauge, setPendingAfterGiggleGauge] = useState<Effect[] | null>(null);
  const [epicEscapeGate, setEpicEscapeGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterEpicEscape, setPendingAfterEpicEscape] = useState<Effect[] | null>(null);

  // Hawaii trip mini-game states
  const [waveRiderGate, setWaveRiderGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterWaveRider, setPendingAfterWaveRider] = useState<Effect[] | null>(null);
  const [islandDriveGate, setIslandDriveGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterIslandDrive, setPendingAfterIslandDrive] = useState<Effect[] | null>(null);
  const [shellMergeGate, setShellMergeGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterShellMerge, setPendingAfterShellMerge] = useState<Effect[] | null>(null);
  const [leiPatternGate, setLeiPatternGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterLeiPattern, setPendingAfterLeiPattern] = useState<Effect[] | null>(null);

  // Seattle Trip 2 mini-game states
  const [bouquetRushGate, setBouquetRushGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterBouquetRush, setPendingAfterBouquetRush] = useState<Effect[] | null>(null);
  const [waterfallHopGate, setWaterfallHopGate] = useState<null | { title?: string; subtitle?: string }>(null);
  const [pendingAfterWaterfallHop, setPendingAfterWaterfallHop] = useState<Effect[] | null>(null);

  const event = useMemo(() => getEventById(save.currentEventId), [save.currentEventId]);

  // Filter out completed trips from vacation_tease menu
  // and filter date night interlude to show only available date nights
  const filteredEvent = useMemo(() => {
    if (!event) return event;

    // Filter vacation_tease to remove completed trips
    if (event.id === "vacation_tease") {
      const completedTrips = save.completedEvents || [];
      const tripChoiceIds = ["disneyland", "seattle1", "roadtrip", "hawaii", "seattle2"];

      const filteredChoices = event.choices.filter(
        (choice) => !tripChoiceIds.includes(choice.id) || !completedTrips.includes(choice.id)
      );

      return {
        ...event,
        choices: filteredChoices,
      };
    }

    // Filter date_night_interlude to show only unlocked but not-yet-experienced date nights
    if (event.id === "date_night_interlude") {
      const unlockedDateNights = save.unlockedDateNights || [];
      const experiencedDateNights = save.experiencedDateNights || [];

      // Show only choices for date nights that are unlocked but not yet experienced
      const filteredChoices = event.choices.filter(
        (choice) => unlockedDateNights.includes(choice.id) && !experiencedDateNights.includes(choice.id)
      );

      return {
        ...event,
        choices: filteredChoices,
      };
    }

    return event;
  }, [event, save.completedEvents, save.unlockedDateNights, save.experiencedDateNights]);

  function showRewardsFromEffects(effects: Effect[]) {
    const shouldShow = effects.some(
      (e) => e.type === "unlockPlace" || e.type === "unlockDateNights" || (e.type === "stat" && e.key === "memories")
    );
    if (!shouldShow) return;

    const stat: Partial<Record<"love" | "happiness" | "memories", number>> = {};
    const unlocked: string[] = [];
    const unlockedDateNights: string[] = [];

    for (const e of effects) {
      if (e.type === "stat") {
        // If your Effect typing currently has key: string, this line will error.
        // Fix properly in src/life/types.ts to key: "love"|"happiness"|"memories".
        const k = e.key as "love" | "happiness" | "memories";
        stat[k] = (stat[k] ?? 0) + e.delta;
      }
      if (e.type === "unlockPlace") unlocked.push(e.placeId);
      if (e.type === "unlockDateNights") unlockedDateNights.push(e.tripId);
    }

    const lines: string[] = [];

    (["love", "happiness", "memories"] as const).forEach((key) => {
      const d = stat[key];
      if (!d) return;
      const label = key === "love" ? "Love" : key === "happiness" ? "Happiness" : "Memories";
      const sign = d > 0 ? "+" : "";
      lines.push(`${sign}${d} ${label}`);
    });

    if (unlocked.length) {
      const map = new Map(PLACES.map((p) => [p.id, p]));
      unlocked.forEach((id) => {
        const p = map.get(id);
        lines.push(`Unlocked: ${p ? `${p.emoji} ${p.title}` : id}`);
      });
    }

    if (unlockedDateNights.length) {
      unlockedDateNights.forEach((tripId) => {
        const dateNights = getDateNightsByUnlock(tripId);
        if (dateNights.length > 0) {
          lines.push("");
          lines.push(`✨ Date Nights Unlocked! ✨`);
          dateNights.forEach((dn) => {
            lines.push(`${dn.emoji} ${dn.title}`);
          });
        }
      });
    }

    if (lines.length) setReward({ title: "Rewards earned 💝", lines });
  }
  // When we arrive at the end event, show the finale overlay once per session.
useEffect(() => {
  if (save.currentEventId === "end") setShowFinale(true);
}, [save.currentEventId]);

// If currentEventId is "hub", redirect to home - no active event
useEffect(() => {
  if (save.currentEventId === "hub") {
    navigate("/");
  }
}, [save.currentEventId, navigate]);


  function runEffects(effects: Effect[], options?: { skipRewards?: boolean }) {
    console.log("RUN EFFECTS TYPES:", effects.map((e) => e.type));

    

    // 1) Map gate
    const mapEff = effects.find(
      (e): e is Extract<Effect, { type: "mapDiscover" }> => e.type === "mapDiscover"
    );
    if (mapEff) {
      setMapGate({ mapId: mapEff.mapId, title: mapEff.title, subtitle: mapEff.subtitle });
      setPendingAfterMap(effects.filter((e) => e.type !== "mapDiscover"));
      return;
    }

    // 2) Food gate
    const foodEff = effects.find(
      (e): e is Extract<Effect, { type: "foodOrder" }> => e.type === "foodOrder"
    );
    if (foodEff) {
      setFoodGate({ gameId: foodEff.gameId, title: foodEff.title, subtitle: foodEff.subtitle });
      setPendingAfterFood(effects.filter((e) => e.type !== "foodOrder"));
      return;
    }

    // 2.5) Picnic gate
const picnicEff = effects.find((e) => e.type === "picnicDate");
if (picnicEff && picnicEff.type === "picnicDate") {
  setPicnicGate({ title: picnicEff.title, subtitle: picnicEff.subtitle });
  setPendingAfterPicnic(effects.filter((e) => e.type !== "picnicDate"));

  return;
}

    // 2.6) Road trip map gate
    const roadTripMapEff = effects.find(
      (e): e is Extract<Effect, { type: "roadTripMap" }> => e.type === "roadTripMap"
    );
    if (roadTripMapEff) {
      setRoadTripMapGate({
        fromStop: roadTripMapEff.fromStop,
        toStop: roadTripMapEff.toStop,
        title: roadTripMapEff.title,
      });
      setPendingAfterRoadTripMap(effects.filter((e) => e.type !== "roadTripMap"));
      return;
    }

    // 2.7) Stargazing memory gate (Joshua Tree)
    const stargazingEff = effects.find(
      (e): e is Extract<Effect, { type: "stargazingMemory" }> => e.type === "stargazingMemory"
    );
    if (stargazingEff) {
      setStargazingGate({
        title: stargazingEff.title,
        subtitle: stargazingEff.subtitle,
      });
      setPendingAfterStargazing(effects.filter((e) => e.type !== "stargazingMemory"));
      return;
    }

    // 2.8) Canyon echo gate (Kings Canyon)
    const canyonEchoEff = effects.find(
      (e): e is Extract<Effect, { type: "canyonEcho" }> => e.type === "canyonEcho"
    );
    if (canyonEchoEff) {
      setCanyonEchoGate({
        title: canyonEchoEff.title,
        subtitle: canyonEchoEff.subtitle,
      });
      setPendingAfterCanyonEcho(effects.filter((e) => e.type !== "canyonEcho"));
      return;
    }

    // 2.9) Tunnel view reveal gate (Yosemite)
    const tunnelViewEff = effects.find(
      (e): e is Extract<Effect, { type: "tunnelViewReveal" }> => e.type === "tunnelViewReveal"
    );
    if (tunnelViewEff) {
      setTunnelViewGate({
        imageSrc: tunnelViewEff.imageSrc,
        title: tunnelViewEff.title,
        subtitle: tunnelViewEff.subtitle,
      });
      setPendingAfterTunnelView(effects.filter((e) => e.type !== "tunnelViewReveal"));
      return;
    }

    // 2.10) Tide pool match gate (Monterey)
    const tidePoolEff = effects.find(
      (e): e is Extract<Effect, { type: "tidePoolMatch" }> => e.type === "tidePoolMatch"
    );
    if (tidePoolEff) {
      setTidePoolGate({
        title: tidePoolEff.title,
        subtitle: tidePoolEff.subtitle,
      });
      setPendingAfterTidePool(effects.filter((e) => e.type !== "tidePoolMatch"));
      return;
    }

    // 2.11) Pastry stacker gate (Solvang)
    const pastryStackerEff = effects.find(
      (e): e is Extract<Effect, { type: "pastryStacker" }> => e.type === "pastryStacker"
    );
    if (pastryStackerEff) {
      setPastryStackerGate({
        title: pastryStackerEff.title,
        subtitle: pastryStackerEff.subtitle,
      });
      setPendingAfterPastryStacker(effects.filter((e) => e.type !== "pastryStacker"));
      return;
    }

    // 2.12) Food location match gate (end of road trip)
    const foodLocationMatchEff = effects.find(
      (e): e is Extract<Effect, { type: "foodLocationMatch" }> => e.type === "foodLocationMatch"
    );
    if (foodLocationMatchEff) {
      setFoodLocationMatchGate({
        title: foodLocationMatchEff.title,
        subtitle: foodLocationMatchEff.subtitle,
      });
      setPendingAfterFoodLocationMatch(effects.filter((e) => e.type !== "foodLocationMatch"));
      return;
    }

    // 2.13) Spot the clues gate (Mystery movie)
    const spotTheCluesEff = effects.find(
      (e): e is Extract<Effect, { type: "spotTheClues" }> => e.type === "spotTheClues"
    );
    if (spotTheCluesEff) {
      setSpotTheCluesGate({
        title: spotTheCluesEff.title,
        subtitle: spotTheCluesEff.subtitle,
      });
      setPendingAfterSpotTheClues(effects.filter((e) => e.type !== "spotTheClues"));
      return;
    }

    // 2.14) Perfect moment gate (Romance movie)
    const perfectMomentEff = effects.find(
      (e): e is Extract<Effect, { type: "perfectMoment" }> => e.type === "perfectMoment"
    );
    if (perfectMomentEff) {
      setPerfectMomentGate({
        title: perfectMomentEff.title,
        subtitle: perfectMomentEff.subtitle,
      });
      setPendingAfterPerfectMoment(effects.filter((e) => e.type !== "perfectMoment"));
      return;
    }

    // 2.15) Giggle gauge gate (Comedy movie)
    const giggleGaugeEff = effects.find(
      (e): e is Extract<Effect, { type: "giggleGauge" }> => e.type === "giggleGauge"
    );
    if (giggleGaugeEff) {
      setGiggleGaugeGate({
        title: giggleGaugeEff.title,
        subtitle: giggleGaugeEff.subtitle,
      });
      setPendingAfterGiggleGauge(effects.filter((e) => e.type !== "giggleGauge"));
      return;
    }

    // 2.16) Epic escape gate (Adventure movie)
    const epicEscapeEff = effects.find(
      (e): e is Extract<Effect, { type: "epicEscape" }> => e.type === "epicEscape"
    );
    if (epicEscapeEff) {
      setEpicEscapeGate({
        title: epicEscapeEff.title,
        subtitle: epicEscapeEff.subtitle,
      });
      setPendingAfterEpicEscape(effects.filter((e) => e.type !== "epicEscape"));
      return;
    }

    // 2.17) Wave Rider gate (Hawaii boating)
    const waveRiderEff = effects.find(
      (e): e is Extract<Effect, { type: "oceanSpotting" }> => e.type === "oceanSpotting"
    );
    if (waveRiderEff) {
      setWaveRiderGate({
        title: waveRiderEff.title,
        subtitle: waveRiderEff.subtitle,
      });
      setPendingAfterWaveRider(effects.filter((e) => e.type !== "oceanSpotting"));
      return;
    }

    // 2.18) Island drive gate (Hawaii explore)
    const islandDriveEff = effects.find(
      (e): e is Extract<Effect, { type: "islandDrive" }> => e.type === "islandDrive"
    );
    if (islandDriveEff) {
      setIslandDriveGate({
        title: islandDriveEff.title,
        subtitle: islandDriveEff.subtitle,
      });
      setPendingAfterIslandDrive(effects.filter((e) => e.type !== "islandDrive"));
      return;
    }

    // 2.19) Shell merge gate (Hawaii beach)
    const shellMergeEff = effects.find(
      (e): e is Extract<Effect, { type: "shellMerge" }> => e.type === "shellMerge"
    );
    if (shellMergeEff) {
      setShellMergeGate({
        title: shellMergeEff.title,
        subtitle: shellMergeEff.subtitle,
      });
      setPendingAfterShellMerge(effects.filter((e) => e.type !== "shellMerge"));
      return;
    }

    // 2.20) Lei pattern gate (Hawaii luau)
    const leiPatternEff = effects.find(
      (e): e is Extract<Effect, { type: "leiPattern" }> => e.type === "leiPattern"
    );
    if (leiPatternEff) {
      setLeiPatternGate({
        title: leiPatternEff.title,
        subtitle: leiPatternEff.subtitle,
      });
      setPendingAfterLeiPattern(effects.filter((e) => e.type !== "leiPattern"));
      return;
    }

    // 2.22) Bouquet rush gate (Seattle 2 flowerfield)
    const bouquetRushEff = effects.find(
      (e): e is Extract<Effect, { type: "bouquetRush" }> => e.type === "bouquetRush"
    );
    if (bouquetRushEff) {
      setBouquetRushGate({
        title: bouquetRushEff.title,
        subtitle: bouquetRushEff.subtitle,
      });
      setPendingAfterBouquetRush(effects.filter((e) => e.type !== "bouquetRush"));
      return;
    }

    // 2.23) Waterfall hop gate (Seattle 2 waterfalls)
    const waterfallHopEff = effects.find(
      (e): e is Extract<Effect, { type: "waterfallHop" }> => e.type === "waterfallHop"
    );
    if (waterfallHopEff) {
      setWaterfallHopGate({
        title: waterfallHopEff.title,
        subtitle: waterfallHopEff.subtitle,
      });
      setPendingAfterWaterfallHop(effects.filter((e) => e.type !== "waterfallHop"));
      return;
    }

    // 3) Reflection gate intercept
const reflEff = effects.find(
  (e): e is Extract<Effect, { type: "reflectionPrompt" }> => e.type === "reflectionPrompt"
);
if (reflEff) {
  setReflectionGate({
    id: reflEff.id,
    prompt: reflEff.prompt,
    arc: reflEff.arc,
    title: reflEff.title,
    subtitle: reflEff.subtitle,
  });
  setPendingAfterReflection(effects.filter((e) => e.type !== "reflectionPrompt"));
  return;
}

const reviewEff = effects.find(
  (e): e is Extract<Effect, { type: "reflectionReview" }> => e.type === "reflectionReview"
);

if (reviewEff) {
  setReviewGate({
    title: reviewEff.title,
    closingLine: reviewEff.closingLine,
  });
  setPendingAfterReview(effects.filter((e) => e.type !== "reflectionReview"));
  return;
}

    // 4) Puzzle gate
    const puzzleEff = effects.find(
      (e): e is Extract<Effect, { type: "puzzle" }> => e.type === "puzzle"
    );
    if (puzzleEff) {
      setPuzzle({
        imageSrc: puzzleEff.imageSrc,
        rows: puzzleEff.rows,
        cols: puzzleEff.cols,
        title: puzzleEff.title,
      });
      setPendingAfterPuzzle(effects.filter((e) => e.type !== "puzzle"));
      return;
    }

    // 5) Burst gate
    const burstEff = effects.find(
      (e): e is Extract<Effect, { type: "burst" }> => e.type === "burst"
    );
    if (burstEff) {
      setBurst({ deck: burstEff.deck, pick: burstEff.pick });
      setPendingEffects(effects.filter((e) => e.type !== "burst"));
      return;
    }

    // 6) Apply remaining effects (including gotoHome which checks for interlude)
    setSave((prev: typeof save) => {
      const next = applyEffects(prev, effects);
      persistSave(next);
      return next;
    });
    if (!options?.skipRewards) {
      showRewardsFromEffects(effects);
    }
  }

  function appendReflection(entry: ReflectionEntry) {
  setSave((prev: typeof save) => {
    const next = {
      ...prev,
      reflections: [...(prev.reflections ?? []), entry],
    };
    persistSave(next);
    return next;
  });
}


  function choose(choiceId: string) {
    const ev: any = filteredEvent;
    const choice = ev?.choices?.find((c: any) => c.id === choiceId);
    if (!choice) return;

    // Restart special case
    const goesToStart = choice.effects?.some(
      (e: any) => e.type === "goto" && e.eventId === "start"
    );

    if (goesToStart) {
      setToast("Reliving it from the start 💗");
      setRestarting(true);
      setProgress(0);

      const totalMs = 2200;
      const stepMs = 40;
      const steps = Math.ceil(totalMs / stepMs);
      let i = 0;

      const timer = window.setInterval(() => {
        i += 1;
        setProgress(Math.min(100, Math.round((i / steps) * 100)));

        if (i >= steps) {
          window.clearInterval(timer);

          resetSave();
          const fresh = defaultSave();
          setSave(fresh);
          persistSave(fresh);

          setTimeout(() => {
            setRestarting(false);
            setToast(null);
            setProgress(0);
          }, 250);
        }
      }, stepMs);

      return;
    }
console.log("CHOICE CLICKED:", choice.id, choice.effects);
    runEffects(choice.effects as Effect[]);
  }

  function finishBurst() {
    setBurst(null);
    if (!pendingEffects) return;
    const rest = pendingEffects;
    setPendingEffects(null);
    runEffects(rest);
  }

  function finishPuzzle() {
    setPuzzle(null);
    if (!pendingAfterPuzzle) return;
    const rest = pendingAfterPuzzle;
    setPendingAfterPuzzle(null);
    runEffects(rest);
  }

  function finishMapGate() {
    setMapGate(null);
    if (!pendingAfterMap) return;
    const rest = pendingAfterMap;
    setPendingAfterMap(null);
    runEffects(rest);
  }

  function finishReflectionSkip() {
  setReflectionGate(null);
  if (!pendingAfterReflection) return;

  const rest = pendingAfterReflection;
  setPendingAfterReflection(null);
  runEffects(rest);
}

function finishReflectionSave(text: string) {
  if (!reflectionGate) return;

  appendReflection({
    id: reflectionGate.id,
    arc: reflectionGate.arc,
    prompt: reflectionGate.prompt,
    text,
    t: Date.now(),
  });

  setReflectionGate(null);
  if (!pendingAfterReflection) return;

  const rest = pendingAfterReflection;
  setPendingAfterReflection(null);
  runEffects(rest);
}

  function finishFoodGate() {
    setFoodGate(null);
    if (!pendingAfterFood) return;
    const rest = pendingAfterFood;
    setPendingAfterFood(null);
    runEffects(rest);
  }

  function finishPicnicGate() {
  setPicnicGate(null);
  if (!pendingAfterPicnic) return;
  const rest = pendingAfterPicnic;
  setPendingAfterPicnic(null);
  // Skip rewards popup since PicnicDateGate already showed rewards visually
  runEffects(rest, { skipRewards: true });
}

  function finishRoadTripMap() {
    setRoadTripMapGate(null);
    if (!pendingAfterRoadTripMap) return;
    const rest = pendingAfterRoadTripMap;
    setPendingAfterRoadTripMap(null);
    runEffects(rest);
  }

  function finishStargazing() {
    setStargazingGate(null);
    if (!pendingAfterStargazing) return;
    const rest = pendingAfterStargazing;
    setPendingAfterStargazing(null);
    runEffects(rest);
  }

  function finishCanyonEcho() {
    setCanyonEchoGate(null);
    if (!pendingAfterCanyonEcho) return;
    const rest = pendingAfterCanyonEcho;
    setPendingAfterCanyonEcho(null);
    runEffects(rest);
  }

  function finishTunnelView() {
    setTunnelViewGate(null);
    if (!pendingAfterTunnelView) return;
    const rest = pendingAfterTunnelView;
    setPendingAfterTunnelView(null);
    runEffects(rest);
  }

  function finishTidePool() {
    setTidePoolGate(null);
    if (!pendingAfterTidePool) return;
    const rest = pendingAfterTidePool;
    setPendingAfterTidePool(null);
    runEffects(rest);
  }

  function finishPastryStacker() {
    setPastryStackerGate(null);
    if (!pendingAfterPastryStacker) return;
    const rest = pendingAfterPastryStacker;
    setPendingAfterPastryStacker(null);
    runEffects(rest);
  }

  function finishFoodLocationMatch() {
    setFoodLocationMatchGate(null);
    if (!pendingAfterFoodLocationMatch) return;
    const rest = pendingAfterFoodLocationMatch;
    setPendingAfterFoodLocationMatch(null);
    runEffects(rest);
  }

  function finishSpotTheClues() {
    setSpotTheCluesGate(null);
    if (!pendingAfterSpotTheClues) return;
    const rest = pendingAfterSpotTheClues;
    setPendingAfterSpotTheClues(null);
    runEffects(rest);
  }

  function finishPerfectMoment() {
    setPerfectMomentGate(null);
    if (!pendingAfterPerfectMoment) return;
    const rest = pendingAfterPerfectMoment;
    setPendingAfterPerfectMoment(null);
    runEffects(rest);
  }

  function finishGiggleGauge() {
    setGiggleGaugeGate(null);
    if (!pendingAfterGiggleGauge) return;
    const rest = pendingAfterGiggleGauge;
    setPendingAfterGiggleGauge(null);
    runEffects(rest);
  }

  function finishEpicEscape() {
    setEpicEscapeGate(null);
    if (!pendingAfterEpicEscape) return;
    const rest = pendingAfterEpicEscape;
    setPendingAfterEpicEscape(null);
    runEffects(rest);
  }

  function finishWaveRider() {
    setWaveRiderGate(null);
    if (!pendingAfterWaveRider) return;
    const rest = pendingAfterWaveRider;
    setPendingAfterWaveRider(null);
    runEffects(rest);
  }

  function finishIslandDrive() {
    setIslandDriveGate(null);
    if (!pendingAfterIslandDrive) return;
    const rest = pendingAfterIslandDrive;
    setPendingAfterIslandDrive(null);
    runEffects(rest);
  }

  function finishShellMerge() {
    setShellMergeGate(null);
    if (!pendingAfterShellMerge) return;
    const rest = pendingAfterShellMerge;
    setPendingAfterShellMerge(null);
    runEffects(rest);
  }

  function finishLeiPattern() {
    setLeiPatternGate(null);
    if (!pendingAfterLeiPattern) return;
    const rest = pendingAfterLeiPattern;
    setPendingAfterLeiPattern(null);
    runEffects(rest);
  }

  function finishBouquetRush() {
    setBouquetRushGate(null);
    if (!pendingAfterBouquetRush) return;
    const rest = pendingAfterBouquetRush;
    setPendingAfterBouquetRush(null);
    runEffects(rest);
  }

  function finishWaterfallHop() {
    setWaterfallHopGate(null);
    if (!pendingAfterWaterfallHop) return;
    const rest = pendingAfterWaterfallHop;
    setPendingAfterWaterfallHop(null);
    runEffects(rest);
  }

  function finishReviewGate() {
  setReviewGate(null);
  if (!pendingAfterReview) return;

  const rest = pendingAfterReview;
  setPendingAfterReview(null);
  runEffects(rest);
}

  const ev: any = filteredEvent;
  const [journalOpen, setJournalOpen] = useState(false);

  // Generate particles for background
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="story-page">
      {/* Cozy background */}
      <div className="story-bg">
        <div className="story-bg-gradient" />
        <div className="story-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="story-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
        <div className="story-bg-room">
          <div className="story-bg-floor" />
          <div className="story-bg-window" />
        </div>
      </div>

      {/* Top bar with stats */}
      <header className="story-topbar">
        <div className="story-stats">
          <div className="story-stat">
            <span className="story-stat-icon">💕</span>
            <div className="story-stat-bar">
              <div className="story-stat-fill love" style={{ width: `${save.stats.love}%` }} />
            </div>
            <span className="story-stat-val">{save.stats.love}</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-icon">😊</span>
            <div className="story-stat-bar">
              <div className="story-stat-fill happy" style={{ width: `${save.stats.happiness}%` }} />
            </div>
            <span className="story-stat-val">{save.stats.happiness}</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-icon">📸</span>
            <span className="story-stat-val">{save.stats.memories}</span>
          </div>
        </div>

        <button
          className="story-reset-btn"
          onClick={() => {
            resetSave();
            const fresh = defaultSave();
            setSave(fresh);
            persistSave(fresh);
          }}
          title="Reset progress"
        >
          Reset
        </button>
      </header>

      {/* Main story area */}
      <main className="story-main">
        {/* Character stage */}
        <div className="story-stage">
          <div className="story-character">
            <div className="story-avatar p1">
              <div className="avatar-head" />
              <div className="avatar-body" />
            </div>
            <span className="story-char-name">You</span>
          </div>

          <span className="story-heart">💕</span>

          <div className="story-character">
            <div className="story-avatar p2">
              <div className="avatar-head" />
              <div className="avatar-body" />
            </div>
            <span className="story-char-name">Her</span>
          </div>
        </div>

        {/* Dialogue bubble */}
        <div className="story-dialogue" key={save.currentEventId}>
          <div className="story-bubble">
            <div className="story-title">{ev?.title ?? "…"}</div>
            <p className="story-text">{ev?.text ?? ""}</p>
          </div>

          {/* Choice buttons */}
          <div className="story-choices">
            {(ev?.choices ?? []).map((c: any) => (
              <button key={c.id} className="story-choice" onClick={() => choose(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Journal (Recent moments) */}
        <div className={`story-journal ${journalOpen ? "expanded" : ""}`}>
          <div className="story-journal-header" onClick={() => setJournalOpen(!journalOpen)}>
            <span className="story-journal-title">
              📖 Our Story
            </span>
            <span className="story-journal-toggle">▼</span>
          </div>
          <div className="story-journal-content">
            {save.log.length === 0 ? (
              <div className="story-journal-empty">
                Your journey will unfold here...
              </div>
            ) : (
              <ul className="story-journal-list">
                {save.log.slice(0, 8).map((l: { t: number; text: string }) => (
                  <li key={l.t} className="story-journal-item">{l.text}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Restarting overlay */}
      {restarting && (
        <div className="story-overlay">
          <div className="story-overlay-card">
            <div className="story-overlay-title">Restarting… 💫</div>
            <p style={{ color: "var(--story-muted)", marginBottom: "12px" }}>{toast}</p>
            <div className="story-progress-bar">
              <div className="story-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: "0.9rem", color: "var(--story-muted)" }}>{progress}%</span>
          </div>
        </div>
      )}

      {/* Rewards overlay */}
      {reward && (
        <div className="story-overlay" role="dialog" aria-modal="true">
          <div className="story-overlay-card">
            <div className="story-overlay-title">{reward.title}</div>
            <ul className="story-reward-list">
              {reward.lines.map((l, i) => (
                <li key={i} className="story-reward-item">{l}</li>
              ))}
            </ul>
            <button className="story-btn" onClick={() => setReward(null)}>
              Continue 💕
            </button>
          </div>
        </div>
      )}

      {/* Gates and overlays */}
      {burst && <MemoryBurst deck={burst.deck} pick={burst.pick} onDone={finishBurst} />}

      {puzzle && (
        <JigsawGate
          imageSrc={puzzle.imageSrc}
          rows={puzzle.rows}
          cols={puzzle.cols}
          title={puzzle.title}
          onSolved={finishPuzzle}
          onClose={() => {
            setPuzzle(null);
            setPendingAfterPuzzle(null);
          }}
        />
      )}

      {mapGate && (
        <MapDiscoverGate
          mapId={mapGate.mapId}
          title={mapGate.title}
          subtitle={mapGate.subtitle}
          onSolved={finishMapGate}
          onClose={() => {
            setMapGate(null);
            setPendingAfterMap(null);
          }}
        />
      )}

      {foodGate && (() => {
        const game = FOOD_GAMES[foodGate.gameId];
        if (!game) return null;

        return (
          <FoodOrderGate
            game={game}
            title={foodGate.title}
            subtitle={foodGate.subtitle}
            onDone={finishFoodGate}
          />
        );
      })()}

      {reflectionGate && (
        <ReflectionGate
          title={reflectionGate.title}
          subtitle={reflectionGate.subtitle}
          prompt={reflectionGate.prompt}
          onSkip={finishReflectionSkip}
          onSave={finishReflectionSave}
        />
      )}

      {picnicGate && (
  <div className="fixed inset-0 z-[99999] bg-black/30">
    <div className="absolute inset-0" />
    <div className="relative z-[100000] flex h-full items-center justify-center px-4">
      <PicnicDateGate
        title={picnicGate.title}
        subtitle={picnicGate.subtitle}
        onDone={finishPicnicGate}
      />
    </div>
  </div>
)}

      {roadTripMapGate && (
        <RoadTripMap
          fromStop={roadTripMapGate.fromStop}
          toStop={roadTripMapGate.toStop}
          title={roadTripMapGate.title}
          onDone={finishRoadTripMap}
        />
      )}

      {stargazingGate && (
        <StargazingMemory
          title={stargazingGate.title}
          subtitle={stargazingGate.subtitle}
          onDone={finishStargazing}
        />
      )}

      {canyonEchoGate && (
        <CanyonEcho
          title={canyonEchoGate.title}
          subtitle={canyonEchoGate.subtitle}
          onDone={finishCanyonEcho}
        />
      )}

      {tunnelViewGate && (
        <TunnelViewReveal
          imageSrc={tunnelViewGate.imageSrc}
          title={tunnelViewGate.title}
          subtitle={tunnelViewGate.subtitle}
          onDone={finishTunnelView}
        />
      )}

      {tidePoolGate && (
        <TidePoolMatch
          title={tidePoolGate.title}
          subtitle={tidePoolGate.subtitle}
          onDone={finishTidePool}
        />
      )}

      {pastryStackerGate && (
        <PastryStacker
          title={pastryStackerGate.title}
          subtitle={pastryStackerGate.subtitle}
          onDone={finishPastryStacker}
        />
      )}

      {foodLocationMatchGate && (
        <FoodLocationMatch
          title={foodLocationMatchGate.title}
          subtitle={foodLocationMatchGate.subtitle}
          onDone={finishFoodLocationMatch}
        />
      )}

      {spotTheCluesGate && (
        <SpotTheClues
          title={spotTheCluesGate.title}
          subtitle={spotTheCluesGate.subtitle}
          onDone={finishSpotTheClues}
        />
      )}

      {perfectMomentGate && (
        <PerfectMoment
          title={perfectMomentGate.title}
          subtitle={perfectMomentGate.subtitle}
          onDone={finishPerfectMoment}
        />
      )}

      {giggleGaugeGate && (
        <GiggleGauge
          title={giggleGaugeGate.title}
          subtitle={giggleGaugeGate.subtitle}
          onDone={finishGiggleGauge}
        />
      )}

      {epicEscapeGate && (
        <EpicEscape
          title={epicEscapeGate.title}
          subtitle={epicEscapeGate.subtitle}
          onDone={finishEpicEscape}
        />
      )}

      {waveRiderGate && (
        <WaveRider
          title={waveRiderGate.title}
          subtitle={waveRiderGate.subtitle}
          onDone={finishWaveRider}
        />
      )}

      {islandDriveGate && (
        <IslandDrive
          title={islandDriveGate.title}
          subtitle={islandDriveGate.subtitle}
          onDone={finishIslandDrive}
        />
      )}

      {shellMergeGate && (
        <ShellMerge
          title={shellMergeGate.title}
          subtitle={shellMergeGate.subtitle}
          onDone={finishShellMerge}
        />
      )}

      {leiPatternGate && (
        <LeiPattern
          title={leiPatternGate.title}
          subtitle={leiPatternGate.subtitle}
          onDone={finishLeiPattern}
        />
      )}

      {bouquetRushGate && (
        <BouquetRush
          title={bouquetRushGate.title}
          subtitle={bouquetRushGate.subtitle}
          onDone={finishBouquetRush}
        />
      )}

      {waterfallHopGate && (
        <WaterfallHop
          title={waterfallHopGate.title}
          subtitle={waterfallHopGate.subtitle}
          onDone={finishWaterfallHop}
        />
      )}

      {reviewGate && (
        <ReflectionReview
          reflections={save.reflections ?? []}
          title={reviewGate.title}
          closingLine={reviewGate.closingLine}
          onClose={finishReviewGate}
        />
      )}

      {showFinale && (
        <EndCreditsOverlay
          line={`Somewhere along the way, this trip changed "me" into "us."`}
          onDone={() => setShowFinale(false)}
        />
      )}
    </div>
  );
  
}
