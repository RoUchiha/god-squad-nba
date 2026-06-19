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

function curatedEras(team: HistoricalTeam): Era[] {
  return generateTeamEras(team).filter(era =>
    NBA_CURATED_ERA_KEYS.includes(`${team.id}-${era.id}`)
  );
}

/** One appearance per franchise, with a random curated era for that appearance. */
export function buildEraQueue(): EraQueueItem[] {
  return shuffle(NBA_TEAMS).flatMap(team => {
    const eras = curatedEras(team);
    if (eras.length === 0) return [];
    return [{ team, era: eras[Math.floor(Math.random() * eras.length)] }];
  });
}

/** Find the next queue item with a different team. Removes it from the queue. */
export function rerollTeam(
  queue: EraQueueItem[],
  excludeTeamId: string,
  currentEraStart: number,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const allowedStarts = new Set([currentEraStart - 5, currentEraStart, currentEraStart + 5]);
  const idx = queue.findIndex(item =>
    item.team.id !== excludeTeamId && curatedEras(item.team).some(era => allowedStarts.has(era.startYear))
  );
  if (idx === -1) return null;
  const newQueue = [...queue];
  const [queuedItem] = newQueue.splice(idx, 1);
  const eras = curatedEras(queuedItem.team).filter(era => allowedStarts.has(era.startYear));
  const item = { team: queuedItem.team, era: eras[Math.floor(Math.random() * eras.length)] };
  return { item, newQueue };
}

/** Find the next queue item with a different era. Removes it from the queue. */
export function rerollEra(
  queue: EraQueueItem[],
  team: HistoricalTeam,
  excludeEraId: string,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const eras = curatedEras(team).filter(era => era.id !== excludeEraId);
  if (eras.length === 0) return null;
  return {
    item: { team, era: eras[Math.floor(Math.random() * eras.length)] },
    newQueue: queue,
  };
}
