import type { LeagueStanding, NBATeamStrength, TeamPower } from './types';
import { NBA_TEAMS } from './sports/nba';
import { buildLastSeasonStrength } from './nbaLastSeason';
import { clamp } from './utils';

const SEASON_GAMES = 82;
const ELITE_UNDEFEATED_GAME_FLOOR = Math.pow(0.5, 1 / SEASON_GAMES);

const LAST_SEASON_STRENGTHS = NBA_TEAMS.map(buildLastSeasonStrength);

export async function getDailyNbaTeamStrengths(): Promise<NBATeamStrength[]> {
  return LAST_SEASON_STRENGTHS;
}

export function getHardcodedNbaTeamStrengths(): NBATeamStrength[] {
  return LAST_SEASON_STRENGTHS;
}

export function buildNbaSchedule(teams: NBATeamStrength[], rand: () => number): NBATeamStrength[] {
  const shuffled = [...teams];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const schedule = shuffled.flatMap((team, index) => {
    const games = teams.length === 30
      ? index < 8 ? 4 : index < 14 ? 3 : 2
      : index < 10 ? 4 : index < 14 ? 3 : 2;
    return Array.from({ length: games }, () => team);
  });

  for (let i = schedule.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [schedule[i], schedule[j]] = [schedule[j], schedule[i]];
  }
  return schedule;
}

function expectedWinProbability(team: NBATeamStrength, opponent: NBATeamStrength, home: boolean): number {
  const gsprEdge = (team.gspr - opponent.gspr) / 950;
  const scoringEdge = (
    (team.pointsPerGame - opponent.pointsPerGame) +
    (opponent.opponentPointsPerGame - team.opponentPointsPerGame)
  ) / 38;
  const homeEdge = home ? 0.035 : -0.035;
  return clamp(0.5 + gsprEdge * 0.38 + scoringEdge * 0.22 + homeEdge, 0.12, 0.88);
}

export function rankLeagueStandings(standings: LeagueStanding[]): LeagueStanding[] {
  const overall = [...standings].sort((a, b) =>
    b.wins - a.wins || b.powerScore - a.powerScore || a.name.localeCompare(b.name)
  );

  overall.forEach((standing, index) => {
    standing.rank = index + 1;
  });

  for (const conference of ['East', 'West'] as const) {
    overall
      .filter(standing => standing.conference === conference)
      .sort((a, b) => b.wins - a.wins || b.powerScore - a.powerScore)
      .forEach((standing, index) => {
        standing.conferenceRank = index + 1;
        standing.playoffStatus = index < 6 ? 'playoffs' : index < 10 ? 'play-in' : 'lottery';
      });
  }
  return overall;
}

export function simulateLeagueStandings(
  teams: NBATeamStrength[],
  rand: () => number
): LeagueStanding[] {
  const provisional = teams.map(team => {
    const opponents = teams.filter(opponent => opponent.teamId !== team.teamId);
    const schedule = buildNbaSchedule(opponents, rand);
    let wins = 0;

    schedule.forEach((opponent, index) => {
      if (rand() < expectedWinProbability(team, opponent, index % 2 === 0)) wins++;
    });

    return {
      rank: 0,
      conferenceRank: 0,
      teamId: team.teamId,
      name: team.name,
      city: team.city,
      abbreviation: team.abbreviation,
      conference: team.conference,
      wins,
      losses: SEASON_GAMES - wins,
      gspr: team.gspr,
      powerScore: Math.round((team.gspr + wins * 2.4 + (team.offenseScore + team.defenseScore) * 0.4) * 10) / 10,
    } satisfies LeagueStanding;
  });
  return rankLeagueStandings(provisional);
}

export function matchupWinProbability(
  customPower: TeamPower,
  opponent: NBATeamStrength,
  isHome: boolean
): number {
  const customScoring = 104 + customPower.offenseScore * 0.18;
  const customAllowed = 126 - customPower.defenseScore * 0.18;
  const customStrength: NBATeamStrength = {
    teamId: 'custom',
    name: 'God Squad',
    city: '',
    abbreviation: 'GOD',
    conference: 'East',
    division: 'Custom',
    gspr: customPower.gspr,
    offenseScore: customPower.offenseScore,
    defenseScore: customPower.defenseScore,
    compositionAnalysis: { pros: [], cons: [] },
    rosterNames: [],
    startingLineup: [],
    baselineWins: 0,
    baselineLosses: 0,
    pointsPerGame: customScoring,
    opponentPointsPerGame: customAllowed,
    source: 'hardcoded-fallback',
    snapshotDate: opponent.snapshotDate,
  };

  const base = expectedWinProbability(customStrength, opponent, isHome);
  if (customPower.gspr >= 990) {
    const eliteProgress = (customPower.gspr - 990) / 10;
    const eliteFloor = ELITE_UNDEFEATED_GAME_FLOOR + eliteProgress * (0.9985 - ELITE_UNDEFEATED_GAME_FLOOR);
    return clamp(Math.max(base, eliteFloor), 0.08, 0.9985);
  }
  const godTierBoost = Math.max(0, customPower.gspr - 900) / 1000;
  return clamp(base + godTierBoost, 0.08, 0.985);
}
