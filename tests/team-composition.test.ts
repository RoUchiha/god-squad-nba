import { describe, expect, it } from 'vitest';
import type { FilledRosterSlot, Player } from '../lib/types';
import { analyzeTeamComposition } from '../lib/teamComposition';

function player(overrides: Partial<Player>): Player {
  return {
    id: 'p-1',
    name: 'Player One',
    position: 'PG',
    positionGroup: 'offense',
    yearsWithTeam: '2000-2004',
    stats: {
      points: 20,
      rebounds: 5,
      assists: 5,
      steals: 1,
      blocks: 0.5,
      fieldGoalPct: 0.46,
      threePointPct: 0.35,
      freeThrowPct: 0.78,
    },
    playerScore: 80,
    ...overrides,
  };
}

function slot(position: Player['position'], playerValue: Player | null): FilledRosterSlot {
  return {
    id: position.toLowerCase(),
    label: position,
    position,
    group: 'offense',
    required: true,
    player: playerValue,
  };
}

describe('team composition analysis', () => {
  it('generates roster-specific pros and cons from player stats and profiles', () => {
    const slots = [
      slot('PG', player({
        id: 'magic',
        name: 'Magic Johnson',
        position: 'PG',
        stats: { points: 22, rebounds: 7, assists: 12, steals: 2, blocks: 0.4, fieldGoalPct: 0.52, threePointPct: 0.30, freeThrowPct: 0.85 },
        playerScore: 96,
        isLegend: true,
      })),
      slot('SG', player({
        id: 'klay',
        name: 'Klay Thompson',
        position: 'SG',
        stats: { points: 22, rebounds: 4, assists: 2, steals: 1, blocks: 0.5, fieldGoalPct: 0.46, threePointPct: 0.42, freeThrowPct: 0.86 },
        playerScore: 88,
        isAllStar: true,
      })),
      slot('SF', player({
        id: 'rodman',
        name: 'Dennis Rodman',
        position: 'SF',
        stats: { points: 6, rebounds: 15, assists: 2, steals: 0.7, blocks: 0.6, fieldGoalPct: 0.49, threePointPct: 0.17, freeThrowPct: 0.58 },
        playerScore: 78,
      })),
    ];

    const analysis = analyzeTeamComposition(slots);
    const combined = [...analysis.pros, ...analysis.cons].join(' ');

    expect(analysis.pros.length).toBeGreaterThan(0);
    expect(analysis.cons.length).toBeGreaterThan(0);
    expect(combined).toContain('Magic Johnson');
    expect(combined).toMatch(/12(\.0)? APG|Klay Thompson|Dennis Rodman/);
    expect(combined).not.toContain('Depth');
  });
});
