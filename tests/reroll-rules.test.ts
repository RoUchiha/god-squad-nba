import { describe, expect, it } from 'vitest';
import {
  buildEraQueue,
  hasEraReroll,
  pickGambleEra,
  rerollEra,
  rerollTeam,
} from '../lib/eraQueue';
import {
  curatedEraWeight,
  getCuratedNBAEraCatalog,
  NBA_GOAT_SCORE,
  NBA_PLAYABLE_ERA_COUNT,
  NBA_TEAMS,
} from '../lib/sports/nba';
import type { Player } from '../lib/types';

function weightedPlayer(playerScore: number, isLegend = false): Player {
  return {
    id: `weight-${playerScore}-${isLegend}`,
    name: `Weight ${playerScore}`,
    position: 'PG',
    positionGroup: 'offense',
    yearsWithTeam: '2000-2004',
    stats: {},
    playerScore,
    isLegend,
  };
}

describe('NBA reroll rules', () => {
  it('builds a full roster-backed session queue with unique team-era keys', () => {
    const queue = buildEraQueue({ rng: () => 0.41 });
    const teams = new Set(queue.map(item => item.team.id));

    expect(queue).toHaveLength(NBA_PLAYABLE_ERA_COUNT);
    expect(new Set(queue.map(item => item.key)).size).toBe(queue.length);
    expect(teams.size).toBe(NBA_TEAMS.length);
  });

  it('team reroll stays in the same, previous, or next five-year era', () => {
    const queue = buildEraQueue({ rng: () => 0.33 });
    const current = queue[0];
    const result = rerollTeam(queue.slice(1), current.team.id, current.era.startYear, () => 0);

    expect(result).not.toBeNull();
    expect(result!.item.team.id).not.toBe(current.team.id);
    expect(Math.abs(result!.item.era.startYear - current.era.startYear)).toBeLessThanOrEqual(5);
    expect(result!.newQueue.some(item => item.key === result!.item.key)).toBe(false);
  });

  it('era reroll works first, keeps the franchise, and changes only its era', () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS')!;
    const queue = buildEraQueue({ rng: () => 0.5 }).filter(item => item.key !== '2-nba-2-2005');
    const result = rerollEra(queue, celtics, 'nba-2-2005', () => 0);

    expect(hasEraReroll(queue, celtics.id, 'nba-2-2005')).toBe(true);
    expect(result).not.toBeNull();
    expect(result!.item.team.id).toBe(celtics.id);
    expect(result!.item.era.id).not.toBe('nba-2-2005');
    expect(result!.newQueue.some(item => item.key === result!.item.key)).toBe(false);
  });

  it('era reroll unavailable returns null without consuming a queue item', () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS')!;
    const result = rerollEra([], celtics, 'nba-2-2005', () => 0);

    expect(result).toBeNull();
  });

  it('keeps draft, skip, team reroll, era reroll, and gamble selections unique', () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS')!;
    let queue = buildEraQueue({ rng: () => 0.37 });
    const seen = new Set<string>();

    const currentIndex = queue.findIndex(item => item.key === '2-nba-2-2005');
    expect(currentIndex).toBeGreaterThanOrEqual(0);
    const [current] = queue.splice(currentIndex, 1);
    seen.add(current.key);

    const skipped = queue.shift()!;
    expect(seen.has(skipped.key)).toBe(false);
    seen.add(skipped.key);

    const teamResult = rerollTeam(queue, current.team.id, current.era.startYear, () => 0);
    expect(teamResult).not.toBeNull();
    expect(seen.has(teamResult!.item.key)).toBe(false);
    seen.add(teamResult!.item.key);
    queue = teamResult!.newQueue;

    const eraResult = rerollEra(queue, celtics, current.era.id, () => 0);
    expect(eraResult).not.toBeNull();
    expect(seen.has(eraResult!.item.key)).toBe(false);
    seen.add(eraResult!.item.key);
    queue = eraResult!.newQueue;

    const gambleResult = pickGambleEra(queue, () => 0);
    expect(gambleResult).not.toBeNull();
    expect(seen.has(gambleResult!.item.key)).toBe(false);
    expect(gambleResult!.newQueue.some(item => item.key === gambleResult!.item.key)).toBe(false);
  });

  it('makes GOAT and multi-elite eras meaningfully rarer without removing them', () => {
    expect(curatedEraWeight([weightedPlayer(89)])).toBe(1);
    expect(curatedEraWeight([weightedPlayer(90)])).toBe(0.92);
    expect(curatedEraWeight([weightedPlayer(93)])).toBe(0.8);
    expect(curatedEraWeight([weightedPlayer(NBA_GOAT_SCORE)])).toBe(0.6);
    expect(curatedEraWeight([
      weightedPlayer(NBA_GOAT_SCORE, true),
      weightedPlayer(94, true),
      weightedPlayer(91, true),
    ])).toBe(0.3);

    const catalog = getCuratedNBAEraCatalog();
    const rareKeys = new Set(catalog.filter(item => item.goatPlayerCount > 0 || item.elitePlayerCount >= 2).map(item => item.key));
    const ordinaryKeys = new Set(catalog.filter(item => item.weight === 1).map(item => item.key));
    let rareFirstTen = 0;
    let ordinaryFirstTen = 0;

    for (let seed = 1; seed <= 240; seed++) {
      let state = seed;
      const rng = () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 0xffffffff;
      };
      const firstTen = buildEraQueue({ rng }).slice(0, 10);
      rareFirstTen += firstTen.filter(item => rareKeys.has(item.key)).length;
      ordinaryFirstTen += firstTen.filter(item => ordinaryKeys.has(item.key)).length;
    }

    expect(rareFirstTen).toBeGreaterThan(0);
    expect(ordinaryFirstTen).toBeGreaterThan(0);
    expect(rareFirstTen / rareKeys.size).toBeLessThan(
      (ordinaryFirstTen / ordinaryKeys.size) * 0.75
    );
  });
});
