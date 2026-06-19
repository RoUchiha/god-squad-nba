# NBA God Squad: Next Session Handoff

## Mission

Implement the gameplay and presentation requests in this document. This file was created as a handoff only; none of the requested gameplay changes below have been implemented yet.

Work from the repository's current `master` baseline, merge commit `2a8440889bdb592acfcb1379af76e78e9df19651`. The production project is `nba-god-squad` and its stable URL is <https://nba-god-squad.vercel.app>.

Keep API keys and secrets server-side. Do not expose BallDontLie, OpenAI, cron, or other secrets through `NEXT_PUBLIC_*`, client bundles, logs, or API responses.

## User Requests

1. Include every NBA team and every supported historical era. The user is repeatedly seeing roughly the same five teams.
2. Make team-era randomization slightly less likely to surface combinations with multiple 90+ players or multiple Hall of Fame players. This should be a light weighting adjustment, not a ban or a major nerf; elite combinations should still feel attainable and special.
3. Change Position Swap so it swaps two players already on the user's roster. It must never recruit a replacement from the current selection pool.
4. After the roster is complete, offer a Gamble action on roster positions. A gamble rolls a random team-era and automatically replaces the selected slot with the highest-rated compatible player from that team-era. The result may be better or worse.
5. Add a hidden Sixth Man specialist mechanic. Notable all-time sixth men receive an effective player rating floor of 90 only while occupying the `6man` slot.
6. Fix Era Reroll so it works independently, without first using Team Reroll.
7. Replace the nearly black background with a richer basketball-specific dark background that preserves text contrast and keeps attention on the game.

## Verified Current State

These counts were derived directly from `lib/constants.ts`, `lib/sports/nba.ts`, and `lib/eraQueue.ts` on commit `2a84408`:

- `NBA_TEAMS` contains all 30 current franchises.
- `generateTeamEras()` currently produces **325 theoretical team-era IDs** across 1970-1974 through 2025-2029, after its current founding-year exclusions.
- `NBA_HISTORICAL_ROSTERS` contains only **42 curated, playable team-era rosters**.
- Those 42 rosters cover only **18 of 30 franchises**.
- `buildEraQueue()` does not enqueue all 42 playable team-eras. It picks one random curated era per represented franchise, so a new game's queue contains only **18 entries**.
- Twelve franchises currently have no curated roster and are excluded from drafting entirely: Mavericks, Pacers, Clippers, Grizzlies, Timberwolves, Pelicans, Knicks, Thunder, Magic, Trail Blazers, Kings, and Wizards.

Current curated distribution by team ID:

| Team | ID | Curated eras |
|---|---:|---|
| Hawks | 1 | 1985, 1990, 1995, 2015 |
| Celtics | 2 | 1980, 1985, 2005, 2010 |
| Nets | 3 | 1990, 2000, 2010, 2015 |
| Hornets | 4 | 1995, 2000, 2010 |
| Bulls | 5 | 1990, 1995, 2010 |
| Cavaliers | 6 | 1985, 1990, 2005, 2015 |
| Nuggets | 8 | 2020 |
| Pistons | 9 | 1985, 1990 |
| Warriors | 10 | 2015, 2020 |
| Rockets | 11 | 1990, 1995 |
| Lakers | 14 | 1980, 1985, 2000, 2005 |
| Heat | 16 | 2005, 2010 |
| Bucks | 17 | 2020 |
| 76ers | 23 | 1980 |
| Suns | 24 | 2005 |
| Spurs | 27 | 2000, 2005 |
| Raptors | 28 | 2015 |
| Jazz | 29 | 1995 |

Do not report 325 as the current playable count. The current honest answer is **42 roster-backed team-era options across 18 teams**, with only **18 options placed in each fresh queue**.

## Important Data Defects

`TEAM_FOUNDED` in `lib/constants.ts` has mismatched IDs/comments and must be corrected before using generated era totals as a source of truth:

- ID 15 is Memphis, not Toronto.
- ID 18 is Minnesota, not Orlando.
- ID 22 is Orlando, not Minnesota.
- ID 30 is Washington, not Oklahoma City/Seattle.
- Oklahoma City is ID 21. If Seattle history is intentionally inherited, encode and document that explicitly.
- Charlotte/New Orleans franchise lineage needs an explicit product rule rather than a misleading single founding year.

The generated 2025-2029 era is incomplete/future-facing as of this handoff. Decide whether it is supported using completed data, current-season data, or omitted until enough data exists. Do not label an era complete when its source window is not complete.

## Root Causes and Implementation Map

### Team-era coverage and repetition

Primary files:

