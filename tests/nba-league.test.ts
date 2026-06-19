import { describe, expect, it } from 'vitest';
import { computeTeamGSPR } from '../lib/algorithms/powerRating';
import { simulateSeason } from '../lib/algorithms/simulator';
import {
  buildNbaSchedule,
  getHardcodedNbaTeamStrengths,
  simulateLeagueStandings,
} from '../lib/nbaLeague';
import type { FilledRosterSlot, Player } from '../lib/types';

function seededRandom(seedValue = 42): () => number {
  let seed = seedValue;
  return () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
}

function player(name: string, position: Player['position'], score: number): Player {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    position,
    positionGroup: 'offense',
    yearsWithTeam: '2020-2024',
    stats: {
      points: 25,
      rebounds: 7,
      assists: 6,
      steals: 1.5,
      blocks: position === 'C' ? 2 : 0.7,
      fieldGoalPct: 0.5,
      threePointPct: 0.39,
      freeThrowPct: 0.85,
    },
    playerScore: score,
    isLegend: score >= 90,
  };
}

function customSlots(): FilledRosterSlot[] {
  const positions: Player['position'][] = ['PG', 'SG', 'SF', 'PF', 'C', 'SG'];
  return positions.map((position, index) => ({
    id: index === 5 ? '6man' : position.toLowerCase(),
    position,
    label: position,
    group: 'offense',
    required: true,
    player: player(`Player ${index + 1}`, position, 96 - index),
  }));
}

describe('NBA league simulation', () => {
  it('pins all opponent teams to 2024-25 records and starting lineups', () => {
    const teams = getHardcodedNbaTeamStrengths();
    expect(teams).toHaveLength(30);
    expect(teams.every(team => team.source === '2024-25-baseline')).toBe(true);
    expect(teams.every(team => team.baselineWins + team.baselineLosses === 82)).toBe(true);
    expect(teams.every(team => team.startingLineup.length === 5)).toBe(true);
    expect(teams.find(team => team.abbreviation === 'OKC')?.baselineWins).toBe(68);
  });
  it('builds an 82-game schedule from all 30 real NBA teams', () => {
    const teams = getHardcodedNbaTeamStrengths();
    const schedule = buildNbaSchedule(teams, seededRandom());
    const appearances = new Set(schedule.map(team => team.teamId));

    expect(teams).toHaveLength(30);
    expect(schedule).toHaveLength(82);
    expect(appearances.size).toBe(30);
  });

  it('generates scored games and fresh 30-team power standings', () => {
    const teams = getHardcodedNbaTeamStrengths();
    const power = computeTeamGSPR(customSlots(), 'nba', 'combined');
    const slots = customSlots();
    const results = simulateSeason(power, 'nba', { pros: [], cons: [] }, teams, slots);

    expect(results.games).toHaveLength(82);
    expect(results.games[0].opponentName.length).toBeGreaterThan(0);
    expect(results.games[0].teamScore).toBeGreaterThan(0);
    expect(results.games[0].opponentScore).toBeGreaterThan(0);
    expect(results.leagueStandings).toHaveLength(31);
    expect(results.leagueStandings.some(team => team.isCustomTeam)).toBe(true);
    expect(results.rosterStats).toHaveLength(6);
    expect(results.rosterStats.every(line => line.gamesPlayed > 0 && line.points > 0)).toBe(true);
    expect(results.leagueStandings[0].rank).toBe(1);
    expect(results.leagueStandings.every(team => team.wins + team.losses === 82)).toBe(true);
  });

  it('varies league records between runs while preserving team strength values', () => {
    const teams = getHardcodedNbaTeamStrengths();
    const first = simulateLeagueStandings(teams, seededRandom(1));
    const second = simulateLeagueStandings(teams, seededRandom(2));
    const firstStrengths = Object.fromEntries(first.map(team => [team.teamId, team.gspr]));
    const secondStrengths = Object.fromEntries(second.map(team => [team.teamId, team.gspr]));

    expect(firstStrengths).toEqual(secondStrengths);
    expect(first.map(team => `${team.teamId}:${team.wins}`)).not.toEqual(
      second.map(team => `${team.teamId}:${team.wins}`)
    );
  });

  it('gives immediate back-to-back season requests independent results', () => {
    const teams = getHardcodedNbaTeamStrengths();
    const power = computeTeamGSPR(customSlots(), 'nba', 'combined');
    const first = simulateSeason(power, 'nba', { pros: [], cons: [] }, teams);
    const second = simulateSeason(power, 'nba', { pros: [], cons: [] }, teams);

    expect(first.leagueStandings.map(team => `${team.teamId}:${team.wins}`)).not.toEqual(
      second.leagueStandings.map(team => `${team.teamId}:${team.wins}`)
    );
  });
});
