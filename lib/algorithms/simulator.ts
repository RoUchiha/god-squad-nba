import { randomInt } from 'node:crypto';
import type {
  GameResult,
  FilledRosterSlot,
  NBATeamStrength,
  PlayerSeasonStatLine,
  SeasonResults,
  Sport,
  TeamCompositionAnalysis,
  TeamPower,
} from '../types';
import { SPORT_CONFIG } from '../constants';
import { clamp, getAchievement } from '../utils';
import {
  buildNbaSchedule,
  getHardcodedNbaTeamStrengths,
  matchupWinProbability,
  rankLeagueStandings,
  simulateLeagueStandings,
} from '../nbaLeague';
import { effectivePlayerScore } from '../effectivePlayerScore';

const WIN_PROB_CONFIG = { base: 0.620, range: 0.3785, power: 2.05 };

export function getBaseWinProbability(gspr: number, _sport?: Sport): number {
  if (gspr >= 990) {
    const floor = Math.pow(0.5, 1 / SPORT_CONFIG.gamesInSeason);
    return clamp(floor + ((gspr - 990) / 10) * (0.9985 - floor), floor, 0.9985);
  }
  const { base, range, power } = WIN_PROB_CONFIG;
  const normalized = Math.pow(gspr / 1000, power);
  return clamp(base + range * normalized, 0.05, 0.9985);
}

function opponentTier(gspr: number): string {
  if (gspr >= 875) return 'Elite';
  if (gspr >= 800) return 'Strong';
  if (gspr >= 710) return 'Average';
  if (gspr >= 650) return 'Weak';
  return 'Poor';
}

function scoringNoise(rand: () => number): number {
  return (rand() + rand() + rand() - 1.5) * 13;
}

function simulateGameScore(
  teamPower: TeamPower,
  opponent: NBATeamStrength,
  isHome: boolean,
  rand: () => number
): { teamScore: number; opponentScore: number; win: boolean } {
  const winProbability = matchupWinProbability(teamPower, opponent, isHome);
  const decidedWin = rand() < winProbability;
  const expectedMargin = Math.abs((winProbability - 0.5) * 28 + (isHome ? 1.5 : -1.5));
  const expectedTotal =
    214 +
    (teamPower.offenseScore + opponent.offenseScore - 150) * 0.42 -
    (teamPower.defenseScore + opponent.defenseScore - 150) * 0.16;
  const marginMagnitude = Math.max(1, Math.round(expectedMargin + Math.abs(scoringNoise(rand)) * 0.45));
  const margin = decidedWin ? marginMagnitude : -marginMagnitude;
  const total = expectedTotal + scoringNoise(rand) * 0.7;

  let teamScore = Math.max(78, Math.round((total + margin) / 2));
  let opponentScore = Math.max(78, Math.round((total - margin) / 2));

  return { teamScore, opponentScore, win: decidedWin };
}

function oneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function simulateRosterStats(
  slots: FilledRosterSlot[],
  teamPower: TeamPower,
  rand: () => number
): PlayerSeasonStatLine[] {
  const filled = slots.filter(slot => slot.player);
  if (filled.length === 0) return [];

  const targetPoints = 108 + teamPower.offenseScore * 0.16;
  const targetRebounds = 41 + teamPower.defenseScore * 0.055;
  const targetAssists = 21 + teamPower.offenseScore * 0.085;
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0) || 1;
  const pointScale = targetPoints / sum(filled.map(slot => {
    const player = slot.player!;
    return player.stats.points ?? effectivePlayerScore(slot, player) * 0.22;
  }));
  const reboundScale = targetRebounds / sum(filled.map(slot => slot.player!.stats.rebounds ?? 4));
  const assistScale = targetAssists / sum(filled.map(slot => slot.player!.stats.assists ?? 3));

  return filled.map(slot => {
    const player = slot.player!;
    const playerScore = effectivePlayerScore(slot, player);
    const variance = 0.96 + rand() * 0.08;
    const sixthMan = slot.id === '6man';
    return {
      playerId: player.id,
      name: player.name,
      position: player.position,
      slotLabel: slot.label,
      playerScore,
      gamesPlayed: Math.max(62, Math.min(82, Math.round(78 + rand() * 5 - (sixthMan ? 1 : 0)))),
      minutes: oneDecimal((sixthMan ? 27.5 : 31.5) + playerScore * 0.035 + rand() * 1.6),
      points: oneDecimal((player.stats.points ?? playerScore * 0.22) * pointScale * variance),
      rebounds: oneDecimal((player.stats.rebounds ?? 4) * reboundScale * variance),
      assists: oneDecimal((player.stats.assists ?? 3) * assistScale * variance),
      steals: oneDecimal((player.stats.steals ?? 0.8) * (0.94 + rand() * 0.12)),
      blocks: oneDecimal((player.stats.blocks ?? 0.4) * (0.94 + rand() * 0.12)),
      fieldGoalPct: oneDecimal(clamp((player.stats.fieldGoalPct ?? 0.45) + (rand() - 0.5) * 0.018, 0.32, 0.72) * 1000) / 1000,
      threePointPct: oneDecimal(clamp((player.stats.threePointPct ?? 0.32) + (rand() - 0.5) * 0.024, 0, 0.58) * 1000) / 1000,
      freeThrowPct: oneDecimal(clamp((player.stats.freeThrowPct ?? 0.75) + (rand() - 0.5) * 0.018, 0.45, 0.98) * 1000) / 1000,
    };
  }).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

