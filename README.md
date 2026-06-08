# 🏀 NBA God Squad

Build the greatest NBA roster of all-time. Draft real players from 43 curated historical eras, simulate an 82-game season, and find out if your squad has what it takes to go 82-0.

**Live:** [nba-god-squad.vercel.app](https://nba-god-squad.vercel.app)

---

## What It Is

NBA God Squad is a single-page draft game where you:

1. Pick a team era (e.g. "Kobe & Gasol" Lakers 2005–09, "Splash Brothers" Warriors 2015–19)
2. Choose one player from that era's real historical roster
3. Fill all 6 roster slots (PG / SG / SF / PF / C / 6th Man)
4. Get your **GSPR** (God Squad Power Rating) and see if you built a dynasty

Rosters come from hardcoded historical data — no fake names, no placeholder stats.

---

## How to Play

1. A random **historical era** is chosen for you (team + 5-year window)
2. Browse the **player pool** and click one player to draft them
3. The pool locks immediately after your pick — no double-drafts
4. Repeat until all 6 slots are filled
5. See your final GSPR score and tier

---

## Features

- **43 curated historical eras** across 18 franchises with real era names (e.g. "Showtime I", "Second Three-Peat", "Jokic Era")
- **Real player stats** from hardcoded historical rosters + ESPN API for 2020+ eras
- **GSPR power rating** — 90% offense, 10% depth, with historic duo/chemistry bonuses
- **5 GSPR tiers:** Average → Good → Great → Legendary → GOD SQUAD (950+)
- **Multi-pick prevention** — three-layer lock: reducer guard + component remount + `useRef` synchronous click lock
- **No era repeats** — each team era only appears once per session
- **NBA-only** — laser-focused, no multi-sport clutter

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Rating | Custom GSPR algorithm (`lib/algorithms/powerRating.ts`) |
| Player data | Hardcoded historical rosters + ESPN API fallback |
| Deployment | Vercel |

---

## Local Dev

```bash
cd nba-god-squad
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

No environment variables required. ESPN live-roster fetch (2020+ eras) needs no API key.

---

## Project Structure

```
app/
  page.tsx                        — main game page
  api/players/[sport]/route.ts    — player fetch endpoint
components/
  PlayerPool.tsx     — draft pool with multi-pick lock
  PlayerCard.tsx     — individual player card
  RosterSlot.tsx     — filled/empty roster slot display
  ScorePanel.tsx     — GSPR display and tier badge
lib/
  constants.ts       — ERA_DATA (names/descriptions), GSPR_TIERS, generateTeamEras
  eraQueue.ts        — builds random draft queue filtered to curated eras
  types.ts           — shared TypeScript types
  sports/
    nba-espn.ts      — ESPN fetch + NBA_HISTORICAL_ROSTERS (43 eras)
  algorithms/
    powerRating.ts   — GSPR formula and duo/chemistry bonuses
```

---

## GSPR Formula

```
GSPR = (offenseScore × 0.90) + (depthScore × 0.10) + (totalBonus × 0.15)
```

- **offenseScore** — average offensive rating across all 6 players (0–100 scale)
- **depthScore** — measures how evenly distributed ratings are (rewards balanced rosters)
- **totalBonus** — historic duo bonuses (Kobe + Shaq, Jordan + Pippen, etc.) + ring bonuses

---

## Deployment

Auto-deploys to Vercel on every push to `master`.

```bash
# Manual redeploy
npx vercel --prod --scope rouchihas-projects
```

Vercel project: **`nba-god-squad`** — separate from the original multi-sport `god-squad` project.

> **Note:** `.vercel/project.json` is gitignored. To re-link after a fresh clone:
> ```bash
> npx vercel link --yes --scope rouchihas-projects
> ```
