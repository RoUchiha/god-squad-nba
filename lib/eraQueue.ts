/**
 * Client-side era queue — the ONLY source of truth for which team+era to show next.
 *
 * Builds a shuffled list of EVERY valid team+era combo (30 teams × ~11 eras ≈ 330 combos).
 * Popping from this list guarantees:
 *   - Every franchise appears before any franchise repeats
 *   - Every era appears at most once per game
 *   - Equal distribution across all teams
 */

import type { Era, HistoricalTeam } from './types';
import { generateTeamEras } from './constants';
import { NBA_TEAMS, NBA_CURATED_ERA_KEYS } from './sports/nba';

export type EraQueueItem = { team: HistoricalTeam; era: Era };

/** Fisher-Yates shuffle — unbiased O(n) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Returns a shuffled array of only curated team+era combos (real player names guaranteed). */
export function buildEraQueue(): EraQueueItem[] {
  const combos: EraQueueItem[] = NBA_TEAMS.flatMap(team =>
    generateTeamEras(team)
      .filter(era => NBA_CURATED_ERA_KEYS.includes(`${team.id}-${era.id}`))
      .map(era => ({ team, era }))
  );
  return shuffle(combos);
}

/** Find the next queue item with a different team. Removes it from the queue. */
export function rerollTeam(
  queue: EraQueueItem[],
  excludeTeamId: string,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const idx = queue.findIndex(item => item.team.id !== excludeTeamId);
  if (idx === -1) return null;
  const newQueue = [...queue];
  const [item] = newQueue.splice(idx, 1);
  return { item, newQueue };
}

/** Find the next queue item with a different era. Removes it from the queue. */
export function rerollEra(
  queue: EraQueueItem[],
  excludeEraId: string,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const idx = queue.findIndex(item => item.era.id !== excludeEraId);
  if (idx === -1) return null;
  const newQueue = [...queue];
  const [item] = newQueue.splice(idx, 1);
  return { item, newQueue };
}