export function simulateSeason(
  teamPower: TeamPower,
  _sport?: Sport,
  compositionAnalysis: TeamCompositionAnalysis = { pros: [], cons: [] },
  teamStrengths: NBATeamStrength[] = getHardcodedNbaTeamStrengths(),
  rosterSlots: FilledRosterSlot[] = []
): SeasonResults {
  const totalGames = SPORT_CONFIG.gamesInSeason;
  const games: GameResult[] = [];
  let wins = 0;
  let losses = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  let seed = randomInt(0, 0x100000000);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  const schedule = buildNbaSchedule(teamStrengths, rand);

  schedule.forEach((opponent, index) => {
    const isHome = index % 2 === 0;
    const score = simulateGameScore(teamPower, opponent, isHome, rand);

    games.push({
      gameNumber: index + 1,
      win: score.win,
      scoreDiff: score.teamScore - score.opponentScore,
      opponentTier: opponentTier(opponent.gspr),
      opponentTeamId: opponent.teamId,
      opponentName: `${opponent.city} ${opponent.name}`,
      opponentAbbreviation: opponent.abbreviation,
      opponentGspr: opponent.gspr,
      isHome,
      teamScore: score.teamScore,
      opponentScore: score.opponentScore,
    });

    if (score.win) {
      wins++;
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      losses++;
      currentStreak = 0;
    }
  });

  const isUndefeated = losses === 0;
  const { title: achievement, subtext: achievementSubtext } = getAchievement(wins, losses, 'nba');
  const realTeamStandings = simulateLeagueStandings(teamStrengths, rand);
  const customStanding = {
    rank: 0,
    conferenceRank: 0,
    teamId: 'custom',
    name: 'God Squad',
    city: 'Your',
    abbreviation: 'GOD',
    conference: 'East' as const,
    wins,
    losses,
    gspr: teamPower.gspr,
    powerScore: teamPower.gspr + wins * 2.4 + (teamPower.offenseScore + teamPower.defenseScore) * 0.4,
    isCustomTeam: true,
  };
  const leagueStandings = rankLeagueStandings([...realTeamStandings, customStanding]);
  const rosterStats = simulateRosterStats(rosterSlots, teamPower, rand);

  return {
    sport: 'nba',
    wins,
    losses,
    totalGames,
    games,
    teamPower,
    compositionAnalysis,
    isUndefeated,
    longestWinStreak: longestStreak,
    leagueStandings,
    rosterStats,
    teamStrengthSnapshotDate: teamStrengths[0]?.snapshotDate ?? new Date().toISOString().slice(0, 10),
    achievement,
    achievementSubtext,
    recordLabel: `${wins}-${losses}`,
  };
}

export function estimateUndefeatedChance(gspr: number): number {
  const p = getBaseWinProbability(gspr);
  return Math.pow(p, SPORT_CONFIG.gamesInSeason) * 100;
}