- `lib/sports/nba.ts`: `NBA_HISTORICAL_ROSTERS`, `NBA_CURATED_ERA_KEYS`, player scoring and roster loading.
- `lib/constants.ts`: team-era generation and founding-year metadata.
- `lib/eraQueue.ts`: queue construction and both reroll functions.
- `components/GameContainer.tsx`: reducer state, seen-state behavior, async loads, and UI transitions.
- `app/api/players/[sport]/route.ts`: validates team/era and returns the roster.

The comment in `lib/eraQueue.ts` claims the queue contains every valid combination, but the implementation deliberately reduces it to one random curated era per team. Replace the comment and implementation together.

Do not "fix" coverage by exposing `fakeName()` fallback rosters as historical truth. Every enabled team-era needs an accurate roster, role eligibility, and peak-within-era stat line. Prefer a versioned, validated data artifact or a server-side generation/refresh pipeline over hundreds of untested inline literals. At minimum, every team must have multiple accurate era options before claiming complete coverage.

Recommended queue model:

- Build from the complete validated roster-key catalog, not `generateTeamEras()` alone.
- Track `seenTeamEraKeys: Set<string>` for the entire run.
- Never show the same team-era twice in a run, whether it was drafted, skipped, team-rerolled, era-rerolled, or used by Gamble.
- Preserve the existing Team Reroll rule: different franchise and era start in `{current - 5, current, current + 5}`.
- Preserve the existing Era Reroll rule: same franchise, any other supported era.
- If no valid candidate exists, show a clear disabled/unavailable state; do not silently consume a reroll.
- Add deterministic RNG injection for tests instead of monkey-patching `Math.random`.

### Light elite-team weighting

Weight team-era entries, not individual players. Calculate the weight from the finalized roster ratings and flags:

- Start at `1.0`.
- Apply a small penalty when an era has at least two `playerScore >= 90` players.
- Apply a small penalty when it has at least two Hall of Fame/legend players.
- Suggested calibration range: `0.80-0.90` for one elite condition and a floor around `0.70-0.80` when both conditions apply.
- Keep every eligible entry's weight greater than zero.
- Normalize weighted selection over unseen eligible entries.

Do not hardcode favored/disfavored franchise names. Add a seeded Monte Carlo test showing elite eras are modestly less frequent than ordinary eras while still appearing regularly. Also test that weighting does not reduce franchise or era coverage over a full exhausted queue.

### Position Swap

Current bug: `ACTIVATE_SWAP` sets `swapSlotId`, then `DRAFT_PLAYER` replaces that roster slot using a player from `PlayerPool`. The yellow banner explicitly tells the user to pick a pool player.

Required replacement interaction:

1. Click the swap icon on filled roster slot A.
2. Highlight compatible filled roster slots B.
3. Clicking B swaps the two existing roster players only if player A fits slot B and player B fits slot A.
4. An invalid target produces the existing visual shake/error treatment and changes no roster, queue, reroll, or simulation state.
5. Cancel leaves the roster unchanged.

Remove swap handling from `DRAFT_PLAYER`. Model the action explicitly, for example `START_ROSTER_SWAP`, `COMMIT_ROSTER_SWAP`, and `CANCEL_ROSTER_SWAP`. Preserve the existing one-use limit unless product behavior is intentionally changed and documented.

### Completed-roster Gamble

Gamble is a separate mechanic from Position Swap and only appears in `phase === 'complete'`.

Recommended conservative interpretation where the request is silent:

- One Gamble total per completed roster/run, with an action available on each slot until one is chosen.
- Show a confirmation explaining that the result is random and may lower the roster rating.
- Randomly select one unseen validated team-era using the same light elite weighting.
- From that era, filter out duplicate players already on the roster and keep players compatible with the selected slot.
- Select the compatible candidate with the highest `playerScore`.
- Replace the slot player irreversibly, mark the chosen team-era seen, recompute GSPR/composition, and keep the roster complete.
- If an era has no eligible candidate, sample another unseen era without charging the Gamble. Bound the search and show an error if no candidate exists.
- Do not auto-simulate or grant an extra season simulation.

Clarify with the user only if implementation finds a strong reason to prefer one Gamble per slot instead of one per run. One per run is the safer balance default.

### Sixth Man specialist floor

The mechanic must be slot-aware. Do not permanently mutate the underlying player's `playerScore`; the same player should return to the base rating outside the `6man` slot.

Use one shared helper such as `effectivePlayerScore(slot, player)` everywhere rating matters:

- roster display and player detail card,
- `computeTeamGSPR`, offense/defense/chemistry calculations,
- team composition pros/cons,
- simulation payload/results and stat-line generation,
- record explanation inputs.

For approved specialists in `slot.id === '6man'`, return `Math.max(baseScore, 90)`. The boost is a floor, never a downgrade. Keep the mechanic unadvertised; the visible rating can change to 90, but do not add explanatory promo copy or a badge.

Research seed list:

