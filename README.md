# NBA God Squad

Build the greatest NBA roster of all-time. Draft real players from 114 playable historical team-eras, simulate an 82-game season, and find out if your squad has what it takes to go 82-0.

**Live:** [nba-god-squad.vercel.app](https://nba-god-squad.vercel.app)

---

## What It Is

NBA God Squad is a single-page draft game where you:

1. Pick a team era, like "Kobe & Gasol" Lakers 2005-09 or "Splash Brothers" Warriors 2015-19.
2. Choose one player from that era's real historical roster.
3. Fill all 6 roster slots: PG, SG, SF, PF, C, and 6th Man.
4. Get your **GSPR** (God Squad Power Rating) and see if you built a dynasty.

Rosters come from validated historical data. No fake names, no placeholder stats.

---

## How to Play

1. A random **historical era** is chosen for you: team plus 5-year window.
2. Browse the **player pool** and click one player to draft them.
3. The pool locks immediately after your pick, preventing double-drafts.
4. Use one-time rerolls or a roster-to-roster position swap when they help.
5. Repeat until all 6 slots are filled.
6. Try one completed-roster Gamble, then see your final GSPR score and tier.

---

## Features

- **114 playable historical team-eras** across all 30 NBA franchises, with at least 3 per franchise and adjacent 50% roster-overlap eras combined.
- **Real player stats** from validated hardcoded historical rosters.
- **GSPR power rating** using offense, defense, depth, and chemistry factors.
- **5 GSPR tiers:** Average, Good, Great, Legendary, and GOD SQUAD.
- **Multi-pick prevention** through reducer-level state transitions.
- **No team-era repeats** across drafts, skips, rerolls, and Gamble.
- **Roster-to-roster Position Swap** for two compatible filled slots.
- **Completed-roster Gamble** that replaces one slot from a random unseen team-era.
- **Simulation integrity lock** that permanently freezes rerolls, swaps, and Gamble on the first simulation click while the server restores canonical player ratings and stats.
- **NBA-only**: focused, fast, and built around historical basketball.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js App Router |
| UI | React + TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Rating | Custom GSPR algorithm (`lib/algorithms/powerRating.ts`) |
| Player data | Validated hardcoded historical rosters |
| Deployment | Vercel |

---

## Local Dev

```bash
cd nba-god-squad
npm install
npm run dev        # http://localhost:3001
npm run build      # production build
```

No environment variables are required for the curated NBA game. Optional server-only
season explanations use `OPENAI_API_KEY`; the protected refresh route requires
`CRON_SECRET`. Keep both in Vercel environment variables or `.env.local`, never in a
`NEXT_PUBLIC_*` variable.

---

## Project Structure

```text
app/
  page.tsx                        - main game page
  api/players/[sport]/route.ts    - player fetch endpoint
components/
  PlayerPool.tsx                  - draft pool with multi-pick lock
  PlayerCard.tsx                  - individual player card
  TeamRoster.tsx                  - roster slots, swap, and Gamble actions
  PowerMeter.tsx                  - GSPR display and tier badge
lib/
  constants.ts                    - era names/descriptions, GSPR tiers, roster template
  eraQueue.ts                     - weighted queue from curated roster-backed eras
  effectivePlayerScore.ts         - slot-aware effective rating helpers
  gamble.ts                       - completed-roster Gamble replacement selection
  rosterActions.ts                - roster-to-roster swap validation
  types.ts                        - shared TypeScript types
  sports/
    nba.ts                        - NBA teams, curated roster catalog, player loading
    nba-curated-expansion.ts      - additional curated historical rosters
    nba-franchise-depth.ts        - franchise-depth rosters for 3+ playable eras per team
  algorithms/
    powerRating.ts                - GSPR formula and duo/chemistry bonuses
```

---

## GSPR Formula

```text
GSPR = offense + defense + depth + chemistry bonuses
```

- **Offense score** measures scoring, efficiency, creation, and role fit.
- **Defense score** measures defensive box-score impact and lineup balance.
- **Depth score** rewards complete, balanced rosters.
- **Chemistry bonus** rewards historically proven duos and championship cores.

---

## Deployment

Auto-deploys to Vercel on every push to `master`.

```bash
# Manual redeploy
npx vercel --prod --scope rouchihas-projects
```

Vercel project: **`nba-god-squad`**, separate from the original multi-sport `god-squad` project.

Production security settings and the Vercel Firewall checklist are documented in
[`SECURITY.md`](SECURITY.md).

> **Note:** `.vercel/project.json` is gitignored. To re-link after a fresh clone:
>
> ```bash
> npx vercel link --yes --scope rouchihas-projects
> ```
