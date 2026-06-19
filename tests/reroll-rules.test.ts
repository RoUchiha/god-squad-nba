import { describe, expect, it } from 'vitest';
import { buildEraQueue, rerollEra, rerollTeam } from '../lib/eraQueue';
import { NBA_TEAMS } from '../lib/sports/nba';

describe('NBA reroll rules', () => {
  it('builds a session queue with no repeated franchise', () => {
    const queue = buildEraQueue();
    expect(new Set(queue.map(item => item.team.id)).size).toBe(queue.length);
  });

  it('team reroll stays in the same, previous, or next five-year era', () => {
    const queue = buildEraQueue();
    const current = queue[0];
    const result = rerollTeam(queue.slice(1), current.team.id, current.era.startYear);
    expect(result).not.toBeNull();
    expect(result!.item.team.id).not.toBe(current.team.id);
    expect(Math.abs(result!.item.era.startYear - current.era.startYear)).toBeLessThanOrEqual(5);
    expect(result!.newQueue.some(item => item.team.id === result!.item.team.id)).toBe(false);
  });

  it('era reroll keeps the franchise and changes only its era', () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS')!;
    const result = rerollEra([], celtics, 'nba-2-2005');
    expect(result).not.toBeNull();
    expect(result!.item.team.id).toBe(celtics.id);
    expect(result!.item.era.id).not.toBe('nba-2-2005');
  });
});