- Confirmed historical Sixth Man of the Year names to prioritize: Jamal Crawford, Lou Williams, Manu Ginobili, Kevin McHale, Detlef Schrempf, Ricky Pierce, Jason Terry, Toni Kukoc, Bobby Jones, Lamar Odom, Michael Cooper, and Bill Walton.
- Additional iconic bench-role candidate requiring an explicit research decision: Vinnie Johnson.
- Award-history reference used for the seed list: <https://en.wikipedia.org/wiki/NBA_Sixth_Man_of_the_Year_Award>.
- NBA award landing page should be preferred for final validation when reachable: <https://www.nba.com/awards>.

Current data presence: Manu Ginobili, Kevin McHale, Toni Kukoc, Bobby Jones, Lamar Odom, Michael Cooper, Bill Walton, and Vinnie Johnson are present. Jamal Crawford, Lou Williams, Detlef Schrempf, Ricky Pierce, Jason Terry, and John Havlicek are absent, reinforcing the roster-coverage gap.

Normalize identity matching for punctuation, suffixes, and diacritics. Prefer stable canonical player IDs or an explicit `sixthManSpecialist` data flag over raw display-name matching.

### Era Reroll

`rerollEra()` itself does not depend on Team Reroll, but it returns `null` when the current franchise has only one curated era. Six represented franchises currently have exactly one curated era, and the UI silently does nothing because the reducer returns unchanged.

Fix the behavior at both layers:

- Expand validated era coverage so each supported franchise has meaningful alternatives.
- Derive `canRerollEra` from unseen eras for the current team.
- Era Reroll must work as the first reroll action in a fresh game.
- It must preserve the team, choose a different unseen era, load that roster, and consume only the era reroll.
- It must not consume Team Reroll or require a prior queue mutation.
- A failed/unavailable reroll must not be marked used and must provide user feedback.

### Background

Current `app/globals.css` uses a very dark striped gradient over `#090806`, which still reads as almost black in the live app.

Use a restrained basketball-specific bitmap texture or photographic court detail with a dark overlay, not decorative blobs. A subtle hardwood/court-line treatment is appropriate. Requirements:

- Maintain WCAG-readable contrast for all text and controls.
- Keep the central gameplay surface quiet; avoid high-frequency texture behind stat tables.
- No oversized marketing hero, floating decorative cards, or gradient-orb treatment.
- Verify desktop and mobile screenshots, including long roster and simulation states.
- Avoid remote asset fragility; commit an optimized local WebP/AVIF asset with licensing/provenance documented, or generate an original bitmap asset.

## Required Tests

Add or extend focused tests before browser validation:

1. Data catalog test: all 30 franchises have supported, validated roster-backed eras; every enabled roster has enough real players and all required positions can be filled through secondary roles.
2. Count test: exported catalog count exactly matches the queue's unique key count. No misleading theoretical count.
3. Queue test: no repeated team-era across draft, skip, both rerolls, and Gamble.
4. Distribution test: seeded random runs cover the full catalog; elite entries receive only the intended modest frequency reduction.
5. Era reroll test: succeeds before Team Reroll, keeps team, changes era, and consumes only its own token.
6. Era reroll unavailable test: no silent no-op and no token consumption.
7. Position Swap test: swaps two roster players, never reads the current player pool, validates both directions, and preserves queue state.
8. Gamble test: available only when complete, uses a random unseen era, selects the highest-rated compatible non-duplicate player, and recomputes GSPR.
9. Sixth Man test: approved specialist below 90 becomes exactly 90 in `6man`, retains a higher native score, and reverts to base score outside `6man`.
10. Simulation consistency test: effective Sixth Man rating is identical in roster display, GSPR, API payload validation, results, and explanations.

Run:

```text
npm run typecheck
npm test
npm run build
```

Then validate production-like behavior in the browser at desktop and mobile widths:

- play enough new games to demonstrate broad franchise/era variety,
- use Era Reroll first,
- complete a valid roster swap,
- reject an invalid roster swap without changing the era,
- fill a roster and complete one Gamble,
- verify a specialist's slot-aware Sixth Man floor,
- simulate and re-simulate once,
- confirm no console errors, failed API calls, overlap, or unreadable background contrast.

## Definition of Done

- The app can truthfully state its playable team-era count from one exported source of truth.
- All 30 teams are represented with accurate roster-backed historical eras; no fake names are presented as real history.
- Randomization has broad variety, no in-run duplicates, and only a light elite-era weight penalty.
- Era Reroll works independently on first use.
- Position Swap is roster-to-roster only.
- Gamble works only after completion and follows the random-era/highest-compatible-player rule.
- Sixth Man specialist scoring is slot-aware and consistent across every calculation/rendering path.
- The background is visibly basketball-specific, dark, legible, responsive, and locally reliable.
- Typecheck, tests, build, and end-to-end browser checks pass.
- Any new server-side data/API integration follows the existing security constraints and does not expose secrets.
