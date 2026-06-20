import { describe, expect, it } from 'vitest';
import { generateTeamEras } from '../lib/constants';
import { normalizePlayerName } from '../lib/playerIdentity';
import { playerEligiblePositions } from '../lib/playerRoles';
import {
  getCuratedNBAEraCatalog,
  NBA_CURATED_ERA_KEYS,
  NBA_PLAYABLE_ERA_COUNT,
  NBA_TEAMS,
  fetchNBAPlayers,
} from '../lib/sports/nba';
import type { Player, Position } from '../lib/types';

const REQUIRED_POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];

function rosterOverlap(a: Player[], b: Player[]): number {
  const aNames = new Set(a.map(player => normalizePlayerName(player.name)));
  const bNames = new Set(b.map(player => normalizePlayerName(player.name)));
  const matches = [...aNames].filter(name => bNames.has(name)).length;
  return Math.max(matches / Math.max(1, aNames.size), matches / Math.max(1, bNames.size));
}

describe('NBA curated rosters', () => {
  it('exports one roster-backed playable catalog covering all 30 teams', async () => {
    const catalog = getCuratedNBAEraCatalog();
    const teamIds = new Set(catalog.map(entry => entry.team.id));

    expect(catalog).toHaveLength(NBA_PLAYABLE_ERA_COUNT);
    expect(new Set(catalog.map(entry => entry.key)).size).toBe(catalog.length);
    expect(teamIds.size).toBe(NBA_TEAMS.length);

    for (const entry of catalog) {
      const players = await fetchNBAPlayers(entry.team, entry.era);
      const positions = new Set(players.map(player => player.position));
      expect(players.length).toBeGreaterThanOrEqual(6);
      expect(players.every(player => !player.id.startsWith('nba-fb-'))).toBe(true);
      for (const position of REQUIRED_POSITIONS) {
        expect(positions.has(position)).toBe(true);
        expect(players.some(player => playerEligiblePositions(player).includes(position))).toBe(true);
      }
    }
  });

  it('keeps at least three playable team-eras per franchise', () => {
    const catalog = getCuratedNBAEraCatalog();
    const eraCountsByTeam = catalog.reduce<Map<string, number>>((counts, entry) => {
      counts.set(entry.team.id, (counts.get(entry.team.id) ?? 0) + 1);
      return counts;
    }, new Map());

    expect(eraCountsByTeam.size).toBe(NBA_TEAMS.length);
    for (const team of NBA_TEAMS) {
      expect(eraCountsByTeam.get(team.id) ?? 0).toBeGreaterThanOrEqual(3);
    }
  });

  it('combines adjacent playable team-eras once their rosters overlap by at least 50%', async () => {
    const catalogByTeam = getCuratedNBAEraCatalog().reduce<Map<string, ReturnType<typeof getCuratedNBAEraCatalog>>>(
      (teams, entry) => {
        const entries = teams.get(entry.team.id) ?? [];
        entries.push(entry);
        teams.set(entry.team.id, entries);
        return teams;
      },
      new Map()
    );

    for (const entries of catalogByTeam.values()) {
      const sortedEntries = [...entries].sort((a, b) => a.era.startYear - b.era.startYear);
      for (let i = 1; i < sortedEntries.length; i += 1) {
        const previous = sortedEntries[i - 1];
        const current = sortedEntries[i];
        if (current.era.startYear - previous.era.startYear !== 5) continue;

        const previousPlayers = await fetchNBAPlayers(previous.team, previous.era);
        const currentPlayers = await fetchNBAPlayers(current.team, current.era);

        expect(rosterOverlap(previousPlayers, currentPlayers)).toBeLessThan(0.5);
      }
    }
  });

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

  it('uses the full combined year range for players from merged adjacent eras', async () => {
    const celtics = NBA_TEAMS.find(team => team.abbreviation === 'BOS')!;
    const catalogEntry = getCuratedNBAEraCatalog().find(entry => entry.key === '2-nba-2-1980')!;
    const players = await fetchNBAPlayers(celtics, catalogEntry.era);

    expect(catalogEntry.era.endYear).toBe(1994);
    expect(players.every(player => player.yearsWithTeam === '1980-1994')).toBe(true);
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
