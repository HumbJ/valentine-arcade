# Our Little Life – Project Context

Framework:
- Vite + React + TypeScript

Core Concept:
- Valentine-themed interactive narrative game
- Cozy, emotionally paced
- Memories should feel earned, not rushed

Architecture:
- Narrative events live in `src/life/events.ts`
- Progression controlled by effects processed in LifePage
- Save system uses localStorage (`src/life/save.ts`)
- No routing between narrative beats; everything flows via effects

Gate System:
- Gates intercept effects before they apply
- Current gate types:
  - mapDiscover → MapDiscoverGate
  - foodOrder → FoodOrderGate
  - puzzle → JigsawGate
  - burst → MemoryBurst
- Gates are handled in LifePage via `runEffects()`
- Gates resolve → remaining effects continue

Food Mini-Game Pattern:
- FoodOrderGate uses draggable ordering
- Supports multiple valid orders
- Final image is a reward (not part of the game)
- Flow: play → reward screen → continue → MemoryBurst

Design Rules:
- Mechanics never overshadow emotional beats
- Reward images appear *after* interaction
- UI uses soft pink / cozy overlay style
- No abrupt transitions

How I want help:
- Step-by-step
- Exact code snippets + file locations
- No full ZIP replacements
- Assume beginner-friendly explanations


# Our Little Life — Project Context (2nd prompt paste)

Framework: Vite + React (TypeScript)

This is a narrative-driven, cozy interactive story with persistent state.

## Core Concepts

- Story is driven by `LifeEvent` objects.
- Player choices trigger `Effect[]`.
- Effects are processed through a central `runEffects()` function.
- Some effects are UI gates (intercepted), others mutate save state.

## Save System

- SaveData is persisted in localStorage.
- All save updates MUST use functional setState to avoid stale overwrites.
- Reflections are appended and must persist before navigation effects apply.

## Gates / Intercepts

Gates temporarily pause effect processing:
- burst → Memory slideshow
- puzzle → Jigsaw mini-game
- mapDiscover → Exploration map
- foodOrder → Ordering game
- reflectionPrompt → Text input saved to reflections
- reflectionReview → Read saved reflections

Pattern:
1. Intercept effect
2. Store remaining effects
3. Gate finishes
4. Resume via `runEffects(rest)`

## Design Rules

- Emotional pacing > mechanics
- Fewer interactions, but meaningful
- No “gamey” UI unless intentional
- Prefer cinematic transitions and earned rewards

## Current Major Arcs

- Disneyland (completed)
- Seattle Trip I (completed, includes reflection + outro)
