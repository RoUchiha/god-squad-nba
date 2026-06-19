import { describe, expect, it } from 'vitest';
import { generateTeamEras } from '../lib/constants';
import { NBA_CURATED_ERA_KEYS, NBA_TEAMS, fetchNBAPlayers } from '../lib/sports/nba';

describe('NBA curated rosters', () => {
  it('uses the curated 2020-2024 Warriors roster and ranks Stephen Curry first', async () => {
    const warriors = NBA_TEAMS.find(team => team.abbreviation === 'GSW');
    expect(warriors).toBeDefined();

    const era = generateTeamEras(warriors!).find(item => item.id === 'nba-10-2020');
    expect(era).toBeDefined();

    const players = await fetchNBAPlayers(warriors!, era!);
    const names = players.map(player => player.name);

    expect(players[0].name).toBe('Stephen Curry');
    expect(players[0].playerScore).toBeGreaterThan(players[1].playerScore);
    expect(players[0].stats.points).toBe(32.0);
    expect(players[0].stats.rebounds).toBe(6.1);
    expect(players[0].stats.assists).toBe(6.3);
    expect(players[0].stats.fieldGoalPct).toBe(0.493);
    expect(players[0].stats.threePointPct).toBe(0.427);
    expect(players[0].stats.freeThrowPct).toBe(0.923);
    expect(names).toContain('Klay Thompson');
    expect(names).toContain('Draymond Green');
    expect(names).not.toContain('LJ Cryer');
  });

  it('keeps the 2005-09 Celtics championship core above role-player ratings', async () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS');
    const era = generateTeamEras(celtics!).find(item => item.id === 'nba-2-2005');
    const players = await fetchNBAPlayers(celtics!, era!);
    const core = players.filter(player => ['Paul Pierce', 'Kevin Garnett', 'Ray Allen'].includes(player.name));

    expect(core).toHaveLength(3);
    expect(core.every(player => player.playerScore >= 84)).toBe(true);
    expect(players.find(player => player.name === 'Paul Pierce')?.stats.points).toBe(26.8);
    expect(players.find(player => player.name === 'Ray Allen')?.stats.freeThrowPct).toBe(0.952);
  });

  it('keeps every curated player score on the absolute 25-99 scale', async () => {
    for (const team of NBA_TEAMS) {
      const eras = generateTeamEras(team).filter(era =>
        NBA_CURATED_ERA_KEYS.includes(`${team.id}-${era.id}`)
      );
      for (const era of eras) {
        const players = await fetchNBAPlayers(team, era);
        expect(players.every(player => player.playerScore >= 25 && player.playerScore <= 99)).toBe(true);
        expect(new Set(players.map(player => player.name)).size).toBe(players.length);
        expect(players[0].playerScore).toBeGreaterThanOrEqual(players.at(-1)?.playerScore ?? 0);
      }
    }
  });
});
