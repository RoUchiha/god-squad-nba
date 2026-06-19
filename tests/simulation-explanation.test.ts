import { describe, expect, it } from 'vitest';
import { computeTeamGSPR } from '../lib/algorithms/powerRating';
import { estimateUndefeatedChance, getBaseWinProbability, simulateSeason } from '../lib/algorithms/simulator';
import { explainSeasonRecord } from '../lib/recordJustification';
import { resetServerEnvForTests } from '../lib/serverEnv';
import type { FilledRosterSlot, Player } from '../lib/types';

function player(overrides: Partial<Player>): Player {
  return {
    id: overrides.name?.toLowerCase().replace(/\s+/g, '-') ?? 'player',
    name: 'Player',
    position: 'PG',
    positionGroup: 'offense',
    yearsWithTeam: '2000-2004',
    stats: {},
    playerScore: 80,
    ...overrides,
  };
}

function slot(id: string, position: Player['position'], playerValue: Player): FilledRosterSlot {
  return {
    id,
    label: position,
    position,
    group: 'offense',
    required: true,
    player: playerValue,
  };
}

function godLineup(): FilledRosterSlot[] {
  return [
    slot('pg', 'PG', player({
      name: 'Stephen Curry',
      position: 'PG',
      yearsWithTeam: '2020-2024',
      stats: { points: 32, rebounds: 6.1, assists: 6.3, steals: 1.3, blocks: 0.4, fieldGoalPct: 0.493, threePointPct: 0.427, freeThrowPct: 0.923 },
      playerScore: 98,
      isLegend: true,
    })),
    slot('sg', 'SG', player({
      name: 'Michael Jordan',
      position: 'SG',
      yearsWithTeam: '1990-1994',
      stats: { points: 32.6, rebounds: 6.7, assists: 5.5, steals: 2.8, blocks: 0.8, fieldGoalPct: 0.519, threePointPct: 0.376, freeThrowPct: 0.832 },
      playerScore: 99,
      isLegend: true,
    })),
    slot('sf', 'SF', player({
      name: 'LeBron James',
      position: 'SF',
      yearsWithTeam: '2015-2019',
      stats: { points: 27.5, rebounds: 8.6, assists: 9.1, steals: 1.4, blocks: 0.9, fieldGoalPct: 0.542, threePointPct: 0.367, freeThrowPct: 0.731 },
      playerScore: 94,
      isLegend: true,
    })),
    slot('pf', 'PF', player({
      name: 'Kevin Durant',
      position: 'PF',
      yearsWithTeam: '2015-2019',
      stats: { points: 28.2, rebounds: 8.2, assists: 5, steals: 1, blocks: 1.6, fieldGoalPct: 0.537, threePointPct: 0.375, freeThrowPct: 0.875 },
      playerScore: 93,
      isLegend: true,
    })),
    slot('c', 'C', player({
      name: 'Hakeem Olajuwon',
      position: 'C',
      yearsWithTeam: '1995-1999',
      stats: { points: 27.8, rebounds: 10.8, assists: 3.5, steals: 1.8, blocks: 3.4, fieldGoalPct: 0.517, threePointPct: 0.188, freeThrowPct: 0.756 },
      playerScore: 93,
      isLegend: true,
    })),
    slot('6man', 'SG', player({
      name: 'Deron Williams',
      position: 'SG',
      yearsWithTeam: '2010-2014',
      stats: { points: 19.2, rebounds: 3.7, assists: 10.5, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.458, threePointPct: 0.371, freeThrowPct: 0.849 },
      playerScore: 78,
      isAllStar: true,
    })),
  ];
}

describe('simulation explanation and elite rating behavior', () => {
  it('does not award full-team GSPR to an incomplete roster', () => {
    const power = computeTeamGSPR(godLineup().slice(0, 1), 'nba', 'combined');
    expect(power.gspr).toBeLessThan(250);
  });

  it('treats an all-time offensive lineup as a 100 offense', () => {
    const power = computeTeamGSPR(godLineup(), 'nba', 'combined');

    expect(Math.round(power.offenseScore)).toBe(100);
    expect(power.defenseScore).toBeGreaterThanOrEqual(90);
    expect(power.gspr).toBe(1000);
    expect(power.breakdown.join(' ')).toContain('Defense');
  });

  it('makes max GSPR much more likely to finish undefeated than the old curve', () => {
    expect(getBaseWinProbability(1000)).toBeGreaterThanOrEqual(0.998);
    expect(getBaseWinProbability(900)).toBeLessThan(getBaseWinProbability(1000));
  });

  it('gives every 990+ GSPR roster at least a 50 percent undefeated chance', () => {
    expect(estimateUndefeatedChance(990)).toBeGreaterThanOrEqual(49.999);
    expect(estimateUndefeatedChance(995)).toBeGreaterThan(50);
  });

  it('explains imperfect records with roster-specific basketball factors', async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    resetServerEnvForTests();

    const slots = godLineup();
    const power = computeTeamGSPR(slots, 'nba', 'combined');
    const simulated = {
      ...simulateSeason(power, 'nba', { pros: [], cons: [] }),
      wins: 80,
      losses: 2,
      recordLabel: '80-2',
      games: [
        {
          gameNumber: 1,
          win: false,
          scoreDiff: -3,
          opponentTier: 'Elite',
          opponentTeamId: '2',
          opponentName: 'Boston Celtics',
          opponentAbbreviation: 'BOS',
          opponentGspr: 900,
          isHome: true,
          teamScore: 110,
          opponentScore: 113,
        },
        {
          gameNumber: 2,
          win: false,
          scoreDiff: -1,
          opponentTier: 'Strong',
          opponentTeamId: '21',
          opponentName: 'Oklahoma City Thunder',
          opponentAbbreviation: 'OKC',
          opponentGspr: 920,
          isHome: false,
          teamScore: 118,
          opponentScore: 119,
        },
      ],
    };

    const explanation = await explainSeasonRecord(simulated, slots);
    const combined = `${explanation.recordJustification} ${explanation.recordFactors.join(' ')}`;

    expect(explanation.explanationSource).toBe('local');
    expect(combined).toContain('80-2');
    expect(combined).toMatch(/defense|offense|health|matchup|Elite/i);
    expect(combined).toMatch(/Stephen Curry|Kevin Durant|Michael Jordan|Hakeem Olajuwon/);

    if (previousKey) process.env.OPENAI_API_KEY = previousKey;
    resetServerEnvForTests();
  });
});
