/**
 * Client-side playable era queue.
 *
 * The queue is built only from validated roster-backed team-era entries. It is
 * a weighted permutation: superstar and elite-heavy eras are meaningfully less
 * likely to appear early, but every entry remains in the run and can still be
 * exhausted.
 */

import type { Era, HistoricalTeam } from './types';
import { getCuratedNBAEraCatalog } from './sports/nba';

export type Rng = () => number;

export type EraQueueItem = {
  key: string;
  team: HistoricalTeam;
  era: Era;
  weight: number;
  elitePlayerCount: number;
  legendCount: number;
};

export interface EraQueueOptions {
  rng?: Rng;
  excludeKeys?: Iterable<string>;
}

function boundedRandom(rng: Rng): number {
  const value = rng();
  if (!Number.isFinite(value)) return 0;
  return Math.min(0.999999999, Math.max(0, value));
}

function weightedPickIndex(items: EraQueueItem[], rng: Rng): number {
  const total = items.reduce((sum, item) => sum + Math.max(0.001, item.weight), 0);
  let cursor = boundedRandom(rng) * total;

  for (let i = 0; i < items.length; i++) {
    cursor -= Math.max(0.001, items[i].weight);
    if (cursor <= 0) return i;
  }

  return items.length - 1;
}

function weightedShuffle(items: EraQueueItem[], rng: Rng): EraQueueItem[] {
  const remaining = [...items];
  const shuffled: EraQueueItem[] = [];

  while (remaining.length > 0) {
    const index = weightedPickIndex(remaining, rng);
    const [item] = remaining.splice(index, 1);
    shuffled.push(item);
  }

  return shuffled;
}

function removeQueueKey(queue: EraQueueItem[], key: string): EraQueueItem[] {
  return queue.filter(item => item.key !== key);
}

function pickFromQueue(
  queue: EraQueueItem[],
  predicate: (item: EraQueueItem) => boolean,
  rng: Rng
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const candidates = queue.filter(predicate);
  if (candidates.length === 0) return null;
  const item = candidates[weightedPickIndex(candidates, rng)];
  return { item, newQueue: removeQueueKey(queue, item.key) };
}

export function buildEraQueue(options: EraQueueOptions = {}): EraQueueItem[] {
  const rng = options.rng ?? Math.random;
  const excluded = new Set(options.excludeKeys ?? []);
  const catalog = getCuratedNBAEraCatalog()
    .filter(entry => !excluded.has(entry.key))
    .map(entry => ({ ...entry }));

  return weightedShuffle(catalog, rng);
}

export function hasTeamReroll(
  queue: EraQueueItem[],
  excludeTeamId: string,
  currentEraStart: number,
): boolean {
  const allowedStarts = new Set([currentEraStart - 5, currentEraStart, currentEraStart + 5]);
  return queue.some(item => item.team.id !== excludeTeamId && allowedStarts.has(item.era.startYear));
}

export function hasEraReroll(
  queue: EraQueueItem[],
  teamId: string,
  excludeEraId: string,
): boolean {
  return queue.some(item => item.team.id === teamId && item.era.id !== excludeEraId);
}

export function rerollTeam(
  queue: EraQueueItem[],
  excludeTeamId: string,
  currentEraStart: number,
  rng: Rng = Math.random,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  const allowedStarts = new Set([currentEraStart - 5, currentEraStart, currentEraStart + 5]);
  return pickFromQueue(
    queue,
    item => item.team.id !== excludeTeamId && allowedStarts.has(item.era.startYear),
    rng
  );
}

export function rerollEra(
  queue: EraQueueItem[],
  team: HistoricalTeam,
  excludeEraId: string,
  rng: Rng = Math.random,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  return pickFromQueue(
    queue,
    item => item.team.id === team.id && item.era.id !== excludeEraId,
    rng
  );
}

export function pickGambleEra(
  queue: EraQueueItem[],
  rng: Rng = Math.random,
): { item: EraQueueItem; newQueue: EraQueueItem[] } | null {
  return pickFromQueue(queue, () => true, rng);
}
